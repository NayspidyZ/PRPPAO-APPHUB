import { NextResponse, NextRequest } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    if (password === adminPassword) {
      // Generate secure HMAC-SHA256 signed session token (1 hour)
      const token = await createAdminSessionToken(SESSION_MAX_AGE);

      const response = NextResponse.json({
        status: 'success',
        message: 'เข้าสู่ระบบสำเร็จ',
        expiresIn: SESSION_MAX_AGE,
      });

      // Secure HTTP-Only Cookie with 1 hour expiration
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE, // 1 hour (3600 seconds)
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { status: 'error', message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  if (session.valid && session.payload) {
    const timeLeftSeconds = Math.max(0, Math.floor((session.payload.exp - Date.now()) / 1000));
    return NextResponse.json({
      status: 'success',
      authenticated: true,
      expiresIn: timeLeftSeconds,
    });
  }

  return NextResponse.json(
    {
      status: 'error',
      authenticated: false,
      message: 'ไม่ได้เข้าสู่ระบบหรือ Session หมดอายุแล้ว',
    },
    { status: 401 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({
    status: 'success',
    message: 'ออกจากระบบสำเร็จ',
  });
  
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
