"use client";

import * as React from "react";
import { 
  Settings, 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Shield, 
  Save,
  Palette
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Platform Settings</h1>
        <p className="text-zinc-500 font-medium">Configure global platform behavior and admin preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-zinc-200 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="border-b border-zinc-50">
              <CardTitle className="text-zinc-900 font-bold">General Information</CardTitle>
              <CardDescription>Update your workspace name and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-zinc-700 font-bold uppercase text-[10px] tracking-widest">Site Name</Label>
                  <Input id="siteName" defaultValue="StreamHub" className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="text-zinc-700 font-bold uppercase text-[10px] tracking-widest">Support Email</Label>
                  <Input id="supportEmail" defaultValue="support@streamhub.com" className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900 text-sm">Public Registration</h4>
                    <p className="text-xs text-zinc-500 font-medium">Allow anyone to create an account on the platform.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900 text-sm">Maintenance Mode</h4>
                    <p className="text-xs text-zinc-500 font-medium">Disable public access during updates.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-zinc-900 font-bold">Theme & Branding</CardTitle>
              <CardDescription>Customize the look and feel of your admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Default Light", active: true, color: "bg-zinc-50 border-zinc-200" },
                  { name: "Ocean Blue", active: false, color: "bg-blue-50 border-blue-200" },
                  { name: "Forest Green", active: false, color: "bg-emerald-50 border-emerald-200" },
                ].map((theme, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${theme.active ? "border-indigo-600 shadow-md ring-2 ring-indigo-50" : "border-zinc-100 hover:border-zinc-300"}`}>
                    <div className={`h-12 w-full rounded-lg mb-3 ${theme.color}`} />
                    <p className="text-xs font-bold text-center text-zinc-900">{theme.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
        <Button variant="outline" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold h-11 px-6">Discard Changes</Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold h-11 px-8">
          <Save className="mr-2 h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
