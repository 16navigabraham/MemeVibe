import { HeroSection } from "@/components/hero-section";
import { MemeGallery } from "@/components/meme-gallery";
import Link from "next/link";

export const metadata = {
  title: 'Meme Vibe - Create and cast Memes',
  description: 'Create and cast your favorite memes',
  openGraph: {
    title: 'Meme Vibe',
    description: 'Create and cast your favorite memes',
    images: ['/api/og'],
  },
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://meme-vibe.vercel.app/api/og',
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Create Your Own Meme',
    'fc:frame:button:1:action': 'post_redirect',
    'fc:frame:button:1:target': 'https://meme-vibe.vercel.app/create',
    'fc:frame:post_url': 'https://meme-vibe.vercel.app/api/frame-action',
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      
      <section className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Popular Meme Templates</h2>
        <MemeGallery />
        
        <div className="mt-8 text-center">
          <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
            Create Your Own Meme
          </Link>
        </div>
      </section>
    </main>
  );
}