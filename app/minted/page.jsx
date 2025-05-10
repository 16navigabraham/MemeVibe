// app/minted/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MintedGallery from '@/components/MintedGallery';
import Link from 'next/link';

export default function MintedPage() {
  const searchParams = useSearchParams();
  const [fid, setFid] = useState(null);
  
  useEffect(() => {
    // Try to get FID from URL params
    const fidParam = searchParams.get('fid');
    
    if (fidParam) {
      setFid(fidParam);
    } else {
      // If not in URL, try to get from localStorage
      const storedFid = localStorage.getItem('user_fid');
      if (storedFid) {
        setFid(storedFid);
      }
    }
  }, [searchParams]);
  
  // Check for successful minting message
  const tokenId = searchParams.get('tokenId');
  const memeId = searchParams.get('memeId');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Minted MIMs Gallery</h1>
      
      {tokenId && memeId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>Your meme was successfully minted! Token ID: {tokenId}</p>
          <div className="mt-2">
            <a 
              href={`https://zora.co/collect/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mr-4"
            >
              View on Zora
            </a>
            <a 
              href={`https://warpcast.com/~/compose?embeds[]=${encodeURIComponent(`https://zora.co/collect/${tokenId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Share on Warpcast
            </a>
          </div>
        </div>
      )}
      
      {fid ? (
        <MintedGallery fid={fid} />
      ) : (
        <div className="text-center p-8">
          <p className="mb-4">Connect via Warpcast to view your minted MIMs</p>
          <Link 
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </Link>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link
          href="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create a New Meme
        </Link>
      </div>
    </div>
  );
}