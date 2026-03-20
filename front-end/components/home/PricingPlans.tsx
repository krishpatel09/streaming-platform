"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const plans = [
  { id: "basic", name: "Basic", price: "$10.99", quality: "Good", resolution: "480p", tv: true, laptop: false },
  { id: "standard", name: "Standard", price: "$15.99", quality: "Better", resolution: "1080p", tv: true, laptop: true },
  { id: "premium", name: "Premium", price: "$20.99", quality: "Best", resolution: "4K+HDR", tv: true, laptop: true },
];

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState("premium");

  return (
    <section className="py-32 bg-[#0f1014]">
      <div className="max-w-5xl mx-auto px-8 lg:px-16 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">
            Select your plan
          </h2>
          <p className="text-zinc-500 text-lg">Choose the plan that's right for you.</p>
        </div>

        {/* Plan Selector Buttons */}
        <div className="flex items-center gap-4 mb-16">
            {plans.map((plan) => (
                <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                        "h-12 px-10 rounded-sm font-black text-xs uppercase tracking-widest transition-all cursor-pointer",
                        selectedPlan === plan.id 
                            ? "bg-[#e50914] text-white shadow-xl shadow-[#e50914]/20 outline-none" 
                            : "bg-white/5 text-zinc-500 hover:text-zinc-300 border border-white/5"
                    )}
                >
                    {plan.name}
                </button>
            ))}
        </div>

        {/* Comparison Table */}
        <div className="w-full space-y-0 text-zinc-400">
            {/* Price */}
            <div className="flex items-center justify-between py-6 border-b border-zinc-800/50">
                <span className="text-sm font-bold uppercase tracking-widest">Monthly price</span>
                <div className="flex gap-12 sm:gap-24">
                    {plans.map(p => (
                        <span key={p.id} className={cn("w-16 text-center font-black", selectedPlan === p.id && "text-white")}>{p.price}</span>
                    ))}
                </div>
            </div>
            {/* Quality */}
            <div className="flex items-center justify-between py-6 border-b border-zinc-800/50">
                <span className="text-sm font-bold uppercase tracking-widest">Video quality</span>
                <div className="flex gap-12 sm:gap-24">
                    {plans.map(p => (
                        <span key={p.id} className={cn("w-16 text-center font-black", selectedPlan === p.id && "text-white")}>{p.quality}</span>
                    ))}
                </div>
            </div>
            {/* Resolution */}
            <div className="flex items-center justify-between py-6 border-b border-zinc-800/50">
                <span className="text-sm font-bold uppercase tracking-widest">Resolution</span>
                <div className="flex gap-12 sm:gap-24">
                    {plans.map(p => (
                        <span key={p.id} className={cn("w-16 text-center font-black", selectedPlan === p.id && "text-white")}>{p.resolution}</span>
                    ))}
                </div>
            </div>
            {/* Watch on TV */}
            <div className="flex items-center justify-between py-6">
                <div className="max-w-[150px] sm:max-w-none">
                    <span className="text-sm font-bold uppercase tracking-widest">Watch on your computer, TV, Tablet & phone</span>
                </div>
                <div className="flex gap-12 sm:gap-24">
                    {plans.map(p => (
                        <div key={p.id} className="w-16 flex justify-center">
                            {p.tv && <Check className={cn("w-5 h-5", selectedPlan === p.id ? "text-white" : "text-zinc-600")} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="mt-16 w-full text-center">
            <Button className="h-16 px-16 bg-[#e50914] hover:bg-[#ff0f1e] text-white font-black text-xl rounded-md transition-all shadow-2xl shadow-[#e50914]/20 active:scale-95 uppercase">
                Get Started
            </Button>
        </div>
      </div>
    </section>
  );
}
