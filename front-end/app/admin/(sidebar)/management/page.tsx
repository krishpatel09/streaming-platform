"use client";

import * as React from "react";
import { Users, CreditCard, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ManagementOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Management Center</h1>
        <p className="text-zinc-500">Manage users, roles, and platform subscriptions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-zinc-900">User Management</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">12.4k active users</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500 leading-relaxed">
              View user profiles, manage account status, assign administrative roles, and monitor engagement sessions.
            </p>
            <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
              <Link href="/admin/management/users">
                Open User Manager <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-zinc-900">Subscriptions</CardTitle>
                <CardDescription className="text-zinc-500 font-medium">Plans & Revenue</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-500 leading-relaxed">
              Configure subscription tiers, handle billing disputes, and view recurring revenue metrics.
            </p>
            <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
              <Link href="/admin/management/subscriptions">
                Manage Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Security Audits", desc: "Recent admin logs.", color: "text-amber-600" },
          { icon: UserPlus, title: "Invite Admins", desc: "Grant permissions.", color: "text-indigo-600" },
          { icon: ShieldCheck, title: "Role Access", desc: "Customize levels.", color: "text-purple-600" },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col items-center text-center space-y-3 shadow-sm hover:border-zinc-300 transition-colors">
            <div className={`h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-zinc-900">{item.title}</h3>
            <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
