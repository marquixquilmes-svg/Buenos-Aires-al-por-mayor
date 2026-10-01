import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, hashToken } from '@/lib/auth';
import { createSession, createUser, findUserByEmail } from '@/lib/db/repositories';
import { hashPassword } from '@/lib/password';
import { isStrongEnoughPassword, isValidEmail, normalizeEmail } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = normalizeEmail(String(body?.email ?? ''));
  const password = String(body?.password ?? '');
  if (!isValidEmail(email) || !isStrongEnoughPassword(password)) return NextResponse.json({ error:'Revisá el email y la contraseña.' }, { status:400 });
  if (await findUserByEmail(email)) return NextResponse.json({ error:'El email ya tiene una cuenta.' }, { status:409 });
  const user = await createUser(email, await hashPassword(password));
  const token = createSessionToken();
  const expiresAt = new Date(Date.now()+30*86_400_000).toISOString();
  await createSession(user.id,hashToken(token),expiresAt);
  return NextResponse.json({ token,expiresAt,user:{email:user.email,role:user.role} },{status:201,headers:{'Cache-Control':'no-store'}});
}
