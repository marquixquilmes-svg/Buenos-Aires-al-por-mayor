import { NextResponse } from 'next/server';
import { createSessionToken, hashToken, sessionCookie } from '@/lib/auth';
import { createSession, findUserByEmail } from '@/lib/db/repositories';
import { verifyPassword } from '@/lib/password';
import { normalizeEmail } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = normalizeEmail(body?.email ?? '');
  const password = body?.password ?? '';
  const user = await findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString();
  await createSession(user.id, hashToken(token), expiresAt);
  const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  response.cookies.set({ ...sessionCookie, value: token, expires: new Date(expiresAt) });
  return response;
}
