"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  Play,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "Jan", views: 4000, users: 2400 },
  { name: "Feb", views: 3000, users: 1398 },
  { name: "Mar", views: 2000, users: 9800 },
  { name: "Apr", views: 2780, users: 3908 },
  { name: "May", views: 1890, users: 4800 },
  { name: "Jun", views: 2390, users: 3800 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Platform Analytics</h1>
        <p className="text-zinc-500">Real-time performance metrics and user insights.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Views", value: "2.4M", change: "+12.5%", trend: "up", icon: Play, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Active Users", value: "84.2k", change: "+8.2%", trend: "up", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Watch Time", value: "124k h", change: "-2.4%", trend: "down", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Growth", value: "+24%", change: "+4.1%", trend: "up", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{stat.title}</p>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h2 className="text-2xl font-bold text-zinc-900">{stat.value}</h2>
                <div className={`flex items-center text-xs font-bold ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"} bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900">Views Over Time</CardTitle>
            <CardDescription>Monthly view progression for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#888888" tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#4f46e5' }}
                  />
                  <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900">User Retention</CardTitle>
            <CardDescription>Active users returning to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
