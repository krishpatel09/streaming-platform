'use client';

import React from 'react';
import Link from 'next/link';

interface DashboardProps {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  onSignOut: () => void;
}

export default function AuthenticatedDashboard({ user, onSignOut }: DashboardProps) {
  // Mock data for Top 10 Movies (Netflix style vertical posters)
  const topTenMovies = [
    { id: '1', title: 'Cosmic Void', year: '2026', image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=400', rating: '9.2' },
    { id: '2', title: 'Neon Nights', year: '2025', image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=400', rating: '8.8' },
    { id: '3', title: 'The Silent Star', year: '2026', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400', rating: '9.0' },
    { id: '4', title: 'Nebula Rising', year: '2024', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400', rating: '8.5' },
    { id: '5', title: 'The Forgotten', year: '2025', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400', rating: '8.1' }
  ];

  // Mock data for Trending Originals (Hotstar/Prime style 16:9 wide cards)
  const trendingSeries = [
    { id: '101', title: 'Eclipse Chronicles', rating: '8.5', duration: 'S1:E8', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=600' },
    { id: '102', title: 'Starhaven', rating: '8.9', duration: 'S2:E4', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600' },
    { id: '103', title: 'Quantum Frontier', rating: '8.2', duration: 'S1:E12', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600' },
    { id: '104', title: 'Void\'s Edge', rating: '8.6', duration: 'S3:E2', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-600 selection:text-white flex flex-col justify-between">
      {/* Background aurora glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[400px] left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Global Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-900/60 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 flex items-center gap-1.5 select-none">
              ★ STELLAR+
            </span>
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
              <Link href="#" className="text-white hover:text-zinc-200 transition-colors">Home</Link>
              <Link href="#" className="hover:text-zinc-200 transition-colors">Movies</Link>
              <Link href="#" className="hover:text-zinc-200 transition-colors">Shows</Link>
              <Link href="#" className="hover:text-zinc-200 transition-colors">Originals</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin/audit-logs" className="text-rose-500 hover:text-rose-400 transition-colors">
                  Audit Logs
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Welcome back,</span>
              <span className="text-sm font-bold text-zinc-200">{user.username}</span>
            </div>
            <button
              onClick={onSignOut}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Spotlight Hero Banner */}
        <div className="relative w-full h-[70vh] min-h-[480px] bg-zinc-950 overflow-hidden flex items-center">
          {/* Spotlight banner image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-right sm:bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, #09090b 0%, #09090b 35%, rgba(9,9,11,0.7) 60%, rgba(9,9,11,0) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 tracking-wider uppercase mb-4">
                ★ Original Blockbuster
              </span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                GALACTIC ECHOES
              </h2>
              <p className="text-sm sm:text-md text-zinc-400 mt-4 leading-relaxed max-w-lg">
                When a deep-space research vessel encounters a mysterious celestial transmission, a crew of specialists must venture into a dark, forgotten sector of the cosmos.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-950/20 active:scale-[0.98] transition-all cursor-pointer">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/80 px-6 py-3 text-sm font-bold text-white transition-all cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Rows */}
        <div className="max-w-7xl mx-auto px-6 space-y-12 -mt-10 relative z-20">
          
          {/* Row 1: Netflix Style Top 10 Row (Vertical cards with large numbers) */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold tracking-wider text-zinc-300 uppercase">
              Top 10 Movies Today
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {topTenMovies.map((movie, idx) => (
                <div 
                  key={movie.id} 
                  className="flex-none snap-start relative w-[180px] sm:w-[220px] aspect-[2/3] rounded-2xl overflow-hidden group border border-zinc-800 bg-zinc-900/40 select-none cursor-pointer"
                >
                  {/* Rank background number */}
                  <span className="absolute -bottom-6 -left-3 text-8xl sm:text-9xl font-black font-mono leading-none tracking-tighter text-zinc-950/80 select-none pointer-events-none z-10 stroke-1 stroke-zinc-700/40">
                    {idx + 1}
                  </span>
                  
                  {/* Poster Image */}
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Text details shown on hover */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs font-semibold text-amber-400">★ {movie.rating}</span>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-none mt-1">{movie.title}</h4>
                    <span className="text-[10px] text-zinc-400 mt-1">{movie.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Row 2: Disney+ Hotstar / Prime Style Trending Originals (16:9 widescreen cards) */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold tracking-wider text-zinc-300 uppercase">
              Trending Original Series
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {trendingSeries.map((series) => (
                <div 
                  key={series.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/10 overflow-hidden group hover:border-amber-500/30 hover:shadow-[0_4px_20px_rgba(245,158,11,0.05)] transition-all cursor-pointer"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img 
                      src={series.image} 
                      alt={series.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
                    
                    {/* Floating episode duration badge */}
                    <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                      {series.duration}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {series.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded bg-zinc-800 px-1 py-0.5 text-[8px] font-bold text-zinc-400 uppercase">UHD</span>
                        <span className="rounded bg-zinc-800 px-1 py-0.5 text-[8px] font-bold text-zinc-400 uppercase">18+</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 justify-end">
                        ★ {series.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center py-8 text-zinc-700 text-xs border-t border-zinc-900/60 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 Stellar+ Inc. All rights reserved.</span>
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
