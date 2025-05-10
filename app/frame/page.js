// app/frame/page.js
export const metadata = {
  title: 'Meme Vibe Frame',
  description: 'Cast memes directly on Warpcast',
  openGraph: {
    title: 'Meme Vibe',
    description: 'Cast memes directly on Warpcast',
    url: '/frame',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Meme Vibe Frame',
    }],
  },
  // This is critical for proper frame embedding
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: "https://meme-vibe.vercel.app/og-image.png",
      buttons: [
        { label: "Cast your meme now!" }
      ]
    })
  }
};

export default function FramePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Meme Vibe Frame</h1>
      <p className="text-lg mb-8">Create and share memes directly on Warpcast</p>
      <div className="w-full max-w-md p-4 border rounded-lg">
        <p>This page is optimized for Farcaster Frame embedding.</p>
      </div>
    </div>
  );
}