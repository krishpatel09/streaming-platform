"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function IdentifyStep() {
  const { mode, setMode, setStep, setEmail, setUsername } = useAuthStore();
  const [value, setValue] = useState("");

  const handleContinue = () => {
    if (!value) return;
    if (mode === "login") {
      setEmail(value);
    } else {
      setUsername(value);
    }
    setStep("verify");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-zinc-400 text-sm font-medium">
          {mode === "login" 
            ? "Log in to your StreamVerse account" 
            : "Sign up to start your cinematic journey"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <Input
            type="text"
            placeholder={
              mode === "login" ? "Email or Mobile Number" : "Choose a username"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-14 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 rounded-xl px-4 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <Button
          onClick={handleContinue}
          disabled={!value}
          className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-zinc-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] group"
        >
          Get OTP
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-start text-xs uppercase">
          <span className="bg-[#0f1014] pr-4 text-zinc-500 font-black tracking-[0.2em]">OR CONTINUE WITH</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all"
        >
          Google
        </Button>
        <Button
          variant="outline"
          className="h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all"
        >
          Facebook
        </Button>
      </div>

      <div className="pt-4">
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-zinc-400 text-sm font-medium hover:text-white transition-colors group flex items-center gap-1"
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-blue-500 font-bold group-hover:underline ml-1">
            {mode === "login" ? "Sign Up Free" : "Log In Now"}
          </span>
        </button>
      </div>
    </div>
  );
}
