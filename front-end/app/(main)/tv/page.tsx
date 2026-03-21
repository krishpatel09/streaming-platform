"use client";

import { Tv } from "lucide-react";

export default function TVPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-6 bg-zinc-900/50 rounded-full border border-white/5">
        <Tv className="w-12 h-12 text-zinc-500" />
      </div>
      <h1 className="text-4xl font-black text-white px-2">TV Shows</h1>
      <p className="text-zinc-500 font-bold tracking-wide">Binge-worthy series and live television episodes.</p>
    </div>
  );
}
