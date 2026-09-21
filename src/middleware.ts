import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 1. Protect Admin Pages (/admin, /admin/...)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const session = await verifyAdminSessionToken(token);

    if (!session.valid) {
      const loginUrl = new URL('/?login=true', request.url);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }

    return NextResponse.next();
  }

  // 2. Protect Admin Mutation APIs (/api/apps, /api/categories)
  if (pathname.startsWith('/api/apps') || pathname.startsWith('/api/categories')) {
    // Allow public GET requests (reading catalog)
    if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
      return NextResponse.next();
    }

    // Allow public click tracking: POST /api/apps/:id/click
    if (pathname.endsWith('/click') && request.method === 'POST') {
      return NextResponse.next();
    }

    // All other mutations (POST, PUT, DELETE, PATCH) require an active admin session
    const session = await verifyAdminSessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'การเข้าถึงถูกปฏิเสธ: กรุณาเข้าสู่ระบบแอดมินก่อนดำเนินการ (Session หมดอายุหรือไม่ถูกต้อง)',
        },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/apps/:path*',
    '/api/categories/:path*',
  ],
};
