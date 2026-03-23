"use client";

import * as React from "react";
import { Film, Tv, Play, ArrowRight, Upload, ListVideo } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContentOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Content Library</h1>
          <p className="text-zinc-500">Manage your movies, TV shows, and individual episodes.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
          <Upload className="mr-2 h-4 w-4" /> Quick Upload
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Movies", count: "842 Movies", desc: "Manage feature films and trailers.", icon: Film, color: "text-indigo-600", bg: "bg-indigo-50", href: "/admin/content/movies" },
          { title: "TV Series", count: "156 Shows", desc: "Organize series and seasons.", icon: Tv, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/content/series" },
          { title: "Episodes", count: "3,420 Eps", desc: "Upload and link individual episodes.", icon: Play, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/content/episodes" },
        ].map((item, i) => (
          <Card key={i} className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-zinc-900">{item.title}</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium">{item.count}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
              <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
                <Link href={item.href}>
                  Manage {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex items-center justify-between shadow-sm border-l-4 border-l-indigo-600">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-zinc-50">
            <ListVideo className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Batch Processing</h3>
            <p className="text-sm text-zinc-500 font-medium">12 files currently being transcoded to 4K / HDR.</p>
          </div>
        </div>
        <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold">
          View Queue
        </Button>
      </div>
    </div>
  );
}
