import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, service: 'buenos-aires-al-por-mayor', version: 'v1' });
}
