// app/page.js
import Head from 'next/head';
import Link from 'next/link';
import { MemeGallery } from '@/components/meme-gallery';
import { HeroSection } from '@/components/hero-section';

export default function Home() {
  return (
    <>
      <Head>
        <title>Meme Vibe</title>
        {/* Primary Meta Tags */}
        <meta name="title" content="Meme Vibe" />
        <meta name="description" content="Cast memes directly on Warpcast" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meme-vibe.vercel.app/" />
        <meta property="og:title" content="Meme Vibe" />
        <meta property="og:description" content="Cast memes directly on Warpcast" />
        <meta property="og:image" content="https://meme-vibe.vercel.app/og-image.png" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://meme-vibe.vercel.app/" />
        <meta name="twitter:title" content="Meme Vibe" />
        <meta name="twitter:description" content="Cast memes directly on Warpcast" />
        <meta name="twitter:image" content="https://meme-vibe.vercel.app/og-image.png" />

        {/* Warpcast Frame Meta Tag */}
        <meta
          name="fc:frame"
          content='{"version":"next","imageUrl":"https://meme-vibe.vercel.app/og-image.png","button":{"title":"Create Meme","action":{"type":"launch_frame","url":"https://meme-vibe.vercel.app/create"}}}'
        />
      </Head>

      <main className="min-h-screen">
        <HeroSection />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Popular Meme Templates</h2>
          <MemeGallery />
          <div className="mt-8 text-center">
            <Link
              href="/create"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Create Your Own Meme
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
