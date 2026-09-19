import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/catalog';
import { calculateCartTotal, validateCart, type CartLine } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  const session = request.cookies.get('baam_session')?.value;
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const body = await request.json().catch(() => null) as { items?: CartLine[] } | null;
  if (!body?.items?.length || !validateCart(body.items, products)) {
    return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
  }

  // Persistence and server-side stock reservation will be enabled with PostgreSQL.
  const total = calculateCartTotal(body.items, products);
  return NextResponse.json({ ok: true, status: 'pending', total }, { status: 201 });
}
