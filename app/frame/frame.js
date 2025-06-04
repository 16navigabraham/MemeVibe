'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';

export default function Frame() {
  const [frameUrl, setFrameUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');
  const textContent = searchParams.get('text');

  useEffect(() => {
    // Set the current URL for frame validation
    setFrameUrl(window.location.href);
    setOrigin(window.location.origin);
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meme-vibe.vercel.app';

  return (
    <>
      <Head>
        {/* Frame meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${appUrl}/og-image.png`} />
        <meta property="fc:frame:button:1" content="🎮 Start Battle" />
        <meta property="fc:frame:post_url" content={`${appUrl}/api/frame`} />
        
        {/* OG meta tags */}
        <meta property="og:title" content="Meme Vibe" />
        <meta property="og:description" content="Cast meme directly to warpcast" />
        <meta property="og:image" content={`${appUrl}/og-image.png`} />
        <meta property="og:url" content={appUrl} />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Meme Vibe</h1>
          <img 
            src={`${appUrl}/og-image.png`}
            alt="Meme Battle"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </>
  );
}
