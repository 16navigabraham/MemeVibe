// components/MintedGallery.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MintedGallery = ({ fid }) => {
  const [mintedMemes, setMintedMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMintedMemes = async () => {
      if (!fid) return;
      
      try {
        const response = await fetch(`/api/user/minted-memes?fid=${fid}`);
        if (response.ok) {
          const data = await response.json();
          setMintedMemes(data.memes || []);
        }
      } catch (error) {
        console.error('Failed to fetch minted memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMintedMemes();
  }, [fid]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading your minted MIMs...</div>;
  }

  if (mintedMemes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">You haven't minted any MIMs yet.</p>
        <Link 
          href="/create" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Your First Meme
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Minted MIMs</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mintedMemes.map((meme) => (
          <div key={meme.tokenId} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-square">
              <Image 
                src={meme.imageUrl} 
                alt={meme.name || `Meme #${meme.tokenId}`}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-bold">{meme.name || `MemeVibe #${meme.memeId}`}</h3>
              
              <div className="mt-4 flex justify-between">
                <Link 
                  href={`https://zora.co/collect/${meme.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View on Zora
                </Link>
                
                <a 
                  href={`https://warpcast.com/~/compose?embeds[]=${encodeURIComponent(`https://zora.co/collect/${meme.tokenId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Share on Warpcast
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MintedGallery;