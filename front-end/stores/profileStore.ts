import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types';

interface ProfileState {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      clearProfile: () => set({ currentProfile: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
