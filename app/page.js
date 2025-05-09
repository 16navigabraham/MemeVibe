import Head from "next/head";
import Link from "next/link";
import { MemeGallery } from "@/components/meme-gallery";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Head>
        {/* OpenGraph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Meme Cast - Home" />
        <meta property="og:description" content="Create and share memes with Farcaster Frames!" />
        <meta property="og:url" content="https://meme-vibe.vercel.app/" />
        <meta property="og:image" content="https://meme-vibe.vercel.app/logo.png" />
        
        {/* Warpcast Frame Metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://meme-vibe.vercel.app/logo.png" />
        <meta property="fc:frame:button:1" content="Cast Meme" />
        <meta property="fc:frame:post_url" content="https://meme-vibe.vercel.app/api/cast" />
      </Head>

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
  );
}
