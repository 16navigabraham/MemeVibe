// app/layout.js
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://meme-vibe.vercel.app'),
  title: 'Meme Vibe',
  description: 'Cast memes directly on Warpcast',
  openGraph: {
    title: 'Meme Vibe',
    description: 'Cast memes directly on Warpcast',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
  // We'll still keep this for compatibility
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: "https://meme-vibe.vercel.app/og-image.png",
      button: {
        title: "🚩 Start Meme Vibe",
        action: {
          type: "launch_frame",
          url: "https://meme-vibe.vercel.app",
          name: "Meme Vibe",
          splashImageUrl: "https://meme-vibe.vercel.app/logo.png",
          splashBackgroundColor: "#7e22ce"
        }
      }
    })
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add the fc:frame meta tag directly in the head */}
        <meta name="fc:frame" content={JSON.stringify({
          version: "next",
          imageUrl: "https://meme-vibe.vercel.app/og-image.png",
          button: {
            title: "🚩 Start Meme Vibe",
            action: {
              type: "launch_frame",
              url: "https://meme-vibe.vercel.app",
              name: "Meme Vibe",
              splashImageUrl: "https://meme-vibe.vercel.app/logo.png",
              splashBackgroundColor: "#7e22ce"
            }
          }
        })} />
      </head>
      <body>{children}</body>
    </html>
  );
}