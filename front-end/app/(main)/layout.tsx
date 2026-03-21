"use client";

import { useAuthStore } from "@/stores/authStore";
import { Navbar } from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1014] text-white">
      {isAuthenticated && <Sidebar />}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isAuthenticated ? "pl-16" : "pl-0",
        )}
      >
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
