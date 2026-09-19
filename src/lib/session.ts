import { cookies } from 'next/headers';
import { hashToken } from './auth';
import { findSessionByTokenHash } from './db/repositories';

export async function getCurrentSession() {
  const token = (await cookies()).get('baam_session')?.value;
  if (!token) return null;
  return findSessionByTokenHash(hashToken(token));
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}
