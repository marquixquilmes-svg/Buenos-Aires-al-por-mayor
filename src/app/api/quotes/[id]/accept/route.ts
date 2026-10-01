import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/session';
import { ensureDatabaseReady } from '@/lib/db/client';
import { createMercadoPagoOrder } from '@/lib/mercadopago';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getRequestSession(request);
  if (!session) return NextResponse.json({ error: 'Ingresá a tu cuenta.' }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  const db = await ensureDatabaseReady();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'select q.*,u.email from quote_requests q join users u on u.id=q.user_id where q.id=$1 and q.user_id=$2 for update of q',
      [id, session.user_id],
    );
    const q = result.rows[0];
    if (!q) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 }); }
    if (q.status !== 'quoted' || !q.quote_expires_at || new Date(q.quote_expires_at).getTime() <= Date.now()) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'La cotización venció o ya fue aceptada.' }, { status: 409 });
    }
    const total = Number(q.item_price) + Number(q.shipping_price);
    const mp = await createMercadoPagoOrder({
      orderId: q.id, total, email: q.email, baseUrl: new URL(request.url).origin, returnPath: '/cotizar',
      items: [{ title: q.description.slice(0, 120), quantity: q.quantity, unit_price: Number(q.item_price) / q.quantity }],
    });
    await client.query(`update quote_requests set status='payment_pending',payment_order_id=$1,updated_at=now() where id=$2`, [mp.id, id]);
    await client.query('COMMIT');
    return NextResponse.json({ checkoutUrl: mp.checkout_url });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('Quote acceptance failed', error);
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Intentá nuevamente.' }, { status: 500 });
  } finally { client.release(); }
}
