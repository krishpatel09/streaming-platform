"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { MovieCarousel } from "@/components/home/MovieCarousel";
import { Footer } from "@/components/layout/Footer";
import carouselsData from "@/data/carousels.json";

export default function HomePage() {
  return (
    <div className="bg-[#0f1014] text-white overflow-x-hidden">
      <HeroBanner />

      {/* ─── Carousel Content ─── */}
      {/* <div className="relative z-30 -mt-24 pb-32 space-y-12" style={{ overflowY: "visible" }}>
        {carouselsData.map((carousel) => (
          <MovieCarousel
            key={carousel.id}
            title={carousel.title}
            items={carousel.items}
            orientation={carousel.orientation as "vertical" | "horizontal"}
          />
        ))}
      </div>

      <Footer /> */}
    </div>
  );
}
