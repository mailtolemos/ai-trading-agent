import { NextRequest, NextResponse } from 'next/server';
import { fetchCryptoPrices } from '@/lib/apis/coingecko';

export async function GET(request: NextRequest) {
  try {
    const prices = await fetchCryptoPrices();
    
    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
