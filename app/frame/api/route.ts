import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Get button index from frame interaction
    const buttonIndex = data.untrustedData?.buttonIndex || 0;
    
    // Handle button clicks
    if (buttonIndex === 1) {
      // Button 1 was clicked - "View Memes"
      return NextResponse.json({
        frames: {
          version: 'vNext',
          image: "https://memetest-self.vercel.app/api/og-image", 
          buttons: [
            { label: "View Memes" }
          ]
        }
      });
    }
    
    // Default response
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: "/api/og-image",
        buttons: [
          { label: "View Memes" }
        ]
      }
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Error processing frame request' }, { status: 500 });
  }
}