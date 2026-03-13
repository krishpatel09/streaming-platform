"use client";

import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  movie: {
    title: string;
    description: string;
    backdropUrl: string;
  };
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#0f1014] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0f1014] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 pt-20">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 max-w-2xl drop-shadow-2xl">
          {movie.title}
        </h1>
        <p className="text-gray-200 text-lg md:text-xl max-w-xl mb-8 line-clamp-3">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
            <Play className="w-5 h-5 mr-2 fill-current" />
            Watch Now
          </Button>
          <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-8">
            <Info className="w-5 h-5 mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
