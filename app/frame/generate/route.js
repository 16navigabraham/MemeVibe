// api/frame/generate/route.js
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// This assumes you have an existing function to generate meme images
import generateMeme from '../../../lib/meme-generator';

export async function POST(req) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    const { fid, inputText } = untrustedData;
    
    // Generate unique ID for the meme
    const memeId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Generate meme image (implement your own logic)
    const memeUrl = await generateMeme(inputText, memeId);
    
    // Store FID with the meme for later reference
    await kv.set(`meme:${memeId}:fid`, fid.toString(), { ex: 86400 }); // Expires in 24 hours
    
    // Store the input parameters
    await kv.set(`meme:${memeId}:params`, JSON.stringify({
      inputText,
      createdAt: Date.now()
    }), { ex: 86400 });
    
    // Return frame with mint option
    return NextResponse.json({
      frames: {
        version: '0.92.0',
        image: memeUrl,
        buttons: [
          {
            label: 'Mint as NFT',
            action: 'post',
          },
          {
            label: 'Create Another',
            action: 'post',
          }
        ],
        postUrl: `${process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app'}/api/frame/mint-action?memeId=${memeId}`
      }
    });
    
  } catch (error) {
    console.error('Error generating meme:', error);
    return NextResponse.json({
      frames: {
        version: '0.92.0',
        image: `${process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app'}/images/error.png`,
        buttons: [
          {
            label: 'Try Again',
            action: 'post'
          }
        ],
        postUrl: `${process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app'}/api/frame/create`
      }
    });
  }
}