import { create } from "zustand";

interface AuthState {
  isOpen: boolean;
  step: "identify" | "verify" | "success";
  email: string;
  setOpen: (open: boolean) => void;
  setStep: (step: "identify" | "verify" | "success") => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isOpen: false,
  step: "identify",
  email: "",
  setOpen: (open) => set({ isOpen: open }),
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  reset: () => set({ isOpen: false, step: "identify", email: "" }),
}));
