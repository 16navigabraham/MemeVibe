// minting-flow.js
// This file handles the Warpcast Frame to Zora minting flow

import { getFrameMetadata } from '@coinbase/onchainkit';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Configuration constants
const FRAME_BASE_URL = process.env.FRAME_BASE_URL || 'https://meme-vibe.vercel.app';
const GENERATED_MEMES_PATH = '/generated';
const DEFAULT_ZORA_NETWORK = 'zora'; // Base network
const COLLECTION_ADDRESS = process.env.ZORA_COLLECTION_ADDRESS || ''; // Optional collection address

/**
 * Generates the frame metadata for the minting option display
 * @param {string} memeId - The ID of the generated meme
 * @param {string} memeUrl - The URL of the generated meme image
 */
export function getMintFrameMetadata(memeId, memeUrl) {
  return getFrameMetadata({
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
    image: {
      src: memeUrl,
      aspectRatio: '1:1',
    },
    postUrl: `${FRAME_BASE_URL}/api/frame/mint-action?memeId=${memeId}`,
  });
}

/**
 * Handles the action when user clicks on mint button
 * @param {Object} req - Request object
 * @returns {NextResponse} - Response with redirect to Zora
 */
export async function handleMintAction(req) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    const { buttonIndex, fid } = untrustedData;
    
    // Get memeId from the request URL
    const url = new URL(req.url);
    const memeId = url.searchParams.get('memeId');
    
    if (!memeId) {
      return createErrorResponse('Meme ID is missing');
    }

    // Button index 1 is "Mint as NFT"
    if (buttonIndex === 1) {
      // Generate the meme URL
      const memeUrl = `${FRAME_BASE_URL}${GENERATED_MEMES_PATH}/${memeId}.png`;
      
      // Store the meme info in KV store for verification later
      await kv.set(`meme:${memeId}:fid`, fid.toString(), { ex: 86400 }); // Expires in 24 hours
      
      // Create Zora minting URL
      const zoraUrl = createZoraMintingUrl(memeUrl, memeId);
      
      // Return frame with redirect to Zora
      return NextResponse.json({
        frames: {
          version: '0.92.0',
          image: memeUrl,
          buttons: [
            {
              label: 'Go to Zora to Mint',
              action: 'link',
              target: zoraUrl
            }
          ],
          postUrl: `${FRAME_BASE_URL}/api/frame/minting-completed?memeId=${memeId}`
        }
      });
    } 
    // Button index 2 is "Create Another"
    else if (buttonIndex === 2) {
      // Redirect back to the meme creation page
      return NextResponse.json({
        frames: {
          version: '0.92.0',
          image: `${FRAME_BASE_URL}/images/create-new.png`,
          buttons: [
            {
              label: 'Start Creating',
              action: 'post',
            }
          ],
          postUrl: `${FRAME_BASE_URL}/api/frame/create`
        }
      });
    }
    
    return createErrorResponse('Invalid button');
  } catch (error) {
    console.error('Error in handleMintAction:', error);
    return createErrorResponse('Failed to process minting action');
  }
}

/**
 * Creates a Zora minting URL with the meme image
 * @param {string} memeUrl - URL of the meme image
 * @param {string} memeId - ID of the meme
 * @returns {string} - Zora minting URL
 */
function createZoraMintingUrl(memeUrl, memeId) {
  const params = new URLSearchParams({
    mediaUrl: memeUrl,
    name: `MemeVibe #${memeId}`,
    description: `A meme generated on MemeVibe via Warpcast Frame`,
    editionSize: '1', // Making it a 1/1
    redirectUrl: `${FRAME_BASE_URL}/api/frame/minting-completed?memeId=${memeId}`,
  });
  
  // Add optional collection address if available
  if (COLLECTION_ADDRESS) {
    params.append('contractAddress', COLLECTION_ADDRESS);
  }
  
  return `https://zora.co/create?${params.toString()}`;
}

/**
 * Handles the completion of minting process
 * @param {Object} req - Request object
 * @returns {NextResponse} - Response with minted NFT display
 */
export async function handleMintingCompleted(req) {
  try {
    const url = new URL(req.url);
    const memeId = url.searchParams.get('memeId');
    const tokenId = url.searchParams.get('tokenId');
    
    if (!memeId) {
      return createErrorResponse('Meme ID is missing');
    }
    
    // The meme URL that was minted
    const memeUrl = `${FRAME_BASE_URL}${GENERATED_MEMES_PATH}/${memeId}.png`;
    
    // If we have a tokenId, it means the minting was successful
    if (tokenId) {
      // Store the tokenId in KV store
      await kv.set(`meme:${memeId}:tokenId`, tokenId, { ex: 2592000 }); // Expires in 30 days
      
      // Return frame with minted confirmation
      return NextResponse.json({
        frames: {
          version: '0.92.0',
          image: memeUrl,
          buttons: [
            {
              label: 'View on Zora',
              action: 'link',
              target: `https://zora.co/collect/${tokenId}`
            },
            {
              label: 'Create Another',
              action: 'post'
            }
          ],
          postUrl: `${FRAME_BASE_URL}/api/frame/create`
        }
      });
    }
    
    // If no tokenId, check if the user is coming back from Zora without completing the mint
    return NextResponse.json({
      frames: {
        version: '0.92.0',
        image: memeUrl,
        buttons: [
          {
            label: 'Try Minting Again',
            action: 'post'
          },
          {
            label: 'Create Another',
            action: 'post'
          }
        ],
        postUrl: `${FRAME_BASE_URL}/api/frame/mint-action?memeId=${memeId}`
      }
    });
    
  } catch (error) {
    console.error('Error in handleMintingCompleted:', error);
    return createErrorResponse('Failed to process minting completion');
  }
}

/**
 * Creates an error response
 * @param {string} message - Error message
 * @returns {NextResponse} - Error response
 */
function createErrorResponse(message) {
  return NextResponse.json({
    frames: {
      version: '0.92.0',
      image: `${FRAME_BASE_URL}/images/error.png`,
      buttons: [
        {
          label: 'Go Back',
          action: 'post'
        }
      ],
      postUrl: `${FRAME_BASE_URL}/api/frame/create`
    }
  });
}