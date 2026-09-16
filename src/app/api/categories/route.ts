import { NextResponse } from 'next/server';
import { fetchAllCategories, createGasCategory } from '@/lib/gas-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { categories, isMock } = await fetchAllCategories();
    return NextResponse.json({
      status: 'success',
      data: categories,
      isMock,
      total: categories.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'กรุณากรอกชื่อหมวดหมู่' },
        { status: 400 }
      );
    }

    const categoryData = {
      name: String(body.name).trim(),
      description: String(body.description || '').trim(),
      icon: String(body.icon || 'Folder').trim(),
      order: Number(body.order) || 1,
    };

    const result = await createGasCategory(categoryData);
    return NextResponse.json(result, { status: result.status === 'success' ? 201 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
