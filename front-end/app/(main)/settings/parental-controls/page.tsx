"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParentalControlsPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white tracking-tight leading-none">
          Parental Controls
        </h2>
        <p className="text-zinc-500 font-bold text-lg">
          Manage content restrictions and profile locks
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile Lock */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-white">Profile Lock</span>
              <span className="text-sm text-zinc-500 font-medium">Require a PIN to access this profile</span>
            </div>
          </div>
          <Button variant="ghost" className="text-blue-500 font-bold">Setup</Button>
        </div>

        {/* Content Restrictions */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-white">Content Restrictions</span>
              <span className="text-sm text-zinc-500 font-medium">Restrict content based on age ratings</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="font-bold">U/A 13+</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* Viewing Restrictions */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-white">Hide Content</span>
              <span className="text-sm text-zinc-500 font-medium">Hide specific shows or movies</span>
            </div>
          </div>
          <Button variant="ghost" className="text-zinc-500 font-bold">Manage</Button>
        </div>
      </div>
    </div>
  );
}
