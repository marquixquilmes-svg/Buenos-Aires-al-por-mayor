import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { hashToken } from './auth';
import { findSessionByTokenHash } from './db/repositories';

export async function getCurrentSession() {
  const token = (await cookies()).get('baam_session')?.value;
  if (!token) return null;
  return findSessionByTokenHash(hashToken(token));
}

export async function getRequestSession(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice(7);
    if (!/^[A-Za-z0-9_-]{32,128}$/.test(token)) return null;
    return findSessionByTokenHash(hashToken(token));
  }
  return getCurrentSession();
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}
