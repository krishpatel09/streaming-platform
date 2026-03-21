"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Plus, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  title: string;
  image: string;
  orientation?: "vertical" | "horizontal";
  isNewEpisode?: boolean;
  duration?: string;
  description?: string;
  year?: string;
  rating?: string;
  genres?: string[];
  number?: number;
  showNumber?: boolean;
  progress?: number; // 0 to 100
  subtitle?: string;
}

export function MovieCard({
  title,
  image,
  orientation = "horizontal",
  isNewEpisode = false,
  duration,
  description,
  year = "2024",
  rating = "U/A 13+",
  genres = ["Action", "Drama"],
  number,
  showNumber = false,
  progress,
  subtitle,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    image ||
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop",
  );
  const isHorizontal = orientation === "horizontal";
  const fallbackImage =
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop";

  return (
    <div
      className="relative w-full select-none cursor-pointer"
      style={{ zIndex: isHovered ? 100 : 10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── Layout Spacer (Fixed size to preserve row layout) ─── */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          isHorizontal ? "aspect-video" : "aspect-2/3",
        )}
      />

      {/* Static Info (Visible when not hovered, specifically for MySpace) */}
      {!isHovered && subtitle && (
        <div className="mt-2 px-1">
          <p className="text-zinc-100 text-[13px] font-bold truncate">{title}</p>
          <p className="text-zinc-400 text-[12px] font-medium truncate">{subtitle}</p>
          {duration && <p className="text-zinc-500 text-[11px] font-medium">{duration}</p>}
        </div>
      )}

      {/* ─── Expandable Container ─── */}
      <div
        className={cn(
          "absolute top-0 overflow-hidden rounded-lg bg-[#141414] border border-white/5",
          isHovered
            ? "z-50 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/10"
            : "z-10 shadow-lg ring-0 ring-transparent",
          // The magic expansion logic
          isHovered && !isHorizontal
            ? "w-[200%] -left-[50%] -translate-y-16"
            : isHovered && isHorizontal
              ? "w-[125%] -left-[12.5%] -translate-y-12"
              : "w-full left-0 translate-y-0",
        )}
        style={{
          transformOrigin: "center center",
          backgroundColor: isHovered ? "#141414" : "rgba(20,20,20,0.5)",
          transition: "none",
        }}
      >
        {/* Cinematic Thumbnail Area */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-zinc-900",
            // Switch aspect ratio on hover for vertical rows
            isHovered || isHorizontal ? "aspect-video" : "aspect-2/3",
          )}
        >
          {/* Main Cinematic Image */}
          <Image
            src={imgSrc}
            alt={title}
            fill
            onError={() => setImgSrc(fallbackImage)}
            className={cn(
              "object-cover",
              isHovered ? "scale-110" : "scale-100",
            )}
            style={{ transition: "none" }}
            unoptimized={imgSrc.startsWith("http")}
          />

          {/* Progress Bar (Continue Watching) */}
          {progress !== undefined && (
             <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-30">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
             </div>
          )}

          {/* Bottom Fade Gradient (Static View) */}
          {!isHovered && (
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />
          )}

          {/* Hover Play Button Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/20 z-20",
              isHovered ? "opacity-100" : "opacity-0",
            )}
            style={{ transition: "none" }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group/play cursor-pointer">
              <Play className="w-6 h-6 fill-white text-white ml-1" />
            </div>
          </div>
        </div>

        {/* ─── Premium Information Panel ─── */}
        <div
          className={cn(
            "w-full overflow-hidden bg-[#141414]",
            isHovered
              ? "max-height-none opacity-100 py-6 px-6"
              : "max-h-0 opacity-0",
          )}
          style={{ transition: "none" }}
        >
          <div className="space-y-4">
            {/* Direct Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex-1 h-11 px-4 rounded-lg bg-white/95 hover:bg-white text-black flex items-center justify-center gap-2 font-black shadow-2xl cursor-pointer">
                <Play className="w-5 h-5 fill-black text-black" />
                <span className="text-sm font-black uppercase tracking-tight">
                  Watch Now
                </span>
              </button>
              <button className="w-11 h-11 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-white/5 flex items-center justify-center cursor-pointer">
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Quick Metadata Info */}
            <div className="flex items-center gap-2 text-[12px] font-bold text-zinc-100/90 whitespace-nowrap">
              <span>{year}</span>
              <span className="text-zinc-600"> • </span>
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9px] font-black ring-1 ring-white/10 text-zinc-300">
                {rating}
              </span>
              <span className="text-zinc-600"> • </span>
              <span>{duration || "1h 51m"}</span>
              <span className="text-zinc-600"> • </span>
              <span className="text-zinc-400">4 Languages</span>
            </div>

            {subtitle && (
              <p className="text-blue-500 text-[11px] font-black uppercase tracking-wider">
                {isNewEpisode ? "New Episode" : "Continue Watching"}
              </p>
            )}

            {/* Movie Description */}
            <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-4 font-medium opacity-90">
              {description ||
                "Experience this captivating cinematic journey, featuring award-winning storytelling and breathtaking visuals."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
