"use client";

import { useAuthStore } from "@/stores/authStore";
import { IdentifyStep } from "@/components/auth/IdentifyStep";
import { VerifyStep } from "@/components/auth/VerifyStep";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const { step, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/profile-selecter`);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen w-full bg-[#0f1014] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-zinc-900/30 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
        {/* Left Side: Branding/Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900/50 border-r border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 mb-8">
              <span className="text-3xl font-black italic tracking-tighter text-blue-500">
                SV
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Your Gateway to <br />
              <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent italic">
                Limitless Streaming
              </span>
            </h1>
            <p className="mt-6 text-zinc-400 text-lg font-medium leading-relaxed max-w-sm">
              Access 4K cinematic experiences across all your devices. Join our
              community of movie enthusiasts today.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                >
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    alt="user"
                    width={40}
                    height={40}
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                +10k
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-bold tracking-wide uppercase">
              Trusted by 10,000+ streamers
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center min-h-[500px]">
          <div className="w-full max-w-[400px] mx-auto">
            {step === "identify" && <IdentifyStep />}
            {step === "verify" && <VerifyStep />}
          </div>
        </div>
      </div>
    </div>
  );
}
