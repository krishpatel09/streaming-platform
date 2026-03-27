"use client";

import * as React from "react";
import { 
  Play, 
  Settings, 
  Users, 
  Activity, 
  AlertCircle, 
  Plus,
  Video,
  Monitor,
  Radio
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const mockLiveStreams = [
  { id: 1, title: "Summer Music Festival", viewers: "4.2k", status: "Live", duration: "02:45:12", quality: "4K", thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop" },
  { id: 2, title: "Gaming Tournament Final", viewers: "12.5k", status: "Live", duration: "01:12:05", quality: "1080p", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop" },
  { id: 3, title: "Morning Talk Show", viewers: "850", status: "Scheduled", duration: "00:00:00", quality: "1080p", thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop" },
];

export default function LiveStreamingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Live Streaming</h1>
          <p className="text-zinc-500 font-medium">Manage active broadcasts and scheduled live events.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> New Stream
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockLiveStreams.map((stream) => (
          <Card key={stream.id} className="bg-white border-zinc-200 shadow-sm hover:shadow-lg transition-all group rounded-2xl overflow-hidden">
            <div className="relative aspect-video">
              <Image src={stream.thumbnail} alt={stream.title} fill className="object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={`${stream.status === "Live" ? "bg-red-600 animate-pulse" : "bg-zinc-600"} text-white border-none font-bold uppercase`}>
                  {stream.status}
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-none backdrop-blur-md">
                  {stream.quality}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md font-bold">
                {stream.duration}
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{stream.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-zinc-500 font-medium text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{stream.viewers} watching</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-9">
                  Monitor
                </Button>
                <Button variant="outline" className="flex-1 border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-9">
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 font-bold">Inbound Streams</CardTitle>
            <CardDescription>RTMP/SRT servers health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "US-East-1 (Primary)", status: "Active", bitrate: "8.5 Mbps", delay: "42ms", icon: Video, color: "text-emerald-500" },
              { name: "EU-West-1 (Backup)", status: "Standby", bitrate: "0 Mbps", delay: "124ms", icon: Radio, color: "text-zinc-400" },
            ].map((server, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${server.color}`}>
                    <server.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{server.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">{server.bitrate} • {server.delay} latency</p>
                  </div>
                </div>
                <Badge className={server.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-zinc-100 text-zinc-500 border-zinc-200"}>
                  {server.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 font-bold">Stream Health</CardTitle>
            <CardDescription>Real-time packet loss and encoding metrics</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[180px]">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border-4 border-emerald-100">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-zinc-900">Excellent</h4>
              <p className="text-xs text-zinc-500 font-medium">All systems encoding normally at 4K @ 60fps</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
