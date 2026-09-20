import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { products } from '@/lib/catalog';
import { calculateCartTotal, validateCart, type CartLine } from '@/lib/checkout';
import { createMercadoPagoOrder } from '@/lib/mercadopago';

function clean(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      items?: CartLine[];
      customer?: { name?: unknown; email?: unknown; phone?: unknown; address?: unknown };
      acceptedTerms?: unknown;
      payNow?: unknown;
    } | null;

    if (!body?.items?.length || !validateCart(body.items, products)) return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
    if (body.acceptedTerms !== true) return NextResponse.json({ error: 'Debés aceptar los Términos y Condiciones para confirmar el pedido.' }, { status: 400 });

    const name = clean(body.customer?.name), email = clean(body.customer?.email).toLowerCase();
    const phone = clean(body.customer?.phone), address = clean(body.customer?.address);
    if (!name || !email || !phone || !address) return NextResponse.json({ error: 'Nombre, email, teléfono y dirección son obligatorios.' }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Ingresá un email válido.' }, { status: 400 });
    if (phone.replace(/\D/g, '').length < 8) return NextResponse.json({ error: 'Ingresá un teléfono válido.' }, { status: 400 });
    if (address.length < 8) return NextResponse.json({ error: 'Ingresá una dirección completa.' }, { status: 400 });

    const db = getDb();
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const total = calculateCartTotal(body.items, products);
      const order = await client.query(
        `insert into orders (user_id, status, total, guest_name, guest_email, guest_phone, guest_address, accepted_terms_at, payment_status, payment_provider)
         values ($1, 'pending', $2, $3, $4, $5, $6, now(), 'pending', 'mercadopago')
         returning id, status, total, payment_status, created_at`,
        [null, total, name, email, phone, address],
      );
      const orderId = order.rows[0].id as string;

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
          [orderId, product.id, product.name, line.quantity, product.price],
        );
      }

      let payment: { id: string; checkout_url: string } | null = null;
      if (body.payNow !== false) {
        payment = await createMercadoPagoOrder({
          orderId,
          total: Number(total),
          email,
          items: body.items.map(line => {
            const product = products.find(item => item.id === line.productId)!;
            return { title: product.name, quantity: line.quantity, unit_price: product.price };
          }),
          baseUrl: new URL(request.url).origin,
        });
        await client.query(
          `update orders set payment_order_id = $1, payment_status_detail = $2, updated_at = now() where id = $3`,
          [payment.id, 'created', orderId],
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ ok: true, order: { ...order.rows[0], id: orderId }, checkoutUrl: payment?.checkout_url ?? null }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('Order creation failed', error);
      return NextResponse.json({ error: 'No se pudo crear el pedido. Intentá nuevamente.' }, { status: 500 });
    } finally { client.release(); }
  } catch (error) {
    console.error('Order request failed', error);
    return NextResponse.json({ error: 'No se pudo procesar el pedido. Intentá nuevamente.' }, { status: 500 });
  }
}
