import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    return NextResponse.json({
      version: 'vNext',
      image: `${appUrl}/og-image.png`,
      buttons: [
        {
          label: '🎮 Continue',
          action: 'post',
        }
      ],
      postUrl: `${appUrl}/api/frame`,
    });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}