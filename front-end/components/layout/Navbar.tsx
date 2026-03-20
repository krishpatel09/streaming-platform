"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const { setOpen, isAuthenticated, logout, user } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 w-full z-100 bg-linear-to-b from-black/80 to-transparent px-8 lg:px-16 py-4 flex items-center justify-between backdrop-blur-[2px]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 group">
        <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
          MOVI<span className="text-[#e50914] not-italic">X</span>.
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-10">
        <Link
          href="#"
          className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
        >
          About
        </Link>
        <Link
          href="#"
          className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
        >
          Booking
        </Link>
        <Link
          href="#"
          className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
        >
          Price
        </Link>
        <Link
          href="#"
          className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="text-zinc-300 hover:text-white transition-colors cursor-pointer">
          <Search className="w-5 h-5" />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-zinc-100 hidden sm:inline-block">
              {user?.email}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              className="h-10 px-6 border-white/20 text-white font-bold hover:bg-white/10 rounded-md"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link
            href="/login"
            className="h-10 px-8 bg-[#e50914] hover:bg-[#ff0f1e] text-white font-black text-sm rounded-md transition-all shadow-xl shadow-[#e50914]/20 active:scale-95 flex items-center justify-center no-underline"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
