import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { display } from "@/fonts/TikTok Display";
import { text } from "@/fonts/TikTok Text";
import "./globals.css";
import BottomNav from "@/app/components/BottomNav";
import TopNav from "./components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "VerifEye",
  description: "Welcome to VerifEye! Where content meets verifiability. We aim to provide a platform where users can verify the content they consume.",
  applicationName: "VerifEye",
  generator: "Next.js",
  keywords: ["TikTok", "Reels", "Shorts", "Credibility", "VerifEye", "Verify", "Philippines"],
  openGraph: {
    images: {
      url: "https://i.imgur.com/lSEwsnI.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
    type: "website",
    siteName: "VerifEye",
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
  themeColor: "#271016",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
			lang="en"
			className={`${display.variable} ${text.variable}`}
		>
      <head />
      <body className={inter.className}>
        <BottomNav />
        <TopNav />
        {children}
      </body>
    </html>
  );
}
