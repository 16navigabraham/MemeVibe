'use client';

// Add the TypeScript declaration at the top of the file
declare global {
  interface Window {
    farcaster?: {
      Cast?: {
        create: (options: { text: string; embeds: { url: string }[] }) => Promise<void>;
      };
    };
  }
}

import { Send } from 'lucide-react';
import { useState } from 'react';

// Export the function to make it available to other components
export const handleCastMeme = async (memeType: string) => {
  try {
    // Get the image URL for the generated meme
    const imageUrl = `https://memetest-self.vercel.app/api/generate-image?type=${memeType}`;
    
    // Create the cast text
    const castText = `I'm a ${memeType} crypto bro! Which one are you? 🤣`;
    
    // Use the Farcaster Cast API if available
    if (window.farcaster?.Cast) {
      await window.farcaster.Cast.create({
        text: castText,
        embeds: [{ url: imageUrl }]
      });
    } else {
      // Fallback - open Warpcast with pre-filled cast
      const encodedText = encodeURIComponent(castText);
      const encodedUrl = encodeURIComponent(imageUrl);
      window.open(`https://warpcast.com/~/compose?text=${encodedText}&embeds=${encodedUrl}`, '_blank');
    }
  } catch (error) {
    console.error('Error casting meme:', error);
    // Fallback to download if casting fails
    window.open(`https://memetest-self.vercel.app/api/generate-image?type=${memeType}`, '_blank');
  }
};