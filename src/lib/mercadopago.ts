import crypto from 'node:crypto';

const MP_API = 'https://api.mercadopago.com/v1/orders';

function accessToken() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('MP_ACCESS_TOKEN is not configured');
  return token;
}

export type MercadoPagoItem = {
  title: string;
  quantity: number;
  unit_price: number;
};

export async function createMercadoPagoOrder(input: {
  orderId: string;
  total: number;
  email: string;
  items: MercadoPagoItem[];
  baseUrl: string;
}) {
  const totalAmount = input.total.toFixed(2);
  const externalReference = input.orderId.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 64);
  const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const title = input.items.length === 1
    ? input.items[0].title
    : `Pedido ${input.orderId} (${itemCount} productos)`;

  const payload = {
    type: 'online',
    processing_mode: 'manual',
    capture_mode: 'automatic_async',
    total_amount: totalAmount,
    external_reference: externalReference,
    description: `Pedido ${input.orderId}`,
    payer: { email: input.email },
    items: [{
      title: title.slice(0, 150),
      quantity: 1,
      unit_price: totalAmount,
    }],
    config: {
      online: {
        success_url: `${input.baseUrl}/checkout/success?order=${input.orderId}`,
        failure_url: `${input.baseUrl}/checkout/failure?order=${input.orderId}`,
        pending_url: `${input.baseUrl}/checkout/pending?order=${input.orderId}`,
        auto_return: 'approved',
      },
    },
  };

  const response = await fetch(MP_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id || !data?.checkout_url) {
    console.error('Mercado Pago order creation failed', {
      status: response.status,
      body: data,
      body_json: JSON.stringify(data),
      payload: { ...payload, payer: { email: '[redacted]' } },
    });
    throw new Error('Mercado Pago order creation failed');
  }

  return data as { id: string; checkout_url: string; status: string };
}

export async function getMercadoPagoOrder(orderId: string) {
  const response = await fetch(`${MP_API}/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${accessToken()}` },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error('Mercado Pago order lookup failed');
  return data;
}

export function verifyMercadoPagoSignature(params: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
}) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret || !params.signature || !params.dataId) return false;
  const parts = Object.fromEntries(params.signature.split(',').map(part => {
    const [key, ...value] = part.split('=');
    return [key, value.join('=')];
  }));
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${params.dataId};request-id:${params.requestId ?? ''};ts:${parts.ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  const actual = Buffer.from(parts.v1);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actual);
}
