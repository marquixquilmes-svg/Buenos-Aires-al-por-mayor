import { NextRequest, NextResponse } from 'next/server';
import { hashToken, sessionCookie } from '@/lib/auth';
import { deleteSessionByTokenHash } from '@/lib/db/repositories';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(sessionCookie.name)?.value;
  if (token) await deleteSessionByTokenHash(hashToken(token));

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...sessionCookie, value: '', maxAge: 0 });
  return response;
}
