// api/user/minted-memes/route.js
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const fid = url.searchParams.get('fid');
    
    if (!fid) {
      return NextResponse.json({ error: 'FID is required' }, { status: 400 });
    }
    
    // Get all meme keys for this FID
    const keys = await kv.keys(`meme:*:fid`);
    const memeIds = [];
    
    // Filter keys to find those belonging to this FID
    for (const key of keys) {
      const storedFid = await kv.get(key);
      if (storedFid === fid) {
        // Extract memeId from key pattern meme:{memeId}:fid
        const memeId = key.split(':')[1];
        memeIds.push(memeId);
      }
    }
    
    // For each meme ID, get the token ID if it exists
    const memes = [];
    for (const memeId of memeIds) {
      const tokenId = await kv.get(`meme:${memeId}:tokenId`);
      
      if (tokenId) {
        // Fetch metadata from Zora API
        try {
          const response = await fetch(`https://api.zora.co/v1/tokens/${tokenId}`);
          let metadata = {};
          
          if (response.ok) {
            const data = await response.json();
            metadata = data.token || {};
          }
          
          memes.push({
            memeId,
            tokenId,
            imageUrl: `${process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app'}/generated/${memeId}.png`,
            name: metadata.name || `MemeVibe #${memeId}`,
            mintedAt: metadata.mintedAt || null
          });
        } catch (error) {
          console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
          // Still include the meme with basic info
          memes.push({
            memeId,
            tokenId,
            imageUrl: `${process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app'}/generated/${memeId}.png`,
            name: `MemeVibe #${memeId}`,
            mintedAt: null
          });
        }
      }
    }
    
    return NextResponse.json({ memes });
  } catch (error) {
    console.error('Error fetching minted memes:', error);
    return NextResponse.json({ error: 'Failed to fetch minted memes' }, { status: 500 });
  }
}