"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export function SuccessStep() {
  const { mode, reset } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(reset, 2000); // Automaticaly close after 2 seconds
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 animate-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
        <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
      </div>
      
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Success!
        </h2>
        <p className="text-zinc-400 text-lg">
          {mode === "login" 
            ? "Welcome back to StreamVerse" 
            : "Your account has been created"}
        </p>
      </div>

      <Button 
        onClick={reset}
        className="mt-4 px-12 h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-green-500/10 active:scale-95"
      >
        Continue Watching
      </Button>
    </div>
  );
}
