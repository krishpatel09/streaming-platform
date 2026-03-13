"use client";

import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    rating: string;
    duration: string;
  };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-zinc-900"
    >
      <Image
        src={movie.thumbnailUrl}
        alt={movie.title}
        fill
        className="object-cover transition-opacity duration-300 group-hover:opacity-40"
      />
      
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/80 to-transparent">
        <h3 className="text-white font-bold text-sm mb-1 drop-shadow-md">{movie.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
          <span className="border border-gray-500 px-1 rounded">{movie.rating}</span>
          <span>{movie.duration}</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-black p-1.5 rounded-full hover:bg-white/90 transition-colors">
            <Play className="w-4 h-4 fill-current" />
          </button>
          <button className="bg-white/20 text-white p-1.5 rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors border border-white/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
