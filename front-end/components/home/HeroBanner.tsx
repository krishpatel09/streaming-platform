"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Plus,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroesData from "@/data/heroes.json";
import { cn } from "@/lib/utils";

type HeroSlide = (typeof heroesData)[number];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current: HeroSlide = heroesData[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setVideoReady(false);
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

  // Sync mute state to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // When slide changes, reload and play the video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.muted = isMuted;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // autoplay blocked — stay on image fallback
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleVideoCanPlay = () => {
    setVideoReady(true);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = isMuted;
      vid.play().catch(() => {});
    }
  };

  // Build meta parts
  const metaParts: string[] = [current.year, current.rating];
  if ("duration" in current && current.duration)
    metaParts.push(current.duration as string);
  if ("seasons" in current && current.seasons)
    metaParts.push(current.seasons as string);
  if ("languages" in current && current.languages)
    metaParts.push(current.languages as string);
  if ("language" in current && current.language)
    metaParts.push(current.language as string);

  const trailerVideo =
    "trailerVideo" in current ? (current.trailerVideo as string) : null;

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* ── Background Layer ── */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isTransitioning ? "opacity-0" : "opacity-100",
        )}
      >
        {/* Fallback image – shown until video is ready */}
        <Image
          key={`img-${current.id}`}
          src={current.backgroundImage}
          alt={current.title}
          fill
          priority
          className={cn(
            "object-cover object-center transition-opacity duration-700",
            videoReady && trailerVideo ? "opacity-0" : "opacity-100",
          )}
        />

        {/* MP4 video trailer */}
        {trailerVideo && (
          <video
            ref={videoRef}
            key={`vid-${current.id}`}
            muted
            loop
            playsInline
            onCanPlay={handleVideoCanPlay}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
              videoReady ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={trailerVideo} type="video/mp4" />
          </video>
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/65 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent z-10" />

      </div>

      <div
        className={cn(
          "relative z-20 flex flex-col justify-center h-full px-8 lg:px-16 pt-10 transition-all duration-500",
          isTransitioning
            ? "opacity-0 translate-y-4"
            : "opacity-100 translate-y-0",
        )}
      >
        {/* Text Content (Constrained to left, but larger) */}
        <div className="max-w-[70%] space-y-6">
          {/* Title */}
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl tracking-tighter uppercase">
            {current.title}
          </h1>

          <div className="space-y-4">
            {/* Badge */}
            {"badge" in current && current.badge && (
              <p className="text-blue-400 font-extrabold text-lg tracking-widest uppercase mb-1">
                {current.badge}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 text-lg font-bold text-zinc-100 drop-shadow-md">
              {metaParts.map((part, i) => (
                <span key={i} className="flex items-center gap-4">
                  {i > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400/80 inline-block" />
                  )}
                  {part}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-zinc-200 text-lg lg:text-xl leading-relaxed line-clamp-3 mb-4 max-w-3xl font-medium drop-shadow-lg">
              {current.description}
            </p>

            {/* Genres */}
            <div className="flex items-center gap-3 flex-wrap text-white font-bold text-base mb-6">
              {current.genres.map((genre, i) => (
                <span key={genre} className="flex items-center gap-3">
                  {i > 0 && <span className="w-px h-5 bg-white/30" />}
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons and Thumbnails Row (Split Left/Right) */}
        <div className="flex items-center justify-between gap-6 mt-12 w-full overflow-visible">
          {/* Action Buttons (Left Side) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              id={`hero-cta-${current.id}`}
              className="h-12 px-16 bg-linear-to-r from-[#d82f8a] to-[#ff3b9a] hover:from-[#f03fad] hover:to-[#ff5cb8] text-white font-black text-base rounded-md transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="fill-white w-4 h-4 mr-2 shrink-0" />
              Watch Now
            </Button>
            <Button
              id="hero-add-btn"
              className="h-12 w-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all backdrop-blur-md group cursor-pointer"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Thumbnail Navigation Strip (Right Side) */}
          <div className="hidden lg:flex flex-initial overflow-visible relative">
            {/* Thumbnails */}
            <div className="flex items-center gap-2 overflow-visible">
              {heroesData.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(i)}
                  className={cn(
                    "group relative w-20 h-11 rounded-md overflow-hidden shrink-0 transition-all duration-300 cursor-pointer",
                    i === currentIndex
                      ? "ring-2 ring-white scale-105 z-10 shadow-xl"
                      : "ring-1 ring-white/10 opacity-50 hover:opacity-100",
                  )}
                >
                  <Image
                    src={slide.thumbnails[0]}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-1">
                    <p className="text-[7px] font-black text-white truncate text-center uppercase tracking-tight">
                      {slide.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Floating Minimalist Bold Prev Chevron */}
            <button
              onClick={goPrev}
              className={cn(
                "absolute -left-4 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center text-white transition-all cursor-pointer z-20",
                currentIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100",
              )}
            >
              <ChevronLeft
                className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                strokeWidth={2.5}
              />
            </button>

            {/* Floating Minimalist Bold Next Chevron */}
            <button
              onClick={goNext}
              className={cn(
                "absolute -right-4 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center text-white transition-all cursor-pointer z-20",
                currentIndex === heroesData.length - 1
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100",
              )}
            >
              <ChevronRight
                className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mute toggle (top-right) ── */}
      <button
        id="hero-mute-btn"
        onClick={() => setIsMuted((m) => !m)}
        className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
