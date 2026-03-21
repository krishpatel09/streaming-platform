"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  ChevronRight,
  Smartphone,
  Monitor,
  Tv,
  Zap,
  ShieldCheck,
  Infinity,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "super",
    name: "Super",
    price: "349",
    period: "3 mo",
    description: "Perfect for fans who want amazing quality and variety.",
    features: [
      { icon: Tv, label: "All content (Movies, Sports, TV)" },
      { icon: Smartphone, label: "Up to 2 devices simultaneously" },
      { icon: Zap, label: "Full HD 1080p Streaming" },
      { icon: ShieldCheck, label: "Ads (Limited to sports)" },
    ],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "699",
    period: "3 mo",
    description: "The ultimate cinematic experience with zero compromises.",
    features: [
      { icon: Infinity, label: "Everything in Super & More" },
      { icon: Monitor, label: "Up to 4 devices simultaneously" },
      { icon: Sparkles, label: "4K UHD + Dolby Vision & Atmos" },
      { icon: ShieldCheck, label: "Zero Ads (Completely Ad-free)" },
    ],
    highlight: true,
  },
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [billingCycle, setBillingCycle] = useState("quarterly");

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* ── Dynamic Decorative Background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse [animation-duration:8s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#ffffff03_0%,transparent_70%)]" />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col relative z-10">
        {/* TOP NAV BAR */}
        <div className="flex items-center justify-between mb-24">
          <Link
            href={`/myspace`}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:rotate-90 transition-all" />
            <span className="text-sm font-bold tracking-tight text-zinc-400 group-hover:text-white">
              Back to Home
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-bold text-zinc-500">
              Already a member?{" "}
              <Link href="#" className="text-white hover:underline">
                Log in
              </Link>
            </span>
            <Button
              variant="ghost"
              className="bg-white/5 hover:bg-white/10 text-white font-black px-6 py-3 rounded-full border border-white/10 backdrop-blur-md transition-all active:scale-95"
            >
              English
            </Button>
          </div>
        </div>

        {/* HERO HEADER */}
        <div className="text-center mb-24">
          <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent">
            Elevate Your <br /> Reality
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto tracking-tight leading-relaxed">
            Unlock the full potential of your streaming experience with our
            high-end, cinematic tiers designed for pure immersion.
          </p>
        </div>

        {/* BILLING TOGGLE (Pill Modern Style) */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 p-1.5 rounded-3xl flex gap-1 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {["Monthly", "Quarterly", "Yearly"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle.toLowerCase())}
                className={cn(
                  "px-10 py-3.5 rounded-2xl text-[15px] font-black transition-all relative flex items-center gap-2",
                  billingCycle === cycle.toLowerCase()
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                <span>{cycle}</span>
                {cycle === "Yearly" && (
                  <span className="ml-1 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    Save 25%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PLAN CARDS (GLASSMORPHISM) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 max-w-5xl mx-auto w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative p-12 rounded-[3rem] border-2 transition-all cursor-pointer group flex flex-col gap-10 backdrop-blur-[40px] hover:translate-y-[-8px]",
                selectedPlan === plan.id
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] ring-1 ring-white/20"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20",
              )}
            >
              {/* Selected Indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-300">
                  <Check className="w-5 h-5 text-white stroke-[4]" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                      plan.id === "premium"
                        ? "bg-fuchsia-600/20 text-fuchsia-400"
                        : "bg-indigo-600/20 text-indigo-400",
                    )}
                  >
                    {plan.id === "premium" ? (
                      <Sparkles className="w-6 h-6" />
                    ) : (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-black uppercase tracking-[0.2em]",
                      plan.id === "premium"
                        ? "text-fuchsia-500"
                        : "text-indigo-500",
                    )}
                  >
                    {plan.id === "premium" ? "Recommended" : "Essential"}
                  </span>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter">
                  {plan.name}
                </h3>
                <p className="text-zinc-400 font-medium leading-relaxed max-w-xs">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white group-hover:scale-[1.02] transition-transform">
                  ₹{plan.price}
                </span>
                <span className="text-zinc-500 text-lg font-bold uppercase tracking-widest">
                  / {plan.period}
                </span>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                      <feature.icon className="w-4 h-4 text-zinc-400 group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-zinc-300 font-semibold group-hover/item:text-white transition-colors">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FINAL CTA & PRICE DETAIL */}
        <div className="flex flex-col items-center gap-12 mb-32 group">
          <div className="text-center space-y-2">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em]">
              Total Amount Due
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                ₹245.29
              </span>
              <span className="text-zinc-600 line-through text-2xl font-bold italic">
                ₹349
              </span>
              <div className="bg-green-500/10 text-green-500/80 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">
                Limited Deal
              </div>
            </div>
          </div>

          <Button className="h-20 px-24 bg-linear-to-r from-indigo-600 via-indigo-500 to-fuchsia-600 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] text-white font-black text-2xl rounded-full flex items-center gap-6 transition-all active:scale-[0.96] border-t border-white/20 transform group-hover:scale-105">
            <span>Initiate Upgrade</span>
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-zinc-500 text-xs font-medium max-w-xs text-center leading-loose">
            Secure checkout with end-to-end encryption. <br /> Cancel anytime
            through your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
