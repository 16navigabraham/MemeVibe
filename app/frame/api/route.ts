import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const buttonIndex = data.untrustedData?.buttonIndex || 0;
    const fid = data.untrustedData?.fid; // Farcaster user ID
    
    // Initial state - "Find out now!"
    if (buttonIndex === 1) {
      // Generate the meme result for this user
      const resultType = determineResultType(fid); // Create this function to randomize or determine result
      
      return NextResponse.json({
        frames: {
          version: 'vNext',
          image: `https://memetest-self.vercel.app/api/generate-image?type=${resultType}&fid=${fid}`,
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
          image: `https://memetest-self.vercel.app/api/generate-image?type=${resultType}&fid=${fid}`,
          buttons: [
            { label: "Try Again" }
          ],
          action: {
            type: "post_redirect", // This tells Warpcast to create a post
            post: {
              text: `I'm a ${resultType} crypto bro! Which one are you? 🤣`,
              embeds: [{
                url: "https://memetest-self.vercel.app/"
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
        image: "https://your-domain.com/api/og-image",
        buttons: [
          { label: "Find out now!" }
        ]
      }
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Error processing frame request' }, { status: 500 });
  }
}

// Helper function to determine which "crypto bro" the user is
function determineResultType(fid: string) {
  // You can use the fid to generate a consistent result for each user
  // or randomize among your available options
  const types = ["MANHATTAN", "BUSINESS", "TRADING", "HODLER", "DEFI"];
  const index = fid ? Number(fid) % types.length : Math.floor(Math.random() * types.length);
  return types[index];
}