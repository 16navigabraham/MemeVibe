import type { Metadata } from "next";

import '../styles/globals.css'

import { Providers } from "../app/providers";

export const metadata: Metadata = {
  title: "Meme Cast",
  description: "A Meme cast frame",
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
      </body>
    </html>
  );
}