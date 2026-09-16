import { NextResponse } from 'next/server';
import { updateGasApp, deleteGasApp } from '@/lib/gas-client';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing app ID' }, { status: 400 });
    }

    const result = await updateGasApp(id, body);
    return NextResponse.json(result, { status: result.status === 'success' ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing app ID' }, { status: 400 });
    }

    const result = await deleteGasApp(id);
    return NextResponse.json(result, { status: result.status === 'success' ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
