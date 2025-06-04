// app/layout.tsx
import { Metadata } from 'next';
import { Providers } from './providers';
import { FrameInitializer } from '../components/FrameInitializer';
import '../styles/globals.css';

// Define app URL from environment variable
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meme-vibe.vercel.app';

export const metadata: Metadata = {
  title: 'Meme Vibe',
  description: 'Cast memes directly on Warpcast',
  openGraph: {
    title: 'Meme Vibe',
    description: 'Cast memes directly on Warpcast',
    url: appUrl,
    type: 'website',
    images: [
      {
        url: `${appUrl}/og-image.png`,
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
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: 'vNext',
      image: `${appUrl}/og-image.png`,
      buttons: [
        {
          label: '🎮 Start Battle',
          action: 'post',
        }
      ],
      postUrl: `${appUrl}/api/frame`,
    }),
    'fc:frame:image': `${appUrl}/og-image.png`,
    'fc:frame:button:1': '🎮 Start Battle',
    'fc:frame:post_url': `${appUrl}/api/frame`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${appUrl}/og-image.png`} />
        <meta property="fc:frame:button:1" content="🎮 Start Battle" />
        <meta property="fc:frame:post_url" content={`${appUrl}/api/frame`} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <FrameInitializer />
      </body>
    </html>
  );
}