import { NextRequest, NextResponse } from 'next/server';
import { getTradingSignals } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '50';
    const signals = await getTradingSignals(parseInt(limit));
    
    return NextResponse.json({
      success: true,
      data: signals,
      count: signals.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}
