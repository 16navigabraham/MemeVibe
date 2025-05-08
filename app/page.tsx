// app/page.tsx
import { HeroSection } from "../components/hero-section";
import { MemeGallery } from "../components/meme-gallery";
import { Navbar } from "../components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="mt-8">
      <MemeGallery />
      </div>
      {/* { Welcome to the Meme Cast! } */}
    </main>
  );
}