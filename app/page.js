// app/page.js
import Link from 'next/link';
import { MemeGallery } from '@/components/meme-gallery';
import { HeroSection } from '@/components/hero-section';

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