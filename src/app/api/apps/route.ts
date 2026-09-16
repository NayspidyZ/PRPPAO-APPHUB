import { NextResponse } from 'next/server';
import { fetchAllApps, createGasApp } from '@/lib/gas-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { apps, isMock } = await fetchAllApps();
    return NextResponse.json({
      status: 'success',
      data: apps,
      isMock,
      total: apps.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Failed to fetch apps',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.url) {
      return NextResponse.json(
        { status: 'error', message: 'กรุณากรอกชื่อแอปพลิเคชันและลิงก์ (URL)' },
        { status: 400 }
      );
    }

    const appData = {
      name: String(body.name).trim(),
      description: String(body.description || '').trim(),
      url: String(body.url).trim(),
      category: String(body.category || 'ทั่วไป').trim(),
      icon: String(body.icon || 'Globe').trim(),
      status: body.status === 'maintenance' ? 'maintenance' : 'active',
      order: Number(body.order) || 1,
      tags: Array.isArray(body.tags) ? body.tags : [],
      department: String(body.department || 'ฝ่ายประชาสัมพันธ์').trim(),
    };

    const result = await createGasApp(appData as any);
    return NextResponse.json(result, { status: result.status === 'success' ? 201 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
