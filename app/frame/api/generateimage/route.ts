import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'BUSINESS';
    
    // Create a canvas for the meme
    const canvas = createCanvas(600, 800);
    const ctx = canvas.getContext('2d');
    
    // Load template image based on type
    const templatePath = path.join(process.cwd(), 'public', 'templates', `${type.toLowerCase()}.jpg`);
    const image = await loadImage(fs.existsSync(templatePath) ? 
      templatePath : path.join(process.cwd(), 'public', 'templates', 'default.jpg'));
    
    // Draw the image
    ctx.drawImage(image, 0, 0, 600, 800);
    
    // Add text
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Shadow for better visibility
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    
    // Draw "HA HA!" at the top
    ctx.fillText('HA HA!', 300, 100);
    
    // Draw the crypto bro type at the bottom
    ctx.fillText(type, 300, 700);
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/jpeg');
    
    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=10'
      }
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}