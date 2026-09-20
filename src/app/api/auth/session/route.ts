import { NextRequest, NextResponse } from 'next/server';
import { hashToken, sessionCookie } from '@/lib/auth';
import { findSessionByTokenHash } from '@/lib/db/repositories';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(sessionCookie.name)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

  const session = await findSessionByTokenHash(hashToken(token));
  if (!session) {
    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.set({ ...sessionCookie, value: '', maxAge: 0 });
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: session.user_id, email: session.email, role: session.role },
    expiresAt: session.expires_at,
  });
}
