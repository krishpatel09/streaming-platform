"use client";

import * as React from "react";
import { BarChart3, Star, ArrowRight, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EngagementOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Engagement Hub</h1>
        <p className="text-zinc-500">Track user interactions, analyze performance, and moderate community feedback.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-zinc-900">Platform Analytics</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">Real-time usage data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500 leading-relaxed">
              Monitor concurrent viewers, watch time distribution, device usage statistics, and regional performance.
            </p>
            <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
              <Link href="/admin/engagement/analytics">
                View Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-zinc-900">Reviews & Ratings</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">Moderate user feedback</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500 leading-relaxed">
              Read community reviews, moderate reported comments, and analyze average ratings across your library.
            </p>
            <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
              <Link href="/admin/engagement/reviews">
                Moderate Feed <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: TrendingUp, val: "+24%", label: "Retention", color: "text-emerald-500", bg: "bg-emerald-50" },
          { icon: MessageSquare, val: "1,542", label: "Comments", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Star, val: "4.8", label: "Avg. Rating", color: "text-amber-500", bg: "bg-amber-50" },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col items-center text-center space-y-2 shadow-sm border-b-4 border-b-transparent hover:border-b-indigo-500 transition-all">
            <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{item.val}</div>
            <div className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
