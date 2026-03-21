"use client";

import Image from "next/image";
import { Edit2, Plus, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { MovieCard } from "@/components/home/MovieCard";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function MySpacePage() {
  const { user } = useAuthStore();
  const { currentProfile } = useProfileStore();

  const watchlist = [
    {
      title: "Demon Slayer",
      image: "https://image.tmdb.org/t/p/w500/xUfSrb9R9v36CO3PvfUM9lxupC8.jpg",
    },
    {
      title: "Avengers: Endgame",
      image: "https://image.tmdb.org/t/p/w500/or06vS3STVEP1vEEwtqG1oTWjC6.jpg",
    },
    {
      title: "Nazar",
      image: "https://image.tmdb.org/t/p/w500/7WsyChQjaSCx9v9XpS7M9L7S0XU.jpg",
    },
    {
      title: "Divya Drishti",
      image: "https://image.tmdb.org/t/p/w500/u3bU9nS79FKsuVM9UoLY9p6oJp5.jpg",
    },
  ];

  const continueWatching = [
    {
      title: "Yeh Rishta Kya Kehlata Hai",
      subtitle: "S65 E466 • 7 Nov",
      duration: "21m left",
      progress: 65,
      image: "https://image.tmdb.org/t/p/w500/6yS6X6XGZ4Z4Z4Z4Z4Z4Z4Z4Z4.jpg",
    },
    {
      title: "Divya Drishti",
      subtitle: "S1 E103 • 15 Feb",
      duration: "Next Episode",
      progress: 95,
      image: "https://image.tmdb.org/t/p/w500/u3bU9nS79FKsuVM9UoLY9p6oJp5.jpg",
    },
    {
      title: "Kasautii Zindagii Kay",
      subtitle: "S1 E364 • 11 Feb",
      duration: "Next Episode",
      progress: 80,
      image: "https://image.tmdb.org/t/p/w500/8yS8X8XG8Z4Z4Z4Z4Z4Z4Z4Z4.jpg",
    },
    {
      title: "The Adventures of Hatim",
      subtitle: "S1 E15",
      duration: "44m left",
      progress: 30,
      image: "https://image.tmdb.org/t/p/w500/9yS9X9XG9Z4Z4Z4Z4Z4Z4Z4Z4.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
      {/* ── User Header Section ── */}
      <div className="relative w-full pt-28 pb-12 px-8 lg:px-16 overflow-hidden">
        {/* Background Gradient / Glow */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 group cursor-pointer">
              <h2 className="text-xl lg:text-2xl font-black text-[#ffcc00] tracking-tighter uppercase italic hover:text-[#ffdd33] transition-colors">
                Jio Cricket Offer - Mobile/4K TV
              </h2>
              <ChevronRight className="w-6 h-6 text-[#ffcc00] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-zinc-500 text-lg font-bold tracking-tight">
              {user?.phoneNumber || "+91 00000 00000"}
            </p>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center">
              <Link href={`${ROUTES.SUBSCRIBE}`}>
                <Button className="h-11 px-12 bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-black text-sm rounded-lg shadow-2xl transition-all active:scale-95 tracking-widest leading-none">
                  UPGRADE
                </Button>
              </Link>
              <span className="text-[9px] text-zinc-500 font-bold uppercase mt-2 tracking-[0.2em] opacity-80">
                UPGRADE FOR MORE BENEFITS
              </span>
            </div>

            <Link href={ROUTES.SETTINGS}>
              <Button
                variant="outline"
                className="h-11 px-6 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg flex items-center gap-2 transition-all active:scale-95 border"
              >
                <Settings className="w-4 h-4" />
                <span className="text-[13px]">Help & Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-white/5 mt-12 mb-8" />

        {/* Profiles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Profiles
            </h3>
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white font-bold flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </div>

          <div className="flex items-center gap-8">
            {/* Existing Profile */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-[#e50914] transition-all group-hover:scale-105 shadow-2xl">
                  <Image
                    src="https://avatar.iran.liara.run/public/boy"
                    alt="user"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-[#0f1014]">
                  <div className="w-4 h-4 bg-[#0f1014] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest">
                {currentProfile?.profile_name || "User"}
              </span>
            </div>

            {/* Add Profile */}
            <Link href="/myspace/create-profile">
              <div className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/5 border-4 border-white/5 hover:border-white/20 flex items-center justify-center transition-all">
                  <Plus className="w-10 h-10 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Add
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Watchlist Section ── */}
      <div className="px-8 lg:px-16 py-8 space-y-6">
        <h3 className="text-2xl font-black text-white tracking-tight">
          Watchlist
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {watchlist.map((movie, idx) => (
            <MovieCard
              key={idx}
              title={movie.title}
              image={movie.image}
              orientation="vertical"
              year="2023"
              rating="U/A 13+"
            />
          ))}
        </div>
      </div>

      {/* ── Continue Watching Section ── */}
      <div className="px-8 lg:px-16 py-8 pb-4 space-y-6">
        <h3 className="text-2xl font-black text-white tracking-tight">
          Continue Watching for {currentProfile?.profile_name || "User"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {continueWatching.map((item, idx) => (
            <MovieCard
              key={idx}
              title={item.title}
              image={item.image}
              orientation="horizontal"
              subtitle={item.subtitle}
              duration={item.duration}
              progress={item.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
