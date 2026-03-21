"use client";

import React from "react";
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpSupportPage() {
  const commonTopics = [
    { title: "Subscription & Billing", icon: FileText },
    { title: "Watching on Devices", icon: HelpCircle },
    { title: "Content & Features", icon: FileText },
    { title: "Account Settings", icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white tracking-tight leading-none">
          Help & Support
        </h2>
        <p className="text-zinc-500 font-bold text-lg">
          Get help with your subscription or report an issue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {/* Help Center Search Mockup */}
        <div className="p-8 rounded-3xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 col-span-1 md:col-span-2 space-y-4">
          <h3 className="text-xl font-black text-white">How can we help?</h3>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search help topics..." 
              className="w-full h-12 bg-white/10 border border-white/10 rounded-xl px-4 text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500/50 transition-all"
            />
            <Button className="absolute right-1 top-1 h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Support Options */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Live Chat</h4>
            <p className="text-sm text-zinc-500">Available 24/7 for instant support</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Browse FAQs</h4>
            <p className="text-sm text-zinc-500">Find answers to common questions</p>
          </div>
        </div>

        {/* Common Topics List */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-white pt-4">Common Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <topic.icon className="w-4 h-4 text-zinc-500" />
                  <span className="font-bold text-zinc-300">{topic.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
