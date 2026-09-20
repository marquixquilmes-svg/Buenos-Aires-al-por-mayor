import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { getDb } from '@/lib/db/client';
import { products } from '@/lib/catalog';
import { calculateCartTotal, validateCart, type CartLine } from '@/lib/checkout';

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function describeError(error: unknown) {
  if (error && typeof error === 'object') {
    const candidate = error as { name?: unknown; message?: unknown; code?: unknown; detail?: unknown; constraint?: unknown };
    return {
      name: typeof candidate.name === 'string' ? candidate.name : 'Error',
      message: typeof candidate.message === 'string' ? candidate.message : 'Unknown error',
      code: typeof candidate.code === 'string' ? candidate.code : undefined,
      detail: typeof candidate.detail === 'string' ? candidate.detail : undefined,
      constraint: typeof candidate.constraint === 'string' ? candidate.constraint : undefined,
    };
  }
  return { name: 'Error', message: String(error) };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    items?: CartLine[];
    customer?: { name?: unknown; email?: unknown; phone?: unknown; address?: unknown };
    acceptedTerms?: unknown;
  } | null;

  if (!body?.items?.length || !validateCart(body.items, products)) {
    return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
  }

  if (body.acceptedTerms !== true) {
    return NextResponse.json({ error: 'Debés aceptar los Términos y Condiciones para confirmar el pedido.' }, { status: 400 });
  }

  const name = clean(body.customer?.name);
  const email = clean(body.customer?.email).toLowerCase();
  const phone = clean(body.customer?.phone);
  const address = clean(body.customer?.address);

  if (!name || !email || !phone || !address) {
    return NextResponse.json({ error: 'Nombre, email, teléfono y dirección son obligatorios.' }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Ingresá un email válido.' }, { status: 400 });
  }
  if (phone.replace(/\D/g, '').length < 8) {
    return NextResponse.json({ error: 'Ingresá un teléfono válido.' }, { status: 400 });
  }
  if (address.length < 8) {
    return NextResponse.json({ error: 'Ingresá una dirección completa.' }, { status: 400 });
  }

  let client: Awaited<ReturnType<ReturnType<typeof getDb>['connect']>> | undefined;
  try {
    const session = await getCurrentSession();
    const db = getDb();
    client = await db.connect();
    await client.query('BEGIN');

    const total = calculateCartTotal(body.items, products);
    const order = await client.query(
      `insert into orders (user_id, status, total, guest_name, guest_email, guest_phone, guest_address, accepted_terms_at)
       values ($1, $2, $3, $4, $5, $6, $7, now())
       returning id, status, total, created_at`,
      [session?.user_id ?? null, 'pending', total, name, email, phone, address],
    );

    for (const line of body.items) {
      const product = products.find(item => item.id === line.productId);
      if (!product) throw new Error('Product not found');
      await client.query(
        `insert into products (id, name, slug, category, price, stock, active)
         values ($1, $2, $3, $4, $5, 999999, true)
         on conflict (id) do update set name = excluded.name, category = excluded.category, price = excluded.price, active = true`,
        [product.id, product.name, product.id, product.category, product.price],
      );
      await client.query(
        'insert into order_items (order_id, product_id, product_name, quantity, unit_price) values ($1, $2, $3, $4, $5)',
        [order.rows[0].id, product.id, product.name, line.quantity, product.price],
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true, order: order.rows[0] }, { status: 201 });
  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch { /* ignore rollback failure */ }
    }
    const diagnostic = describeError(error);
    console.error('Order creation failed', diagnostic);
    return NextResponse.json({
      error: 'No se pudo crear el pedido.',
      diagnostic: {
        name: diagnostic.name,
        message: diagnostic.message,
        code: diagnostic.code,
        constraint: diagnostic.constraint,
      },
    }, { status: 500 });
  } finally {
    client?.release();
  }
}
