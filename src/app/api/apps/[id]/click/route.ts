import { NextResponse } from 'next/server';
import { incrementAppClick } from '@/lib/gas-client';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing app ID' }, { status: 400 });
    }

    const result = await incrementAppClick(id);
    return NextResponse.json({
      status: result.success ? 'success' : 'error',
      clicks: result.clicks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
