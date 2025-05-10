import type { Metadata } from "next";
import { Providers } from "./providers";
import { FrameInitializer } from "../components/FrameInitializer";
import '../styles/globals.css';


export const metadata: Metadata = {
  title: "Meme Cast",
  description: "A Meme cast frame",
  // Add Frame metadata here
  openGraph: {
    title: "Meme Vibe",
    description: "A Meme cast frame",
    images: ["https://meme-vibe.vercel.app//api/og-image"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://meme-vibe.vercel.app//api/og-image",
    "fc:frame:button:1": "View Memes",
    "fc:frame:post_url": "https://meme-vibe.vercel.app//api/frame"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <FrameInitializer />
      </body>
    </html>
  );
}