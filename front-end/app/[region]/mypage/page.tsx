"use client";

import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div className="relative min-h-[calc(100vh-0px)] w-full overflow-hidden bg-[#0f1014] flex flex-col items-center justify-center">
      {/* ─── Background Glow / Cosmic Aesthetic ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* Subtle top-right glow matching the Help button location */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[180px] -mr-96 -mt-96" />

        {/* Central radial gradient for emphasis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)]" />

        {/* Very subtle stars (simulated with opacity dots) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      </div>

      {/* ─── Help Button (Top Right) ─── */}
      <div className="absolute top-8 right-12 z-20">
        <Button className="flex items-center gap-3 h-14 px-8 bg-zinc-900/60 hover:bg-zinc-800 border border-white/10 rounded-xl transition-all font-bold text-base backdrop-blur-md group shadow-2xl shadow-indigo-500/10 cursor-pointer">
          <HelpCircle className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-zinc-100 font-black">Help & Support</span>
          {/* Subtle vertical divider effect */}
          {/* <div className="w-px h-6 bg-white/10 ml-2" /> */}
        </Button>
      </div>

      {/* ─── Main Content Content (Centered) ─── */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-12 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Illustration Container with Hover Animation */}
        <div className="relative w-[380px] h-[280px]  drop-shadow-[0_0_80px_rgba(59,130,246,0.15)] group">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Image
            src="/my_space_login_in_jv.webp"
            alt="Login Illustration"
            fill
            className="object-contain transition-all duration-700"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-3 mb-10">
          <h1 className="text-[24px] leading-[32px] font-semibold text-white drop-shadow-2xl">
            Login to StreamVerse
          </h1>
          <p className="text-[14px] leading-[20px] font-medium text-zinc-400 max-w-[400px] mx-auto">
            Start watching from where you left off, personalise for kids and
            more
          </p>
        </div>

        {/* Log In Button (Premium Variant) */}
        <Button className="group relative h-12 w-full max-w-[280px] bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base rounded-lg transition-all shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_48px_rgba(59,130,246,0.4)] active:scale-95 cursor-pointer tracking-wide overflow-hidden">
          <span className="relative z-10">Log In</span>
        </Button>

        {/* Extra Bottom Space for balance */}
        <div className="mt-12 opacity-50 text-zinc-600 text-[10px] tracking-widest uppercase font-bold">
          © 2026 StreamVerse Entertainment • All Rights Reserved
        </div>
      </div>
    </div>
  );
}
