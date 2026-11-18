import { NextResponse } from 'next/server';
import { fetchAllData } from '@/lib/gas-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceFresh = searchParams.get('fresh') === '1';

    const { apps, categories, isMock } = await fetchAllData(forceFresh);

    return NextResponse.json({
      status: 'success',
      apps,
      categories,
      isMock,
      total: apps.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Failed to fetch hub data',
      },
      { status: 500 }
    );
  }
}
