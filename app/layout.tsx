import type { Metadata } from "next";
import { Providers } from "../app/providers";
import { FrameInitializer } from "../components/FrameInitializer";

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
        <FrameInitializer />
      </body>
    </html>
  );
}