import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabaseReady } from '@/lib/db/client';
import { calculateCartTotal, validateCart, type CartLine } from '@/lib/checkout';
import { createMercadoPagoOrder } from '@/lib/mercadopago';

function clean(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }

type DbProduct = {
  id:string; name:string; category:string; price:number|string; stock:number; active:boolean; sku:string|null;
  image_url:string|null; supplier_id:string|null; catalog_id:string|null; supplier_name:string|null; catalog_name:string|null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      items?: CartLine[];
      customer?: { name?: unknown; email?: unknown; phone?: unknown; address?: unknown };
      acceptedTerms?: unknown;
      payNow?: unknown;
    } | null;

    if (!body?.items?.length) return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    const db = await ensureDatabaseReady();
    const productIds = [...new Set(body.items.map(line => line.productId))];
    const productResult = await db.query<DbProduct>(
      `select p.id,p.name,p.category,p.price,p.stock,p.active,p.sku,p.image_url,p.supplier_id,p.catalog_id,
              s.name as supplier_name,c.name as catalog_name
       from products p
       left join suppliers s on s.id=p.supplier_id
       left join catalogs c on c.id=p.catalog_id
       where p.id = any($1::text[])`,
      [productIds],
    );
    const products = productResult.rows;
    const productMap = new Map(products.map(product => [String(product.id), product]));
    const cartCatalog = products.map(p => ({ id:String(p.id), name:p.name, category:p.category, price:Number(p.price), unit:'unidad' }));
    if (!validateCart(body.items, cartCatalog)) return NextResponse.json({ error: 'Uno o más productos ya no están disponibles.' }, { status: 400 });
    if (body.items.some(line => { const p=productMap.get(line.productId); return !p || !p.active || line.quantity > Number(p.stock); })) return NextResponse.json({ error: 'Uno o más productos no tienen stock suficiente.' }, { status: 400 });

    if (body.acceptedTerms !== true) return NextResponse.json({ error: 'Debés aceptar los Términos y Condiciones para confirmar el pedido.' }, { status: 400 });
    const name = clean(body.customer?.name), email = clean(body.customer?.email).toLowerCase();
    const phone = clean(body.customer?.phone), address = clean(body.customer?.address);
    if (!name || !email || !phone || !address) return NextResponse.json({ error: 'Nombre, email, teléfono y dirección son obligatorios.' }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Ingresá un email válido.' }, { status: 400 });
    if (phone.replace(/\D/g, '').length < 8) return NextResponse.json({ error: 'Ingresá un teléfono válido.' }, { status: 400 });
    if (address.length < 8) return NextResponse.json({ error: 'Ingresá una dirección completa.' }, { status: 400 });

    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const total = calculateCartTotal(body.items, cartCatalog);
      const order = await client.query(
        `insert into orders (user_id, status, total, guest_name, guest_email, guest_phone, guest_address, accepted_terms_at, payment_status, payment_provider)
         values ($1, 'pending', $2, $3, $4, $5, $6, now(), 'pending', 'mercadopago')
         returning id, status, total, payment_status, created_at`,
        [null, total, name, email, phone, address],
      );
      const orderId = order.rows[0].id as string;

      for (const line of body.items) {
        const product = productMap.get(line.productId);
        if (!product) throw new Error('Product not found');
        await client.query(
          `insert into order_items (order_id, product_id, product_name, quantity, unit_price, supplier_id, catalog_id, sku, supplier_name, catalog_name)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [orderId, product.id, product.name, line.quantity, product.price, product.supplier_id, product.catalog_id, product.sku, product.supplier_name, product.catalog_name],
        );
      }

      let payment: { id: string; checkout_url: string } | null = null;
      if (body.payNow !== false) {
        payment = await createMercadoPagoOrder({
          orderId,
          total: Number(total),
          email,
          items: body.items.map(line => { const product = productMap.get(line.productId)!; return { title: product.name, quantity: line.quantity, unit_price: Number(product.price) }; }),
          baseUrl: new URL(request.url).origin,
        });
        await client.query(`update orders set payment_order_id=$1,payment_status_detail=$2 where id=$3`, [payment.id, 'created', orderId]);
      }

      await client.query('COMMIT');
      return NextResponse.json({ ok:true, order:{...order.rows[0],id:orderId}, checkoutUrl:payment?.checkout_url??null }, { status:201 });
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('Order creation failed', error);
      return NextResponse.json({ error:'No se pudo crear el pedido. Intentá nuevamente.' }, { status:500 });
    } finally { client.release(); }
  } catch (error) {
    console.error('Order request failed', error);
    return NextResponse.json({ error:'No se pudo procesar el pedido. Intentá nuevamente.' }, { status:500 });
  }
}
