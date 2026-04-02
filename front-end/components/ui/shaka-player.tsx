"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  FastForward,
  Square,
  Gauge,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ShakaPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2, 5];

/** Detect MIME type from the URL path (before query params). */
const getMimeType = (url: string): string | undefined => {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".m3u8")) return "application/x-mpegurl";
  if (path.endsWith(".mpd"))  return "application/dash+xml";
  if (path.endsWith(".mp4"))  return "video/mp4";
  if (path.endsWith(".webm")) return "video/webm";
  return undefined;
};

const isDirectFile = (url: string) => {
  const mime = getMimeType(url);
  return mime === "video/mp4" || mime === "video/webm";
};

export function ShakaPlayer({
  src,
  poster,
  autoPlay = false,
  className,
}: ShakaPlayerProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef   = useRef<any>(null);

  const [player, setPlayer]           = useState<any>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [isMuted, setIsMuted]         = useState(false);
  const [volume, setVolume]           = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [qualityLevel, setQualityLevel]         = useState("Auto");
  const [playbackRate, setPlaybackRate]         = useState(1);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Player Initialization ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !videoRef.current || !src) return;

    const video = videoRef.current;

    if (isDirectFile(src)) {
      // Native HTML5 video for MP4/WebM — no Shaka needed
      video.src = src;
      video.load();
      setIsLoading(false);
      if (autoPlay) {
        video.play().catch(() => {
          video.muted = true;
          video.play();
          setIsMuted(true);
        });
      }
      return () => {
        video.src = "";
        video.load();
      };
    }

    // Shaka for adaptive streams (HLS / DASH)
    const shaka = require("shaka-player/dist/shaka-player.ui.js");

    const initShaka = async () => {
      shaka.polyfill.installAll();
      if (!shaka.Player.isBrowserSupported()) return;

      const instance = new shaka.Player(video);
      playerRef.current = instance;
      setPlayer(instance);

      instance.addEventListener("error", (e: any) =>
        console.error("Shaka error", e.detail)
      );

      try {
        setIsLoading(true);
        await instance.load(src, null, getMimeType(src));
        setIsLoading(false);

        const trackList = instance.getVariantTracks();
        const qs = (
          Array.from(new Set(trackList.map((t: any) => `${t.height}p`))) as string[]
        ).sort((a, b) => parseInt(b) - parseInt(a));
        setAvailableQualities(["Auto", ...qs]);

        if (autoPlay) {
          video.play().catch(() => {
            video.muted = true;
            video.play();
            setIsMuted(true);
          });
        }
      } catch (e) {
        console.error("Error loading stream", e);
        setIsLoading(false);
      }
    };

    initShaka();

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
      setPlayer(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, autoPlay]);

  // ── Video Event Listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime    = () => setCurrentTime(video.currentTime);
    const onDur     = () => setDuration(video.duration);
    const onPlay    = () => setIsPlaying(true);
    const onPause   = () => setIsPlaying(false);
    const onWait    = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("durationchange", onDur);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWait);
    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("durationchange", onDur);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWait);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Show controls when paused
  useEffect(() => {
    if (!isPlaying) setShowControls(true);
  }, [isPlaying]);

  // Cleanup timer
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ── Auto-hide controls ───────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // ── Control Handlers ─────────────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const stopVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleSeek = (values: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = values[0];
    setCurrentTime(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = values[0] / 100;
    v.volume = vol;
    v.muted  = vol === 0;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : containerRef.current.requestFullscreen();
  };

  const skip = (secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + secs));
  };

  const changeQuality = (q: string) => {
    if (!player) return;
    setQualityLevel(q);
    if (q === "Auto") {
      player.configure({ abr: { enabled: true } });
    } else {
      const h = parseInt(q);
      const t = player.getVariantTracks().find((t: any) => t.height === h);
      if (t) {
        player.configure({ abr: { enabled: false } });
        player.selectVariantTrack(t, true);
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    return `${m}:${String(s).padStart(2,"0")}`;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black overflow-hidden aspect-video shadow-2xl select-none",
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40">
          <Loader2 className="w-10 h-10 text-white animate-spin opacity-80" />
        </div>
      )}

      {/* Center play overlay */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-black/70 transition-all duration-300">
            <Play className="w-9 h-9 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Bottom gradient */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black via-black/60 to-transparent pointer-events-none transition-opacity duration-500",
          showControls ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 transition-all duration-500",
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        )}
      >
        {/* Progress */}
        <div className="px-5 pb-2 pt-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Control bar */}
        <div className="px-5 pb-4 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shrink-0"
            >
              {isPlaying
                ? <Pause className="w-5 h-5 fill-current" />
                : <Play  className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Stop */}
            <button
              onClick={stopVideo}
              title="Stop"
              className="w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <div className="w-px h-5 bg-white/15 mx-1" />

            {/* Rewind */}
            <button onClick={() => skip(-10)} title="–10s" className="w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Forward */}
            <button onClick={() => skip(10)} title="+10s" className="w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
              <FastForward className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/15 mx-1" />

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className="w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300 flex items-center">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            {/* Time */}
            <div className="text-xs font-semibold text-white/60 ml-2 tabular-nums flex items-center gap-1">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="opacity-40">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 h-8 px-3 bg-white/8 hover:bg-white/15 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all">
                  <Gauge className="w-3.5 h-3.5" />
                  {playbackRate === 1 ? "1×" : `${playbackRate}×`}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="bg-zinc-950/95 backdrop-blur-xl border-zinc-800 text-white min-w-[150px] p-1">
                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2 py-1.5">Speed</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800 mb-1" />
                {SPEED_OPTIONS.map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={cn(
                      "text-[11px] font-semibold py-2.5 px-3 cursor-pointer rounded-md flex items-center justify-between mb-0.5",
                      playbackRate === rate
                        ? "bg-indigo-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <span>{rate === 1 ? "Normal" : `${rate}×`}</span>
                    {playbackRate === rate && <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quality (only for adaptive streams) */}
            {availableQualities.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 h-8 px-3 bg-white/8 hover:bg-white/15 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all">
                    <Settings className="w-3.5 h-3.5" />
                    {qualityLevel}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="bg-zinc-950/95 backdrop-blur-xl border-zinc-800 text-white min-w-[140px] p-1">
                  <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2 py-1.5">Quality</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800 mb-1" />
                  {availableQualities.map((q) => (
                    <DropdownMenuItem
                      key={q}
                      onClick={() => changeQuality(q)}
                      className={cn(
                        "text-[11px] font-semibold py-2.5 px-3 cursor-pointer rounded-md flex items-center justify-between mb-0.5",
                        qualityLevel === q
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      )}
                    >
                      <span>{q === "Auto" ? "Auto (Adaptive)" : q}</span>
                      {qualityLevel === q && <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
