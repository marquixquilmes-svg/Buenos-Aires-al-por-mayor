import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get('baam_session')?.value);
  if (request.nextUrl.pathname.startsWith('/admin') && !hasSession) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
