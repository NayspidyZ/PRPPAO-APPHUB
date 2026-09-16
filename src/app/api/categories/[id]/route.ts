import { NextResponse } from 'next/server';
import { updateGasCategory, deleteGasCategory } from '@/lib/gas-client';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing category ID' }, { status: 400 });
    }

    const result = await updateGasCategory(id, body.data || body, body.oldName);
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
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('name') || undefined;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Missing category ID' }, { status: 400 });
    }

    const result = await deleteGasCategory(id, categoryName);
    return NextResponse.json(result, { status: result.status === 'success' ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
