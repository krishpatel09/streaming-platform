"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const filters = ["All", "Rating", "View", "Latest", "Generic"];

const movies = [
  { id: 1, title: "Exodus", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop", category: "Latest" },
  { id: 2, title: "Rambo", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop", category: "Rating" },
  { id: 3, title: "City of Gold", image: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=600&auto=format&fit=crop", category: "View" },
  { id: 4, title: "Gabriel", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop", category: "Generic" },
  { id: 5, title: "Gobbile", image: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=600&auto=format&fit=crop", category: "Latest" },
  { id: 6, title: "X-Men Apocalypse", image: "https://images.unsplash.com/photo-1560109947-543149eceb16?q=80&w=600&auto=format&fit=crop", category: "Rating" },
  { id: 7, title: "Bleedish", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop", category: "View" },
  { id: 8, title: "Nun Curse", image: "https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=600&auto=format&fit=crop", category: "Generic" },
];

export function PopularMovies() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMovies = activeFilter === "All" 
    ? movies 
    : movies.filter(m => m.category === activeFilter);

  return (
    <section className="py-24 bg-[#0f1014]">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">
            Most Popular Movies
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-black transition-all cursor-pointer uppercase tracking-wider",
                  activeFilter === filter 
                    ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/20 scale-105" 
                    : "bg-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
           {filteredMovies.map((movie) => (
             <div key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-2/3 rounded-xl overflow-hidden mb-3 border border-white/5 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    <Image src={movie.image} alt={movie.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                             <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                        </div>
                    </div>
                </div>
                <h3 className="text-sm font-black text-zinc-300 group-hover:text-white transition-colors uppercase tracking-tight">
                    {movie.title}
                </h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                    Classic · {movie.category}
                </p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
