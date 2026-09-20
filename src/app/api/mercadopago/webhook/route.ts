import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { getMercadoPagoOrder, verifyMercadoPagoSignature } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const dataId = String(body?.data?.id ?? request.nextUrl.searchParams.get('data.id') ?? '');
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');

    if (!verifyMercadoPagoSignature({ signature, requestId, dataId })) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (body?.type !== 'order' && body?.action !== 'order.processed' && body?.action !== 'order.updated') {
      return NextResponse.json({ ok: true });
    }

    const mpOrder = await getMercadoPagoOrder(dataId);
    const externalReference = mpOrder?.external_reference;
    if (!externalReference) return NextResponse.json({ ok: true });

    const status = String(mpOrder.status ?? '').toLowerCase();
    const paymentStatus = status === 'processed' || status === 'approved' ? 'approved'
      : status === 'cancelled' || status === 'canceled' ? 'cancelled'
      : status === 'rejected' ? 'rejected' : 'pending';

    const db = getDb();
    await db.query(
      `update orders
       set payment_status = $1, payment_status_detail = $2,
           status = case when $1 = 'approved' then 'confirmed' else status end,
           updated_at = now()
       where id = $3::uuid and payment_order_id = $4`,
      [paymentStatus, String(mpOrder.status_detail ?? status), externalReference, dataId],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Mercado Pago webhook failed', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() { return NextResponse.json({ ok: true }); }
