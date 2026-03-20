"use client";

import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { ProfileSelection } from "@/components/auth/ProfileSelection";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const { setOpen, isAuthenticated, user, logout } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const router = useRouter();

  if (isAuthenticated) {
    if (!currentProfile) {
      return (
        <div className="relative min-h-screen w-full bg-[#0f1014] flex flex-col items-center justify-center">
          <ProfileSelection />
        </div>
      );
    }

    return (
      <div className="relative min-h-screen w-full bg-[#0f1014] flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[180px] -mr-96 -mt-96" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center border-4 border-white/10 shadow-2xl overflow-hidden">
            {currentProfile.avatar_url ? (
              <Image
                src={currentProfile.avatar_url}
                alt={currentProfile.profile_name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-black text-white">
                {currentProfile.profile_name.charAt(0)}
              </span>
            )}
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">
              Welcome, {currentProfile.profile_name}!
            </h1>
            <p className="text-zinc-400 font-medium tracking-wide">
              Logged in with {user?.email || user?.phoneNumber}
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-xl h-12 transition-all active:scale-95"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 font-bold px-8 rounded-xl h-12 transition-all active:scale-95"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-0px)] w-full overflow-hidden bg-[#0f1014] flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[180px] -mr-96 -mt-96" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      </div>

      <div className="absolute top-8 right-12 z-20">
        <Button className="flex items-center gap-3 h-14 px-8 bg-zinc-900/60 hover:bg-zinc-800 border border-white/10 rounded-xl transition-all font-bold text-base backdrop-blur-md group shadow-2xl shadow-indigo-500/10 cursor-pointer text-white">
          <HelpCircle className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-zinc-100 font-black">Help & Support</span>
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl px-12 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative w-[380px] h-[280px] drop-shadow-[0_0_80px_rgba(59,130,246,0.15)] group">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Image
            src="/my_space_login_in_jv.webp"
            alt="Login Illustration"
            fill
            className="object-contain transition-all duration-700"
            priority
          />
        </div>

        <div className="space-y-3 mb-10 text-white">
          <h1 className="text-[24px] leading-[32px] font-semibold drop-shadow-2xl">
            Login to StreamVerse
          </h1>
          <p className="text-[14px] leading-[20px] font-medium text-zinc-400 max-w-[400px] mx-auto">
            Start watching from where you left off, personalise for kids and
            more
          </p>
        </div>

        <Button
          onClick={() => router.push("/login")}
          className="group relative h-12 w-full max-w-[280px] bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base rounded-lg transition-all shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_48px_rgba(59,130,246,0.4)] active:scale-95 cursor-pointer tracking-wide overflow-hidden"
        >
          <span className="relative z-10">Log In</span>
        </Button>

        <div className="mt-12 opacity-50 text-zinc-600 text-[10px] tracking-widest uppercase font-bold">
          © 2026 StreamVerse Entertainment • All Rights Reserved
        </div>
      </div>
    </div>
  );
}
