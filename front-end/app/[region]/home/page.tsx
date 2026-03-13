"use client";

import HeroBanner from "@/components/LandingPage/HeroBanner";
import MovieCarousel from "@/components/LandingPage/MovieCarousel";

const SAMPLE_HERO = {
  title: "Stranger Things",
  description:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  backdropUrl:
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
};

const SAMPLE_MOVIES = [
  {
    id: "1",
    title: "Interstellar",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
    rating: "13+",
    duration: "2h 49m",
  },
  {
    id: "2",
    title: "Inception",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    rating: "13+",
    duration: "2h 28m",
  },
  {
    id: "3",
    title: "The Dark Knight",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2037&auto=format&fit=crop",
    rating: "13+",
    duration: "2h 32m",
  },
  {
    id: "4",
    title: "Dune",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2088&auto=format&fit=crop",
    rating: "PG-13",
    duration: "2h 35m",
  },
  {
    id: "5",
    title: "Avatar",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop",
    rating: "13+",
    duration: "2h 42m",
  },
  {
    id: "6",
    title: "The Matrix",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    rating: "R",
    duration: "2h 16m",
  },
  {
    id: "7",
    title: "The Batman",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1974&auto=format&fit=crop",
    rating: "13+",
    duration: "2h 56m",
  },
];

export default function HomePage({ params }: { params: { region: string } }) {
  return (
    <div className="bg-[#0f1014] pb-20">
      <HeroBanner movie={SAMPLE_HERO} />

      <div className="mt-0 relative z-10">
        <MovieCarousel title="Trending Now" movies={SAMPLE_MOVIES} />
        <MovieCarousel
          title="New Releases"
          movies={[...SAMPLE_MOVIES].reverse()}
        />
        <MovieCarousel title="Top Rated" movies={SAMPLE_MOVIES.slice(2, 6)} />
        <MovieCarousel title="Recommended For You" movies={SAMPLE_MOVIES} />
      </div>
    </div>
  );
}
