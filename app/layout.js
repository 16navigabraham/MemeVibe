// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Meme Vibe",
  description: "Create and cast memes with Meme Vibe on Warpcast",
  openGraph: {
    title: "Meme Vibe",
    description: "Create and cast memes with Meme Vibe on Warpcast!",
    url: "https://meme-vibe.vercel.app",
    type: "website",
    images: [
      {
        url: "https://meme-vibe.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meme Vibe OG Image",
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://meme-vibe.vercel.app/og-image.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
