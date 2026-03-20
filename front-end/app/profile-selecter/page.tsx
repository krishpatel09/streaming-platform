"use client";

import { ProfileSelection } from "@/components/auth/ProfileSelection";

export default function ProfileSelecterPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0f1014] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[180px] -mr-96 -mt-96" />
      </div>
      
      <ProfileSelection />
    </div>
  );
}
