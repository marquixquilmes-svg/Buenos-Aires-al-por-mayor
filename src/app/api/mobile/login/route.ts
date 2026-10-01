import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, hashToken } from '@/lib/auth';
import { createSession, findUserByEmail } from '@/lib/db/repositories';
import { verifyPassword } from '@/lib/password';
import { normalizeEmail } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = normalizeEmail(String(body?.email ?? ''));
  const password = String(body?.password ?? '');
  const user = await findUserByEmail(email);
  if (!user || !await verifyPassword(password, user.password_hash)) return NextResponse.json({ error: 'Email o contraseña incorrectos.' }, { status: 401 });
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString();
  await createSession(user.id, hashToken(token), expiresAt);
  return NextResponse.json({ token, expiresAt, user: { email:user.email, role:user.role } }, { headers: { 'Cache-Control':'no-store' } });
}
