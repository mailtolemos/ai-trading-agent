import { NextRequest, NextResponse } from 'next/server';
import { fetchTopCryptoNews } from '@/lib/apis/news';

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '15';
    const news = await fetchTopCryptoNews(parseInt(limit));
    
    return NextResponse.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
