import { NextRequest, NextResponse } from 'next/server';
import { fetchFearGreedIndex } from '@/lib/apis/feargreed';

export async function GET(request: NextRequest) {
  try {
    const index = await fetchFearGreedIndex();
    
    return NextResponse.json({
      success: true,
      data: index,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Fear & Greed Index' },
      { status: 500 }
    );
  }
}
