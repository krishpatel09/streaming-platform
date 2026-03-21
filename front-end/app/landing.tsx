"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PricingPlans } from "@/components/home/PricingPlans";
import { PopularMovies } from "@/components/home/PopularMovies";
import { AnytimeAnywhere } from "@/components/home/AnytimeAnywhere";
import { Testimonials } from "@/components/home/Testimonials";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1014] text-white">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <PopularMovies />
        <AnytimeAnywhere />
        <PricingPlans />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
