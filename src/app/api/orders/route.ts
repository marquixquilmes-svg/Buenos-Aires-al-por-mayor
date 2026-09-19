import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { getDb } from '@/lib/db/client';
import { products } from '@/lib/catalog';
import { calculateCartTotal, validateCart, type CartLine } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const body = await request.json().catch(() => null) as { items?: CartLine[] } | null;
  if (!body?.items?.length || !validateCart(body.items, products)) {
    return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
  }

  const db = getDb();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const total = calculateCartTotal(body.items, products);
    const order = await client.query(
      'insert into orders (user_id, status, total) values ($1, $2, $3) returning id, status, total, created_at',
      [session.user_id, 'pending', total],
    );

    for (const line of body.items) {
      const product = products.find(item => item.id === line.productId);
      if (!product) throw new Error('Product not found');
      await client.query(
        'insert into order_items (order_id, product_id, quantity, unit_price) values ($1, $2, $3, $4)',
        [order.rows[0].id, product.id, line.quantity, product.price],
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true, order: order.rows[0] }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation failed', error);
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  } finally {
    client.release();
  }
}
