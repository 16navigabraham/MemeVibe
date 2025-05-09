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

// Export a function that takes the meme URL
export const handleCastMeme = async (memeUrl: string, memeText: string[]) => {
  try {
    // Format the meme text into a caption
    const textCaption = memeText.filter(text => text.trim() !== "").join(" vs ");

    // Create a descriptive caption for the cast
    const castText = textCaption ?
      `${textCaption} - Made with MemeCast frame ` :
      "Check out this meme I made with MemeVibe!";

    // Append a unique query parameter to prevent caching
    const uniqueMemeUrl = `${memeUrl}?t=${Date.now()}`;

    console.log("Casting meme with URL:", uniqueMemeUrl);
    console.log("Cast text:", castText);

    // Use the Farcaster Cast API if available in the browser
    if (window.farcaster?.Cast) {
      await window.farcaster.Cast.create({
        text: castText,
        embeds: [{ url: uniqueMemeUrl }]
      });
    } else {
      // Fallback - open Warpcast with pre-filled cast
      const encodedText = encodeURIComponent(castText);
      const encodedUrl = encodeURIComponent(uniqueMemeUrl);
      window.open(`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`, '_blank');
    }
  } catch (error) {
    console.error('Error casting meme:', error);
    // Fallback if casting fails - just open the image in a new tab
    alert("Error casting to Warpcast. Opening image in new tab instead.");
    window.open(memeUrl, '_blank');
  }
};
