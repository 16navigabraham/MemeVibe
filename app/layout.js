// app/layout.js
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://meme-vibe.vercel.app'),
  title: 'Meme Vibe',
  description: 'Create and share memes easily',
  // The following metadata won't work for Warpcast, but we'll leave it for other platforms
  openGraph: {
    title: 'Meme Vibe',
    description: 'Create and share your favorite memes',
    url: 'https://meme-vibe.vercel.app',
    siteName: 'Meme Vibe',
    images: [
      {
        url: 'https://meme-vibe.vercel.app/api/og',
        width: 800,
        height: 800,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Manual insertion of Frame metadata - this is critical for Warpcast */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://meme-vibe.vercel.app/api/og" />
        <meta property="fc:frame:button:1" content="Create Meme" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content="https://meme-vibe.vercel.app/create" />
        <meta property="fc:frame:post_url" content="https://meme-vibe.vercel.app/api/frame-action" />
      </head>
      <body>{children}</body>
    </html>
  )
}