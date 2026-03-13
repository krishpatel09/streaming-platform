import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import { Toaster } from "@/components/ui/sonner";
import AuthDialog from "@/components/LandingPage/AuthDialog";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-row bg-[#0f1014]`}
      >
        <Navbar />
        <div className="flex flex-col grow ml-20">
          <main className="grow">{children}</main>
          <Footer />
        </div>
        <AuthDialog />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
