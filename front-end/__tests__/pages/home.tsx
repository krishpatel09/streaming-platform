"use client";

import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Home } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function HomeTestPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0f1014] text-white">
        {/* Simple Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="font-black italic tracking-tighter text-white">SV</span>
            </div>
            <span className="text-xl font-bold tracking-tight">StreamVerse</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-purple-500" />
              <span className="text-sm font-bold">{user?.fullName || "Guest User"}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              className="text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-20 px-8 text-center">
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">
              Welcome to <br />
              <span className="bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Streaming Platform
              </span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Hello, <span className="text-white font-bold">{user?.fullName}</span>! 
              You have successfully authenticated. This is a secure testing environment 
              for your streaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 text-left space-y-4 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Start Exploring</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Browse through our vast catalog of movies, series, and live TV channels.
              </p>
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-white/5">
                Browse Catalog
              </Button>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 text-left space-y-4 hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserIcon className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Your Profile</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Manage your viewing profiles, watchlists, and account settings.
              </p>
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-white/5">
                Manage Profile
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
