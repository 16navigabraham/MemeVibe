// app/api/frame-action/route.js
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { untrustedData } = body;
    const { buttonIndex, fid } = untrustedData || {};
    
    console.log(`Frame action received: Button ${buttonIndex} from FID ${fid}`);
    
    // Return a response with a new frame
    return new Response(
      JSON.stringify({
        frameImageUrl: "https://meme-vibe.vercel.app/api/og",
        buttons: [
          {
            label: 'Create Meme',
            action: 'post_redirect',
            target: 'https://meme-vibe.vercel.app/create'
          }
        ],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Error processing frame action:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process action' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}