import { NextRequest, NextResponse } from 'next/server';
import { hashToken } from '@/lib/auth';
import { deleteSessionByTokenHash } from '@/lib/db/repositories';

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (token && /^[A-Za-z0-9_-]{32,128}$/.test(token)) await deleteSessionByTokenHash(hashToken(token));
  return NextResponse.json({ ok:true });
}
