import { NextRequest, NextResponse } from 'next/server';
import { fetchOnChainMetrics } from '@/lib/apis/glassnode';

export async function GET(request: NextRequest) {
  try {
    const asset = request.nextUrl.searchParams.get('asset') || 'BTC';
    const metrics = await fetchOnChainMetrics(asset);
    
    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching on-chain metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch on-chain metrics' },
      { status: 500 }
    );
  }
}
