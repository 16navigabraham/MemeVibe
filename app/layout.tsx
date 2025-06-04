// app/layout.tsx
import { Metadata } from 'next';
import { Providers } from './providers';
import { FrameInitializer } from '../components/FrameInitializer';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Meme Vibe',
  description: 'Cast memes directly on Warpcast',
  openGraph: {
    title: 'Meme Vibe',
    description: 'Cast memes directly on Warpcast',
    url: 'https://meme-vibe.vercel.app/',
    type: 'website',
    images: [
      {
        url: 'https://meme-vibe.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meme Vibe OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meme Vibe',
    description: 'Cast memes directly on Warpcast',
    images: ['https://meme-vibe.vercel.app/og-image.png'],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: 'https://meme-vibe.vercel.app/og-image.png',
      button: {
        title:  ' Start Meme Vibe ▶️',
        action: {
          type: 'launch_frame',
          url: 'https://meme-vibe.vercel.app/create',
          name: 'Meme Vibe',
          splashImageUrl: 'https://meme-vibe.vercel.app/logo.png',
          splashBackgroundColor: '#ffffff',
        },
      },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}