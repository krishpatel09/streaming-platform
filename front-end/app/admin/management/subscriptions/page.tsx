"use client";

import * as React from "react";
import { CreditCard, DollarSign, ArrowUpRight, Plus, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockPlans = [
  { id: "p1", name: "Basic", price: "$9.99/mo", subscribers: "4.2k", status: "Active", revenue: "$41,958" },
  { id: "p2", name: "Premium (4K)", price: "$19.99/mo", subscribers: "8.5k", status: "Active", revenue: "$169,915" },
  { id: "p3", name: "Family Plan", price: "$29.99/mo", subscribers: "1.2k", status: "Active", revenue: "$35,988" },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Subscription Plans</h1>
          <p className="text-zinc-500 font-medium">Manage pricing tiers, features, and billing cycles.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Monthly Revenue", val: "$247,861", change: "+14%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Subs", val: "13,900", change: "+5.2%", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Free Trials", val: "1,420", change: "-2.1%", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-zinc-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-2">{stat.val}</div>
              <p className={`text-xs font-bold flex items-center mt-1 ${stat.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                <ArrowUpRight className="h-3 w-3 mr-1" /> {stat.change} <span className="text-zinc-400 font-medium ml-1">this month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Plan Name</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Pricing</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Subscribers</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Est. Revenue</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPlans.map((plan) => (
              <TableRow key={plan.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-bold text-zinc-900">{plan.name}</TableCell>
                <TableCell className="text-zinc-600 font-medium">{plan.price}</TableCell>
                <TableCell className="text-zinc-900 font-bold">{plan.subscribers}</TableCell>
                <TableCell className="text-indigo-600 font-bold">{plan.revenue}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold uppercase text-[10px]">
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold">
                    Edit Plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
