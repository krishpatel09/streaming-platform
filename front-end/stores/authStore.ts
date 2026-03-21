import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User, Profile, AuthTokens } from "@/types";
import { authService } from "@/serivces/auth.service";

interface AuthState {
  user: User | null;
  activeProfile: Profile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
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
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (partial: Partial<User>) => void;
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
        isInitialized: false,
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

        logout: async () => {
          try {
            await authService.logout();
          } catch (error) {
            console.error("[Store] Logout API failed:", error);
          }

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
            document.cookie =
              "is-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/";
          }
        },

        setLoading: (loading) =>
          set((state) => ({
            ...state,
            isLoading: loading,
          })),

        setInitialized: (initialized) =>
          set((state) => ({
            ...state,
            isInitialized: initialized,
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
        onRehydrateStorage: (state) => {
          console.log("[Store] Hydration starting");
          return (state, error) => {
            if (error) {
              console.error("[Store] Hydration failed:", error);
            } else {
              console.log("[Store] Hydration complete");
              state?.setInitialized(true);
            }
          };
        },
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
