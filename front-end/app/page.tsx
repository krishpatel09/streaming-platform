"use client";

import { AnytimeAnywhere } from "@/components/home/AnytimeAnywhere";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MovieCarousel } from "@/components/home/MovieCarousel";
import { PopularMovies } from "@/components/home/PopularMovies";
import { PricingPlans } from "@/components/home/PricingPlans";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import carouselsData from "@/data/carousels.json";

export default function HomePage() {
  return (
    <div className="bg-[#0f1014] text-white overflow-x-hidden min-h-screen">
      <Navbar />
      <HeroBanner />

      <AnytimeAnywhere />

      <div className="relative z-30 space-y-24 pb-32">
        <MovieCarousel
          title="Enjoy on your TV"
          items={carouselsData[0].items}
        />

        <PopularMovies />

        <Testimonials />

        <PricingPlans />
      </div>

      <Footer />
    </div>
  );
}
