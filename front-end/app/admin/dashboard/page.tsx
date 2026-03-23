"use client"

import { 
  Users, 
  TrendingUp, 
  Film, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Play
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"
import { 
  mockStats, 
  dailyActiveUsersData, 
  revenueGrowthData, 
  mockMovies 
} from "@/data/mock-data"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="text-zinc-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-semibold transition-all">
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => {
          const icons = [Users, Users, Film, DollarSign];
          const colors = ["text-indigo-600", "text-emerald-600", "text-amber-600", "text-purple-600"];
          const bgs = ["bg-indigo-50", "bg-emerald-50", "bg-amber-50", "bg-purple-50"];
          const Icon = icons[index];
          
          return (
            <Card key={stat.title} className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden border-t-4 border-t-transparent hover:border-t-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${bgs[index]} ${colors[index]}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                <div className="flex items-center pt-2">
                  <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${stat.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {stat.change}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 font-bold">Revenue Growth</CardTitle>
            <CardDescription className="text-zinc-500">Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueGrowthData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-white border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-900 font-bold">Daily Active Users</CardTitle>
            <CardDescription className="text-zinc-500">Number of active users per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyActiveUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                  />
                  <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Trending Content</h2>
          <Button variant="link" className="text-indigo-600 hover:text-indigo-700 font-semibold">View All Content</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {mockMovies.slice(0, 5).map((movie) => (
            <Card key={movie.id} className="group overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
              <div className="relative aspect-video">
                <Image
                  src={movie.thumbnail}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="h-10 w-10 text-white fill-current drop-shadow-lg" />
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg">
                  {movie.rating} ★
                </div>
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-sm font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{movie.title}</CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{movie.category}</span>
                  <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {movie.views} views
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
