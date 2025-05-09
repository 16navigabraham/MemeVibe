// app/page.js

import Link from "next/link";
import { MemeGallery } from "@/components/meme-gallery";
import { HeroSection } from "@/components/hero-section";

// Define metadata for Farcaster Frame
export const metadata = {
  title: "Meme Cast - Home",
  description: "Create and share memes with Farcaster Frames!",
  openGraph: {
    title: "Meme Cast - Home",
    description: "Create and share memes with Farcaster Frames!",
    url: "https://meme-vibe.vercel.app/",
    images: [
      {
        url: "https://meme-vibe.vercel.app/splash.png", // Replace with your actual image URL
        width: 800,
        height: 600,
        alt: "Meme Cast",
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://meme-vibe.vercel.app/splash.png", // Replace with your actual image URL
    "fc:frame:button:1": "Cast Meme",
    "fc:frame:post_url": "https://meme-vibe.vercel.app/api/cast", // Replace with your actual API endpoint
  },
};

export default function Home() {
  return (
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
  );
}
