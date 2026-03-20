"use client";

import { useState } from "react";
import Image from "next/image";
import { Monitor, Laptop, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const devices = [
  { id: "tv", label: "TV", icon: Monitor, description: "Stream and enjoy your favorites on your TV" },
  { id: "laptop", label: "Laptop & Desktop", icon: Laptop, description: "Stream and enjoy your favorites on your Laptop" },
  { id: "mobile", label: "Tablet & Mobile", icon: Smartphone, description: "Stream and enjoy your favorites on your Mobile & Tablet" },
];

export function AnytimeAnywhere() {
  const [activeDevice, setActiveDevice] = useState("laptop");

  const currentDevice = devices.find(d => d.id === activeDevice);

  return (
    <section className="py-24 bg-[#0f1014] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Any time, Anywhere
          </h2>
          <p className="text-zinc-500 text-lg">
            Stream on your favorite devices. All your content in one place, synchronized across all your screens.
          </p>
        </div>

        {/* Device Selector */}
        <div className="flex items-center gap-12 mb-16">
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => setActiveDevice(device.id)}
              className={cn(
                "flex flex-col items-center gap-3 transition-all duration-300 group cursor-pointer",
                activeDevice === device.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <device.icon className={cn(
                "w-8 h-8 transition-transform group-hover:scale-110",
                activeDevice === device.id ? "text-white" : "text-zinc-600"
              )} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {device.label}
              </span>
              <div className={cn(
                "h-0.5 bg-white transition-all duration-300 rounded-full",
                activeDevice === device.id ? "w-full opacity-100" : "w-0 opacity-0"
              )} />
            </button>
          ))}
        </div>

        {/* Device Preview Content */}
        <div className="relative w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700" key={activeDevice}>
            <p className="text-center text-zinc-400 mb-12 font-medium tracking-wide">
                {currentDevice?.description}
            </p>
            
            <div className="relative aspect-video w-full bg-zinc-900/40 rounded-3xl border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                 <Image 
                    src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000&auto=format&fit=crop" 
                    alt="Device Preview" 
                    fill 
                    className="object-cover opacity-60"
                />
                
                {/* Mockup Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full h-full max-w-3xl border-8 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                         <Image 
                            src="https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=2000&auto=format&fit=crop" 
                            alt="Movie Playing" 
                            fill 
                            className="object-cover"
                        />
                         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Reflection/Glow underneath */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-blue-600/10 blur-[60px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
