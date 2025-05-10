// app/api/og-image/route.js
import { NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #7e22ce, #4c1d95)',
            color: 'white',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid white',
              borderRadius: '24px',
              padding: '40px',
            }}
          >
            <h1 style={{ fontSize: '60px', fontWeight: 'bold', margin: '0' }}>Meme Vibe</h1>
            <p style={{ fontSize: '30px', margin: '20px 0 40px' }}>Create and share memes on Warpcast</p>
            <div
              style={{
                background: 'white',
                color: '#7e22ce',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              Cast your meme now!
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (e) {
    return new NextResponse('Failed to generate OG image', { status: 500 });
  }
}