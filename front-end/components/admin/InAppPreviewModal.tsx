"use client";

import React, { useState } from "react";
import {
  X,
  Film,
  Calendar,
  Clock,
  Users,
  Languages,
  Star,
  Clapperboard,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resolveStorageUrl } from "@/utils/storage";
import { ShakaPlayer } from "@/components/ui/shaka-player";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InAppPreviewModalProps {
  movie: any | null;
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = "detail" | "trailer" | "movie";

export default function InAppPreviewModal({
  movie,
  isOpen,
  onClose,
}: InAppPreviewModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("detail");

  if (!movie) return null;

  const bannerUrl = resolveStorageUrl(movie.banner_url);
  const posterUrl = resolveStorageUrl(movie.poster_url);
  const hlsUrl = movie.streaming?.hls_master_url || "";
  const trailerUrl = movie.trailer_url
    ? resolveStorageUrl(movie.trailer_url)
    : "";

  const activeVideoUrl =
    viewMode === "movie" ? hlsUrl : viewMode === "trailer" ? trailerUrl : "";

  const isPlayerMode = viewMode === "movie" || viewMode === "trailer";

  const year = movie.release_date
    ? (() => {
        const d = new Date(movie.release_date);
        return isNaN(d.getTime()) ? "—" : d.getFullYear();
      })()
    : "—";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-full h-screen p-0 border-none bg-zinc-950 overflow-hidden text-white sm:rounded-none">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Content Preview: {movie.title?.default}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Viewing movie details as they appear in the app.
          </DialogDescription>
        </DialogHeader>

        {/* ── Cinematic Blurred Backdrop ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl || posterUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-3xl"
          />
          <div className="absolute inset-0 bg-linear-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950/50 via-transparent to-transparent" />
        </div>

        {/* ── Floating Header ── */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-linear-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-lg font-black italic tracking-tighter uppercase">
              STUDIO<span className="text-indigo-400">PREVIEW</span>
            </span>

            {isPlayerMode && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setViewMode("detail")}
                className="ml-4 flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5 bg-white/5 hover:bg-white/10"
              >
                <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                Back to Details
              </motion.button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* ── Main Content ── */}
        <ScrollArea className="h-full w-full z-10">
          <div className="min-h-screen flex flex-col">
            <AnimatePresence mode="wait">
              {/* ═══════════ PLAYER MODE ═══════════ */}
              {isPlayerMode ? (
                <motion.div
                  key="player"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col h-screen"
                >
                  {/* Player fills most of screen */}
                  <div className="flex-1 flex flex-col justify-center px-0 pt-20 pb-0">
                    <ShakaPlayer
                      key={viewMode} // remounts on source change
                      src={activeVideoUrl}
                      poster={bannerUrl}
                      autoPlay
                      className="w-full h-full rounded-none"
                    />
                  </div>

                  {/* Source Switcher strip below player */}
                  <div className="shrink-0 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        {viewMode === "trailer" ? (
                          <Clapperboard className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Film className="w-4 h-4 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-white">
                          {viewMode === "trailer"
                            ? "Trailer Preview"
                            : "Main Feature"}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {movie.title?.default}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {trailerUrl && (
                        <button
                          onClick={() => setViewMode("trailer")}
                          className={cn(
                            "px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                            viewMode === "trailer"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600",
                          )}
                        >
                          Trailer
                        </button>
                      )}
                      {hlsUrl && (
                        <button
                          onClick={() => setViewMode("movie")}
                          className={cn(
                            "px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                            viewMode === "movie"
                              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                              : "text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600",
                          )}
                        >
                          Main Movie
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ═══════════ DETAIL MODE ═══════════ */
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="container max-w-7xl mx-auto pt-28 pb-20 px-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* ── Left: Media Stage ── */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* ── Movie Player ── */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <Film className="w-4 h-4 text-indigo-400" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                            Movie
                          </span>
                          <div className="flex-1 h-px bg-indigo-500/20" />
                        </div>
                        <div className="rounded-2xl overflow-hidden ring-1 ring-indigo-500/20 shadow-[0_12px_40px_-12px_rgba(99,102,241,0.3)]">
                          {hlsUrl ? (
                            <ShakaPlayer
                              src={hlsUrl}
                              poster={bannerUrl || posterUrl}
                              autoPlay={false}
                              className="w-full rounded-none"
                            />
                          ) : (
                            <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center">
                              {(bannerUrl || posterUrl) && (
                                <img
                                  src={bannerUrl || posterUrl}
                                  alt=""
                                  aria-hidden
                                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
                                />
                              )}
                              <div className="relative z-10 text-center space-y-2 px-6">
                                <p className="text-zinc-300 font-black text-sm uppercase tracking-widest">
                                  Stream Not Ready
                                </p>
                                <p className="text-zinc-500 text-xs">
                                  HLS stream not configured — video may still be processing or transcoding hasn&apos;t been triggered.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Trailer Player ── */}
                      {trailerUrl && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <Clapperboard className="w-4 h-4 text-amber-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                              Official Trailer
                            </span>
                            <div className="flex-1 h-px bg-amber-500/20" />
                          </div>
                          <div className="rounded-2xl overflow-hidden ring-1 ring-amber-500/20 shadow-[0_12px_40px_-12px_rgba(245,158,11,0.25)]">
                            <ShakaPlayer
                              src={trailerUrl}
                              autoPlay={false}
                              className="w-full rounded-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Right: Metadata ── */}
                    <div className="lg:col-span-5 space-y-8 pt-2">
                      {/* Badges */}
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black tracking-widest text-[10px] uppercase px-3 py-1">
                          {movie.status === "published" ? "● Live" : "● Draft"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-zinc-400 border-zinc-700 text-[10px] uppercase font-bold"
                        >
                          {movie.type || "Movie"}
                        </Badge>
                        {movie.age_rating && (
                          <Badge
                            variant="outline"
                            className="text-zinc-400 border-zinc-700 text-[10px] font-black"
                          >
                            {movie.age_rating}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <h1 className="text-5xl xl:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
                          {movie.title?.default}
                        </h1>
                      </div>

                      {/* Specs */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-white">{year}</span>
                        </span>
                        <span className="w-px h-4 bg-zinc-700" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-white">
                            {movie.duration_minutes || movie.duration || "—"}m
                          </span>
                        </span>
                        <span className="w-px h-4 bg-zinc-700" />
                        <span className="flex items-center gap-1.5">
                          <Languages className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-white">Multi Audio</span>
                        </span>
                      </div>

                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre: string) => (
                            <span
                              key={genre}
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-zinc-400 text-base leading-relaxed">
                        {movie.description}
                      </p>

                      {/* Cast */}
                      {movie.cast && movie.cast.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              Cast & Crew
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {movie.cast
                              .slice(0, 6)
                              .map((item: any, i: number) => (
                                <div
                                  key={item.person_id || i}
                                  className="flex items-center justify-between"
                                >
                                  <div>
                                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight">
                                      {item.name}
                                    </p>
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold">
                                      {item.role}
                                    </p>
                                  </div>
                                  {item.character && (
                                    <span className="text-[11px] text-zinc-600 italic">
                                      as {item.character}
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Technical */}
                      <div className="grid grid-cols-2 gap-3 pt-6">
                        <div className="p-4 bg-white/3 rounded-xl border border-white/5 space-y-1">
                          <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">
                            Audio
                          </p>
                          <p className="text-xs font-bold text-white uppercase">
                            {movie.languages?.join(", ") || "English"}
                          </p>
                        </div>
                        <div className="p-4 bg-white/3 rounded-xl border border-white/5 space-y-1">
                          <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">
                            Access Plan
                          </p>
                          <p className="text-xs font-bold text-white uppercase">
                            {movie.availability?.plan_required || "Free"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
