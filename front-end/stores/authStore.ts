import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User, Profile, AuthTokens } from "@/types";

interface AuthState {
  user: User | null;
  activeProfile: Profile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // UI State
  isOpen: boolean;
  step: "identify" | "verify" | "success";
  identifier: string;
  identifierType: "email" | "phone" | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setActiveProfile: (profile: Profile) => void;
  setTokens: (tokens: AuthTokens) => void;
  setAuth: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (partial: Partial<User>) => void;
  // UI Actions
  setOpen: (open: boolean) => void;
  setStep: (step: AuthState["step"]) => void;
  setIdentifier: (
    identifier: string,
    type: AuthState["identifierType"],
  ) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        activeProfile: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isOpen: false,
        step: "identify",
        identifier: "",
        identifierType: null,

        setUser: (user) => {
          set((state) => ({
            ...state,
            user,
            isAuthenticated: true,
            error: null,
          }));
          if (typeof window !== "undefined") {
            document.cookie = "is-auth=true; path=/; max-age=604800";
          }
        },

        setActiveProfile: (profile) =>
          set((state) => ({
            ...state,
            activeProfile: profile,
          })),

        setTokens: (tokens) =>
          set((state) => ({
            ...state,
            tokens,
          })),

        setAuth: (user, tokens) => {
          set((state) => ({
            ...state,
            user,
            tokens,
            isAuthenticated: true,
            error: null,
          }));
          if (typeof window !== "undefined") {
            document.cookie = "is-auth=true; path=/; max-age=604800";
          }
        },

        logout: () => {
          set({
            user: null,
            activeProfile: null,
            tokens: null,
            isAuthenticated: false,
            isOpen: false,
            step: "identify",
            identifier: "",
            identifierType: null,
          });
          if (typeof window !== "undefined") {
            document.cookie = "is-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        },

        setLoading: (loading) =>
          set((state) => ({
            ...state,
            isLoading: loading,
          })),

        setError: (error) =>
          set((state) => ({
            ...state,
            error,
          })),

        updateUser: (partial) =>
          set((state) => ({
            ...state,
            user: state.user ? { ...state.user, ...partial } : null,
          })),

        setOpen: (open) =>
          set((state) => ({
            ...state,
            isOpen: open,
          })),

        setStep: (step) =>
          set((state) => ({
            ...state,
            step,
          })),

        setIdentifier: (identifier, type) => {
          console.log(`[Store] Setting Identifier: ${identifier} (${type})`);
          set((state) => ({
            ...state,
            identifier,
            identifierType: type,
          }));
        },

        reset: () => {
          console.log("[Store] Resetting UI state");
          set((state) => ({
            ...state,
            step: "identify",
            identifier: "",
            identifierType: null,
            error: null,
          }));
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          activeProfile: state.activeProfile,
          tokens: state.tokens,
          isAuthenticated: state.isAuthenticated,
          identifier: state.identifier,
          identifierType: state.identifierType,
        }),
      },

    ),
    { name: "AuthStore" },
  ),
);
