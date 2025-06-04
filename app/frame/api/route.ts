// frame/api/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Add this GET method which is essential for frame discovery
export async function GET() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta property="og:title" content="Meme Vibe" />
        <meta property="og:description" content="Cast memes directly on Farcaster" />
        <meta property="og:image" content="https://meme-vibe.vercel.app/og-image.png" />
        <meta name="fc:frame" content='${JSON.stringify({
          version: "next",
          image: "https://meme-vibe.vercel.app/og-image.png",
          buttons: [
            { label: "Cast your meme now!" }
          ]
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
    const buttonIndex = data.untrustedData?.buttonIndex || 0;
    const fid = data.untrustedData?.fid; // Farcaster user ID
    
    // Initial state - "Cast your meme now!"
    if (buttonIndex === 1) {
      // Generate the meme result for this user
      const resultType = determineResultType(fid);
      
      return NextResponse.json({
        frames: {
          version: 'vNext',
          image: `https://meme-vibe.vercel.app/api/generate-image?type=${resultType}&fid=${fid}`,
          buttons: [
            { label: "Share Result" }
          ],
          state: { resultType }
        }
      });
    }
    
    // "Share Result" button clicked
    if (buttonIndex === 1 && data.untrustedData?.state?.resultType) {
      const resultType = data.untrustedData.state.resultType;
      
      // Cast directly to Warpcast with a custom message
      return NextResponse.json({
        frames: {
          version: 'vNext',
          image: `https://meme-vibe.vercel.app/api/generate-image?type=${resultType}&fid=${fid}`,
          buttons: [
            { label: "Try Again" }
          ],
          action: {
            type: "post_redirect", // This tells Warpcast to create a post
            post: {
              text: `meme casting is fun `,
              embeds: [{
                url: "https://meme-vibe.vercel.app/"
              }]
            }
          }
        }
      });
    }
    
    // Default or "Try Again" - return to initial state
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: "https://meme-vibe.vercel.app/api/og-image",
        buttons: [
          { label: "Cast your meme now!" }
        ]
      }
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Error processing frame request' }, { status: 500 });
  }
}

// Helper function to determine which type of meme to show
function determineResultType(fid: string) {
  // You can use the fid to generate a consistent result for each user
  // or randomize among your available options
  const types = ["", "", "", "", ""];
  const index = fid ? Number(fid) % types.length : Math.floor(Math.random() * types.length);
  return types[index];
}