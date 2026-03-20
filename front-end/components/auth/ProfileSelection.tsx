"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { userService } from "@/serivces/user.service";
import { useProfileStore } from "@/stores/profileStore";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import { toast } from "sonner";

export function ProfileSelection() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentProfile } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await userService.getProfiles();
        setProfiles(data);
      } catch (error) {
        toast.error("Failed to load profiles");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push(`/mypage`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Who's watching?
        </h1>
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <Edit2 className="w-5 h-5" />
          <span className="text-lg font-bold">Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleProfileSelect(profile)}
            className="flex flex-col items-center gap-4 group cursor-pointer"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-white group-hover:scale-105 transition-all duration-300 shadow-2xl">
              <Image
                src={profile.avatar_url || "/default-avatar.png"}
                alt={profile.profile_name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-zinc-400 group-hover:text-white text-lg font-bold capitalize transition-colors">
              {profile.profile_name}
            </span>
          </div>
        ))}

        {profiles.length < 5 && (
          <div className="flex flex-col items-center gap-4 group cursor-pointer">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-900/60 flex items-center justify-center border-4 border-dashed border-zinc-800 group-hover:border-zinc-500 group-hover:bg-zinc-800 transition-all duration-300">
              <Plus className="w-12 h-12 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
            </div>
            <span className="text-zinc-500 group-hover:text-zinc-300 text-lg font-bold transition-colors">
              Add
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
