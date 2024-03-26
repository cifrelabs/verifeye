import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "TikTok - Make Your Day",
  description: "TikTok - trends start here. On a device or on the web, viewers can watch and discover millions of personalized short videos. Download the app to get started.",
  applicationName: "Verifeye",
  generator: "Next.js",
  keywords: ["TikTok", "Reels", "Shorts", "Credibility", "Verifeye", "Verify", "Philippines"],
  openGraph: {
    images: {
      url: "https://i.imgur.com/lSEwsnI.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
    type: "website",
    siteName: "Verifeye",
    url: "https://comet.dlsu.edu.ph/verifeye/",
  },
  twitter: {
    card: "summary_large_image",
    images: {
      url: "https://i.imgur.com/lSEwsnI.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#317EFB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
