import { NextResponse } from 'next/server';
import { createSessionToken, hashToken, sessionCookie } from '@/lib/auth';
import { createSession, createUser, findUserByEmail } from '@/lib/db/repositories';
import { hashPassword } from '@/lib/password';
import { isStrongEnoughPassword, isValidEmail, normalizeEmail } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = normalizeEmail(body?.email ?? '');
  const password = body?.password ?? '';
  if (!isValidEmail(email) || !isStrongEnoughPassword(password)) {
    return NextResponse.json({ error: 'Email or password is invalid' }, { status: 400 });
  }
  if (await findUserByEmail(email)) return NextResponse.json({ error: 'Unable to create account' }, { status: 409 });

  const user = await createUser(email, await hashPassword(password));
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString();
  await createSession(user.id, hashToken(token), expiresAt);

  const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
  response.cookies.set({ ...sessionCookie, value: token, expires: new Date(expiresAt) });
  return response;
}
