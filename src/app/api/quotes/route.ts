import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/session';
import { ensureDatabaseReady } from '@/lib/db/client';
import { getMercadoPagoOrder } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  const session = await getRequestSession(request);
  if (!session) return NextResponse.json({ error: 'Ingresá a tu cuenta.' }, { status: 401 });
  const db = await ensureDatabaseReady();
  const pending = await db.query('select id,payment_order_id from quote_requests where user_id=$1 and status=$2 and payment_order_id is not null order by created_at desc limit 10', [session.user_id,'payment_pending']);
  for (const quote of pending.rows) {
    try {
      const mp = await getMercadoPagoOrder(quote.payment_order_id);
      const status = String(mp.status ?? '').toLowerCase();
      if (status === 'processed' || status === 'approved') await db.query(`update quote_requests set status='paid',payment_status_detail=$1,updated_at=now() where id=$2 and payment_order_id=$3 and status='payment_pending'`, [String(mp.status_detail ?? status),quote.id,quote.payment_order_id]);
      else if (['cancelled','canceled','rejected','failed','expired'].includes(status)) await db.query(`update quote_requests set status='quoted',payment_status_detail=$1,updated_at=now() where id=$2 and payment_order_id=$3 and status='payment_pending'`, [String(mp.status_detail ?? status),quote.id,quote.payment_order_id]);
    } catch (error) { console.error('Quote payment sync failed', { quoteId:quote.id,error }); }
  }
  const result = await db.query('select * from quote_requests where user_id=$1 order by created_at desc limit 100', [session.user_id]);
  return NextResponse.json({ quotes: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await getRequestSession(request);
  if (!session) return NextResponse.json({ error: 'Ingresá a tu cuenta.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const category = String(body?.category ?? '').trim();
  const description = String(body?.description ?? '').trim();
  const deliveryAddress = String(body?.deliveryAddress ?? '').trim();
  const phone = String(body?.phone ?? '').trim();
  const quantity = Number(body?.quantity);
  const referenceUrl = String(body?.referenceUrl ?? '').trim();
  if (!category || category.length > 80 || description.length < 8 || description.length > 2000 ||
      deliveryAddress.length < 8 || deliveryAddress.length > 300 || phone.replace(/\D/g, '').length < 8 ||
      phone.length > 30 || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100000) {
    return NextResponse.json({ error: 'Revisá los datos de la solicitud.' }, { status: 400 });
  }
  if (referenceUrl && (referenceUrl.length > 500 || !/^https?:\/\//i.test(referenceUrl))) {
    return NextResponse.json({ error: 'El enlace de referencia debe ser http o https.' }, { status: 400 });
  }
  const db = await ensureDatabaseReady();
  const result = await db.query(
    `insert into quote_requests(user_id,category,description,quantity,reference_url,delivery_address,phone)
     values($1,$2,$3,$4,$5,$6,$7) returning *`,
    [session.user_id, category, description, quantity, referenceUrl || null, deliveryAddress, phone],
  );
  return NextResponse.json({ quote: result.rows[0] }, { status: 201 });
}
