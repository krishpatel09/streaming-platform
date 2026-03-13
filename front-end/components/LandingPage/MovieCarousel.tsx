"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  thumbnailUrl: string;
  rating: string;
  duration: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
  return (
    <div className="py-8 px-8 md:px-16 group/carousel">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 transition-colors group-hover/carousel:text-primary">
        {title}
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-6 bg-black/50 text-white border-none hover:bg-black/80" />
        <CarouselNext className="hidden md:flex -right-6 bg-black/50 text-white border-none hover:bg-black/80" />
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
