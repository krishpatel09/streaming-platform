import { create } from "zustand";

interface AuthState {
  isOpen: boolean;
  step: "identify" | "verify" | "success";
  mode: "login" | "register";
  email: string;
  username: string;
  setOpen: (open: boolean) => void;
  setStep: (step: "identify" | "verify" | "success") => void;
  setMode: (mode: "login" | "register") => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isOpen: false,
  step: "identify",
  mode: "login",
  email: "",
  username: "",
  setOpen: (open) => set({ isOpen: open }),
  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  reset: () => set({ isOpen: false, step: "identify", mode: "login", email: "", username: "" }),
}));
