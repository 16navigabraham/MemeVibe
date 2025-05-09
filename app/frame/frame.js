'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';

/**
 * This component serves as a Farcaster Frame for the meme
 * It includes the necessary meta tags for Farcaster to render the frame properly
 */
export default function MemeFrame() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');
  const textContent = searchParams.get('text');
  const [frameUrl, setFrameUrl] = useState('');
  const [apiImageUrl, setApiImageUrl] = useState('');
  
  useEffect(() => {
    // Set the current URL for frame validation
    setFrameUrl(window.location.href);
    
    // If we have an image URL from the query params, use it
    // Otherwise, generate a URL to our API endpoint
    if (imageUrl) {
      // For direct image URLs
      setApiImageUrl(imageUrl);
    } else {
      // For dynamically generated images using our API
      const apiUrl = new URL(`${window.location.origin}/api/generateimage`);
      if (textContent) {
        const texts = textContent.split(' vs ');
        if (texts[0]) apiUrl.searchParams.append('topText', texts[0]);
        if (texts[1]) apiUrl.searchParams.append('bottomText', texts[1]);
      }
      setApiImageUrl(apiUrl.toString());
    }
  }, [imageUrl, textContent]);

  return (
    <>
      <Head>
        {/* Standard meta tags */}
        <title>MemeMaker Meme</title>
        <meta name="description" content={textContent || "A meme created with MemeMaker"} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="MemeMaker Meme" />
        <meta property="og:description" content={textContent || "Check out this meme!"} />
        <meta property="og:image" content={apiImageUrl} />
        
        {/* Farcaster Frame meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={apiImageUrl} />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        
        {/* Action buttons for the frame */}
        <meta property="fc:frame:button:1" content="👍 Like" />
        <meta property="fc:frame:button:2" content="Make Your Own" />
        
        {/* Redirect to home page when button 2 is clicked */}
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content={window.location.origin} />
        
        {/* Post endpoint for button 1 click */}
        <meta property="fc:frame:post_url" content={`${window.location.origin}/api/frame-action`} />
      </Head>
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">MemeMaker Meme</h1>
          
          {apiImageUrl && (
            <div className="mb-4">
              <img 
                src={apiImageUrl} 
                alt="Generated Meme" 
                className="w-full rounded-lg" 
              />
            </div>
          )}
          
          <p className="text-gray-700">
            {textContent ? `${textContent} - Made with MemeMaker` : "A meme created with MemeMaker"}
          </p>
          
          <div className="mt-6">
            <a 
              href={window.location.origin} 
              className="block w-full bg-purple-600 hover:bg-purple-700 text-center text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Create Your Own Meme
            </a>
          </div>
        </div>
      </div>
    </>
  );
}