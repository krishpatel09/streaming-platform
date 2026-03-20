"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MovieCard } from "./MovieCard";

interface CarouselItem {
  title: string;
  image: string;
  isNewEpisode?: boolean;
  duration?: string;
  description?: string;
}

interface MovieCarouselProps {
  title: string;
  items: CarouselItem[];
  orientation?: "vertical" | "horizontal";
}

export function MovieCarousel({
  title,
  items,
  orientation = "horizontal",
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isRowHovered, setIsRowHovered] = useState(false);

  const CARD_WIDTH = orientation === "horizontal" ? 280 : 180;
  const GAP = 12;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -(CARD_WIDTH + GAP) * 2.5,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 400);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: (CARD_WIDTH + GAP) * 2.5,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 400);
  };

  return (
    <div
      className={cn(
        "relative py-1 transition-all duration-300",
        isRowHovered ? "z-50" : "z-10",
      )}
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      {/* ─── Row Header ─── */}
      <div className="flex items-center justify-between mb-4 pl-8 lg:pl-16 pr-4 lg:pr-8 overflow-visible">
        <div className="flex items-center gap-3">
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
          <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
        </div>

        <button
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-500 hover:text-white transition-all duration-500 group/all cursor-pointer",
            isRowHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none",
          )}
        >
          View all
          <div className="w-5 h-5 flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/5 group-hover/all:bg-blue-500 group-hover/all:border-blue-500 transition-all">
            <ChevronRight className="w-3.5 h-3.5 group-hover/all:text-white" />
          </div>
        </button>
      </div>

      {/* ─── Scroll Container ─── */}
      <div className="relative overflow-visible">
        {/* Navigation Arrows (Minimalist Style) */}
        <button
          onClick={scrollLeft}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-100 w-16 flex items-center justify-center bg-linear-to-r from-black/60 to-transparent text-white transition-all duration-300 transform group/nav",
            canScrollLeft && isRowHovered
              ? "opacity-100 cursor-pointer"
              : "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform group-hover/nav:scale-125" />
        </button>

        <button
          onClick={scrollRight}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-100 w-16 flex items-center justify-center bg-linear-to-l from-black/60 to-transparent text-white transition-all duration-300 transform group/nav",
            canScrollRight && isRowHovered
              ? "opacity-100 cursor-pointer"
              : "opacity-0 pointer-events-none",
          )}
        >
          <ChevronRight className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform group-hover/nav:scale-125" />
        </button>

        {/* Scroll Track (Overflow hidden to only allow arrow scrolling) */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex scrollbar-hide pl-8 lg:pl-16 pr-0"
          style={{
            gap: `${GAP}px`,
            overflowX: "hidden",
            overflowY: "visible",
            /* Significantly larger buffer for the scaled MovieCard hover enlargement */
            paddingTop: "120px",
            paddingBottom: "250px",
            marginTop: "-120px",
            marginBottom: "-250px",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="shrink-0"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <MovieCard
                {...item}
                orientation={orientation}
                number={index + 1}
                showNumber={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
