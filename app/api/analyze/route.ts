import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest/client';

export async function POST(request: NextRequest) {
  try {
    // Check if Inngest is properly configured
    if (!process.env.INNGEST_EVENT_KEY || process.env.INNGEST_EVENT_KEY === 'your_inngest_event_key') {
      console.log('Inngest not configured - skipping analysis workflow');
      return NextResponse.json({
        success: true,
        message: 'Analysis workflow skipped (Inngest not configured)',
        eventId: null,
      });
    }

    // Trigger the complete analysis workflow
    const result = await inngest.send({
      name: 'trading/analyze',
      data: {
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis workflow triggered',
      eventId: result?.id || 'triggered',
    });
  } catch (error) {
    console.error('Error triggering analysis:', error);
    
    // If it's an auth error, log it but don't crash
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json({
        success: true,
        message: 'Analysis workflow not available (Inngest auth failed)',
        eventId: null,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to trigger analysis' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Analysis endpoint. Use POST to trigger analysis workflow.',
    endpoint: '/api/analyze',
    method: 'POST',
  });
}
