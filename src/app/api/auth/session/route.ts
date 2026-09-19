import { NextRequest, NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(sessionCookie.name)?.value;

  // The database-backed session lookup will be added when the DB adapter is connected.
  return NextResponse.json({ authenticated: Boolean(token) });
}
