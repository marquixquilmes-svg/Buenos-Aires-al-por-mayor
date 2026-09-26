import { cookies } from 'next/headers';
import { hashToken, sessionCookie } from '@/lib/auth';
import { findSessionByTokenHash } from '@/lib/db/repositories';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  const session = token ? await findSessionByTokenHash(hashToken(token)) : null;
  if (!session || session.role !== 'admin') return null;
  return session;
}
