import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { ensureDatabaseReady } from '@/lib/db/client';

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  const db = await ensureDatabaseReady();
  const result = await db.query(`select q.*,u.email from quote_requests q join users u on u.id=q.user_id order by q.created_at desc limit 200`);
  return NextResponse.json({ quotes: result.rows });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  const db = await ensureDatabaseReady();
  if (body?.status === 'quoted') {
    const itemPrice = Number(body.itemPrice), shippingPrice = Number(body.shippingPrice);
    const expires = new Date(body.expiresAt);
    if (!Number.isFinite(itemPrice) || itemPrice <= 0 || !Number.isFinite(shippingPrice) || shippingPrice < 0 ||
        !/^\d+(\.\d{1,2})?$/.test(String(body.itemPrice)) || !/^\d+(\.\d{1,2})?$/.test(String(body.shippingPrice)) ||
        !Number.isFinite(expires.getTime()) || expires.getTime() <= Date.now() ||
        String(body.note ?? '').length > 500) return NextResponse.json({ error: 'Revisá precio, envío y vigencia.' }, { status: 400 });
    const result = await db.query(
      `update quote_requests set item_price=$1,shipping_price=$2,quote_expires_at=$3,quote_note=$4,status='quoted',updated_at=now()
       where id=$5 and status in ('requested','quoted') returning *`,
      [itemPrice, shippingPrice, expires, String(body.note ?? '').trim(), id],
    );
    if (!result.rowCount) return NextResponse.json({ error: 'La solicitud ya avanzó o no existe.' }, { status: 409 });
    return NextResponse.json({ quote: result.rows[0] });
  }
  const status = String(body?.status ?? '');
  if (!['preparing','shipped','delivered','cancelled'].includes(status)) return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 });
  const previous = status === 'preparing' ? ['paid'] : status === 'shipped' ? ['paid','preparing'] : status === 'delivered' ? ['shipped'] : ['requested','quoted'];
  const tracking = String(body?.tracking ?? '').trim();
  if (tracking.length > 300) return NextResponse.json({ error: 'Seguimiento demasiado largo.' }, { status: 400 });
  const result = await db.query(
    `update quote_requests set status=$1,tracking=$2,updated_at=now() where id=$3 and status=any($4::text[]) returning *`,
    [status, tracking || null, id, previous],
  );
  if (!result.rowCount) return NextResponse.json({ error: 'Transición de estado no permitida.' }, { status: 409 });
  return NextResponse.json({ quote: result.rows[0] });
}
