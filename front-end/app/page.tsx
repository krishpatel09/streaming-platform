"use client";

import { useAuthStore } from "@/stores/authStore";
import LandingPage from "./landing";
import UnifiedHomePage from "./(main)/home/page";
import MainLayout from "./(main)/layout";

export default function RootPage() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0f1014] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <MainLayout>
        <UnifiedHomePage />
      </MainLayout>
    );
  }

  return <LandingPage />;
}
