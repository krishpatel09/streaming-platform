"use client";

import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IdentifyStep } from "./IdentifyStep";
import { VerifyStep } from "./VerifyStep";
import { SuccessStep } from "./SuccessStep";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AuthDialog() {
  const { isOpen, setOpen, step, reset } = useAuthStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(reset, 200);
    }
    setOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-[850px] p-0 overflow-hidden bg-[#0f1014] border-white/5 shadow-[0_0_120px_rgba(59,130,246,0.15)] rounded-2xl flex flex-row min-h-[540px]",
          step === "success" && "max-w-[450px] min-h-0"
        )}
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        
        {/* Left Side: Cinematic Branding (Hidden on small screens) */}
        {step !== "success" && (
          <div className="hidden md:flex flex-1 relative bg-zinc-900 border-r border-white/5 overflow-hidden">
             <Image
              src="/auth_banner_cinematic_1773859538709.png"
              alt="StreamVerse"
              fill
              className="object-cover opacity-80"
              priority
            />
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-[#0f1014]" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0f1014] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-12 left-12 right-12 z-10 space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <span className="text-3xl font-black italic tracking-tighter text-blue-500">SV</span>
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                Experience Cinematic <br/> Magic in 4K
              </h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                Join our premium community and stream your favorite movies and shows from any device.
              </p>
            </div>
          </div>
        )}

        {/* Right Side: Auth Steps */}
        <div className={cn(
          "flex-1 relative flex flex-col justify-center",
          step === "success" ? "p-10" : "p-8 md:p-12 lg:p-14"
        )}>
          {/* Subtle background glow for the form side */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-10">
             <span className="text-3xl font-black italic tracking-tighter text-blue-500">SV</span>
          </div>

          <div className="relative z-10">
            {step === "identify" && <IdentifyStep />}
            {step === "verify" && <VerifyStep />}
            {step === "success" && <SuccessStep />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
