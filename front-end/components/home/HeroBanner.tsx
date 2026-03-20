"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroesData from "@/data/heroes.json";
import { cn } from "@/lib/utils";

type HeroSlide = (typeof heroesData)[number];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const current: HeroSlide = heroesData[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 400);
    },
    [currentIndex, isTransitioning],
  );

  const goPrev = () => {
    const prev = (currentIndex - 1 + heroesData.length) % heroesData.length;
    goTo(prev);
  };

  const goNext = useCallback(() => {
    const next = (currentIndex + 1) % heroesData.length;
    goTo(next);
  }, [currentIndex, goTo]);

  // Auto-advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <div className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* ── Background Layer ── */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isTransitioning ? "opacity-0" : "opacity-100",
        )}
      >
        <Image
          key={`img-${current.id}`}
          src={current.backgroundImage}
          alt={current.title}
          fill
          priority
          className="object-cover object-top transition-opacity duration-700 opacity-100"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#0f1014] z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div
        className={cn(
          "relative z-20 flex flex-col justify-end h-full px-8 lg:px-16 pb-32 transition-all duration-500",
          isTransitioning
            ? "opacity-0 translate-y-4"
            : "opacity-100 translate-y-0",
        )}
      >
        <div className="max-w-[800px] space-y-8">
          {/* Meta info header */}
          <div className="flex items-center gap-4 text-sm font-bold text-zinc-300 tracking-wider">
            <span>{current.year}</span>
            <span className="w-px h-3 bg-zinc-700" />
            <span>{current.rating}</span>
            <span className="w-px h-3 bg-zinc-700" />
            <span>{current.duration || "Movie"}</span>
            <span className="w-px h-3 bg-zinc-700" />
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-500">★</span>
              {current.languages || current.language}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-7xl lg:text-9xl font-black text-white leading-[0.8] drop-shadow-2xl tracking-tighter uppercase italic">
            {current.title}
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-lg lg:text-xl leading-relaxed line-clamp-2 max-w-2xl font-medium drop-shadow-lg">
            {current.description}
          </p>

          {/* Countdown timer (Specific to Avatar 2) */}
          <div className="flex items-center gap-4 py-4">
            {[
              { value: "23", label: "Days" },
              { value: "05", label: "Hours" },
              { value: "56", label: "Minutes" },
              { value: "48", label: "Seconds" },
            ].map((time) => (
              <div key={time.label} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 mb-2">
                  <span className="text-2xl font-black text-white">
                    {time.value}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {time.label}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              id={`hero-cta-${current.id}`}
              className="h-10 px-10 bg-[#e50914] hover:bg-[#ff0f1e] text-white font-black text-sm rounded-sm transition-all shadow-xl shadow-[#e50914]/20 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              Watch
            </Button>
            <Button
              id="hero-trailer-btn"
              className="h-10 px-10 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-black text-sm rounded-sm transition-all backdrop-blur-md cursor-pointer uppercase tracking-wider"
            >
              Trailer
            </Button>
          </div>
        </div>

        {/* Thumbnail Carousel below the content */}
        <div className="mt-16 relative">
          <div className="flex items-center gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {heroesData.map((slide, i) => (
              <div key={slide.id} className="flex flex-col items-center gap-3">
                <button
                  onClick={() => goTo(i)}
                  className={cn(
                    "group relative w-24 h-36 lg:w-32 lg:h-48 rounded-lg overflow-hidden shrink-0 transition-all duration-500 cursor-pointer border-2",
                    i === currentIndex
                      ? "border-[#e50914] scale-110 z-10 shadow-[0_0_30px_rgba(229,9,20,0.3)]"
                      : "border-transparent opacity-40 hover:opacity-100",
                  )}
                >
                  <Image
                    src={slide.thumbnails[0]}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </button>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    i === currentIndex ? "text-white" : "text-zinc-600",
                  )}
                >
                  {slide.title}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-2">
            {heroesData.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full cursor-pointer",
                  i === currentIndex ? "w-6 bg-[#e50914]" : "w-1.5 bg-zinc-800",
                )}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/20 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/20 hover:text-white transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
