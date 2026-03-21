"use client";

import React from "react";
import { 
  Smartphone, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col gap-12">
      {/* Subscription Card */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight leading-none">
            Jio Cricket Offer - Mobile/4K TV
          </h2>
          <p className="text-zinc-500 font-bold text-lg">
            Plan expires on 1 Jun, 2026
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-12 px-10 bg-linear-to-r from-blue-600 to-fuchsia-600 hover:opacity-90 text-white font-black text-sm rounded-xl shadow-2xl transition-all active:scale-95 tracking-widest leading-none">
            Upgrade
          </button>
          <Button className="h-12 px-8 bg-zinc-800/80 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all active:scale-95">
            Payment Details
          </Button>
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-8 pt-4 border-t border-white/5 max-w-2xl">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="space-y-1">
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
              Registered Mobile Number
            </p>
            <p className="text-xl font-black text-white">
              {user?.phoneNumber || "+91 7016039302"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-500 font-bold group-hover:text-blue-400 transition-colors">
            <span>Update</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-lg font-black text-white decoration-blue-500/50 underline-offset-8">
            This Device
          </p>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">
                  Chrome Browser on Windows
                </span>
                <span className="text-sm text-zinc-500 font-medium italic">
                  Last used : Today
                </span>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              className="h-11 px-8 bg-zinc-900/50 hover:bg-[#e50914]/10 text-zinc-400 hover:text-[#e50914] font-black text-sm rounded-xl transition-all flex items-center gap-3 border border-white/5"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
