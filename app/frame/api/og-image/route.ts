import { NextRequest } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  try {
    // Create a canvas for the OG image
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 1200, 630);
    
    // Add text
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('What your favourite meme?', 600, 200);
    
    ctx.font = '36px Arial';
    ctx.fillText('Find out now!', 600, 300);
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/jpeg');
    
    // Return the image
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}