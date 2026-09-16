import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    if (password === adminPassword) {
      const response = NextResponse.json({
        status: 'success',
        message: 'เข้าสู่ระบบสำเร็จ',
      });

      // Simple session cookie (for production use crypto/JWT)
      response.cookies.set('prppao_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
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

export async function DELETE() {
  const response = NextResponse.json({
    status: 'success',
    message: 'ออกจากระบบสำเร็จ',
  });
  response.cookies.delete('prppao_admin_session');
  return response;
}
