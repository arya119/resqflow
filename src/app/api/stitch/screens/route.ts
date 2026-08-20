import { NextResponse } from 'next/server';
import { listProjectScreens } from '@/lib/stitch/screens';

export async function GET() {
  try {
    const screens = await listProjectScreens();
    return NextResponse.json({ screens, count: screens.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve Stitch screens', details: (error as Error).message },
      { status: 500 }
    );
  }
}
