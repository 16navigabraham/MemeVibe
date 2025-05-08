// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What your favourite meme?',
  description: 'Find out which meme vibe matches your favourite!',
  openGraph: {
    images: ['https://your-domain.com/api/og-image'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://memetest-self.vercel.app/api/og-image',
    'fc:frame:button:1': 'Find out now!',
    'fc:frame:post_url': 'https://memetest-self.vercel.app/api/frame',
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">What your favourite meme?</h1>
      <p className="text-lg mb-8">Find out which meme vibe matches your favourite!</p>
      
      {/* Additional content for web visitors */}
      <div className="mt-8">
        <p>Visit this frame on Warpcast to cast memes!</p>
      </div>
    </main>
  );
}