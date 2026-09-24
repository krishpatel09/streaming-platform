'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PublicLanding() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-rose-600 selection:text-white flex flex-col justify-between overflow-hidden">
      {/* Background movie collage overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-10000 ease-out"
        style={{ 
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 100%), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200')` 
        }}
      />

      {/* Floating Header */}
      <header className="relative z-10 px-6 py-5 md:px-12 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-rose-600">
          STREAMING
        </h1>
        <Link 
          href="/login" 
          className="rounded bg-rose-600 px-5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-rose-500 hover:scale-[1.03] active:scale-[0.98]"
        >
          Sign In
        </Link>
      </header>

      {/* Hero promo messaging */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center flex-1 py-12">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
          Unlimited movies, TV shows, and more.
        </h2>
        <p className="text-lg md:text-2xl font-normal text-zinc-300 mt-4 md:mt-6">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-sm md:text-lg text-zinc-400 mt-6 md:mt-8">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Action input */}
        <form onSubmit={handleGetStarted} className="mt-6 w-full max-w-2xl flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full sm:flex-1 rounded-xl border border-zinc-700 bg-black/60 px-5 py-4 text-white placeholder-zinc-500 outline-none backdrop-blur-md focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          />
          <button 
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-md font-bold text-white transition-all hover:bg-rose-500 active:scale-[0.98] whitespace-nowrap"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-center py-6 text-zinc-600 text-xs border-t border-zinc-900/60 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 Streaming Platform Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">Terms of Use</Link>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
