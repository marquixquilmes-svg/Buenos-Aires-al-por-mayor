import { NextResponse } from 'next/server';

// Database diagnostics must never be exposed in a public production deployment.
// Keep the endpoint unavailable until a private operational diagnostics mechanism is added.
export function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
