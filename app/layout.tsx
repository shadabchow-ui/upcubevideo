import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import LeftSidebar from "@/components/layout/LeftSidebar";
import PromptComposer from "@/components/prompt/PromptComposer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upcube Video",
  description: "Explore and generate AI video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* Left navigation (Sora-style) */}
        <LeftSidebar />

        {/* Main content shifts right */}
        <main className="ml-60 min-h-screen">
          {children}
        </main>

        {/* Bottom-center prompt input */}
        <PromptComposer />
      </body>
    </html>
  );
}

