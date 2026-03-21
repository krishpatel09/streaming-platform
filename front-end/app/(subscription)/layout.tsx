"use client";

import { Footer } from "@/components/layout/Footer";

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1014] text-white flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
