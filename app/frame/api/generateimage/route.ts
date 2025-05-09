// app/frame/api/generateimage/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { topText, bottomText } = req.body;

    // Create a canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Fill background with white
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);

    // Set text properties
    context.fillStyle = '#000000';
    context.font = 'bold 40px Arial';
    context.textAlign = 'center';

    // Add top text
    context.fillText(topText, width / 2, 100);

    // Add bottom text
    context.fillText(bottomText, width / 2, height - 50);

    // Generate a unique filename using timestamp and random number
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const filename = `${timestamp}_${randomNum}.png`;
    const filePath = path.join(process.cwd(), 'public', 'memes', filename);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write the image to the file system
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    // Construct the image URL
    const imageUrl = `/memes/${filename}`;

    res.status(200).json({ memeUrl: imageUrl });
  } catch (error) {
    console.error('Error generating meme image:', error);
    res.status(500).json({ error: 'Image generation failed' });
  }
}
