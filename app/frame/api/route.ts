// frame/api/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GLOBAL_URL = "https://meme-vibe.vercel.app";
const MINIAPP_URL = "https://warpcast.com/miniapps/SE50u1CWD5fB/meme-vibe";

// Add this GET method which is essential for frame discovery
export async function GET(req: NextRequest) {
  const isGlobalUrl = req.headers.get('referer')?.includes(GLOBAL_URL);

  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta property="og:title" content="Meme Vibe" />
        <meta property="og:description" content="Cast memes directly on Warpcast" />
        <meta property="og:image" content="${GLOBAL_URL}/og-image.png" />
        <meta name="fc:frame" content='${JSON.stringify({
          version: "vNext",
          image: `${GLOBAL_URL}/og-image.png`,
          buttons: [
            { label: "Cast your meme now!" }
          ],
          postUrl: `${GLOBAL_URL}/frame/api`
        })}' />
      </head>
      <body>
        <h1>Meme Vibe Frame</h1>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const isGlobalUrl = req.headers.get('referer')?.includes(GLOBAL_URL);
    
    return NextResponse.json({
      version: 'vNext',
      image: `${GLOBAL_URL}/og-image.png`,
      buttons: [
        { label: "Cast your meme now!" }
      ],
      ...(isGlobalUrl && {
        action: {
          type: "post",
          post: {
            text: `meme casting is fun`,
            embeds: [{
              url: GLOBAL_URL
            }]
          }
        }
      })
    });

  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Error processing frame request' }, { status: 500 });
  }
}