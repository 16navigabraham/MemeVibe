// app/api/frame-action/route.js
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { untrustedData } = body;
    const { buttonIndex, fid } = untrustedData || {};
    
    // Handle the button click
    // buttonIndex 1 = Like button
    // buttonIndex 2 = Make Your Own button (this will redirect via post_redirect)
    
    if (buttonIndex === 1) {
      // Process the like action if needed
      // Here you could store this info in a database
      console.log(`User ${fid} liked the meme`);
      
      // Return a response with a new frame to show like confirmation
      return NextResponse.json({
        frameImageUrl: `https://meme-vibe.vercel.app/api/generateimage?liked=true`,
        buttons: [
          {
            label: '❤️ Liked!',
            action: 'post'
          },
          {
            label: 'Make Your Own',
            action: 'post_redirect',
            target: 'https://meme-vibe.vercel.app'
          }
        ],
      });
    }
    
    // Default response if nothing else matches
    return NextResponse.json({
      frameImageUrl: `https://meme-vibe.vercel.app/api/generateimage`,
      buttons: [
        {
          label: '👍 Like',
          action: 'post'
        },
        {
          label: 'Make Your Own',
          action: 'post_redirect',
          target: 'https://meme-vibe.vercel.app'
        }
      ],
    });
    
  } catch (error) {
    console.error('Error processing frame action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}