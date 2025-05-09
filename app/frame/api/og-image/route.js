// app/api/og/route.js
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'white',
            background: 'linear-gradient(to bottom, #7928CA, #FF0080)',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 40,
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 20 }}>Meme Vibe</div>
          <div style={{ fontSize: 36 }}>Create and share your favorite memes</div>
        </div>
      ),
      {
        width: 800,
        height: 800, // Using 1:1 aspect ratio for Warpcast
      }
    );
  } catch (error) {
    console.error('OG Image error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}