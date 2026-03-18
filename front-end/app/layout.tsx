import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamVerse",
  description:
    "Next-generation streaming platform for high-quality entertainment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#0f1014] text-white overflow-x-hidden`}
      >
        <Sidebar />
        {/* --PAGE-CONTENT-LEFT-SPACE: calc(--SIDENAV-WIDTH + --SPACE-04) = 5rem + 1rem */}
        <main className="grow w-full" style={{ paddingLeft: "5rem" }}>{children}</main>
      </body>
    </html>
  );
}
