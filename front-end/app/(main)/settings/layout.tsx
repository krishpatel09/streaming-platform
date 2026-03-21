"use client";

import React from "react";
import {
  CreditCard,
  Lock,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuthStore();
  const pathname = usePathname();

  const settingsOptions = [
    {
      title: "Subscription & Devices",
      subtitle: "Manage Subscription & Devices",
      icon: CreditCard,
      href: "/settings",
    },
    {
      title: "Parental Controls",
      subtitle: "Parental Lock",
      icon: Lock,
      href: "/settings/parental-controls",
    },
    {
      title: "Help & Support",
      subtitle: "Help Centre",
      icon: HelpCircle,
      href: "/settings/help-support",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-8 lg:px-16 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1px_1fr] gap-x-12 gap-y-16 items-start">
          {/* ── LEFT COLUMN (Shared Sidebar) ── */}
          <div className="flex flex-col gap-10 sticky top-8">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Help & Settings
            </h1>

            <div className="space-y-4">
              {settingsOptions.map((option, idx) => {
                const isActive = pathname === option.href;
                return (
                  <Link key={idx} href={option.href}>
                    <div
                      className={`group flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer mb-4 ${
                        isActive
                          ? "bg-white/5 border-white/20 shadow-2x shadow-white/5"
                          : "border-transparent hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-white/5 text-zinc-500"
                          }`}
                        >
                          <option.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-lg font-bold ${isActive ? "text-white" : "text-zinc-300"}`}
                          >
                            {option.title}
                          </span>
                          <span className="text-sm text-zinc-500 font-medium">
                            {option.subtitle}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                          isActive ? "text-white" : "text-zinc-600"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-10">
              <Button
                onClick={logout}
                variant="ghost"
                className="h-12 px-8 bg-zinc-900/50 hover:bg-[#e50914]/10 text-zinc-400 hover:text-[#e50914] font-black text-sm rounded-xl transition-all flex items-center gap-3 active:scale-95 group"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Log Out</span>
              </Button>
            </div>
          </div>

          {/* ── VERTICAL DIVIDER ── */}
          <div className="hidden lg:block w-full h-[600px] bg-linear-to-b from-transparent via-white/10 to-transparent self-center sticky top-8" />

          {/* ── RIGHT COLUMN (Page Content) ── */}
          <div className="pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
