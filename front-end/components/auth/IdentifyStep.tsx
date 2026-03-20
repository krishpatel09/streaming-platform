import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

import { ChevronRight, Loader2 } from "lucide-react";
import { authService } from "@/serivces/auth.service";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";

export function IdentifyStep() {
  const { setStep, setIdentifier } = useAuthStore();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("identifier") || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const reverify = searchParams.get("reverify");
    const reason = searchParams.get("reason");
    const id = searchParams.get("identifier");

    if (reverify === "true" && reason && id) {
      toast.info(
        reason === "SESSION_EXPIRED"
          ? "Your session has expired. Please verify to continue."
          : "Security check: Please verify your identity.",
      );
    }
  }, [searchParams]);

  const handleContinue = async () => {
    if (!value) return;

    setIsLoading(true);
    try {
      const type = value.includes("@") ? "email" : "phone";

      await authService.sendOtp(value, type, "login");

      setIdentifier(value, type);
      setStep("verify");
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-white leading-[1.1]">
          Login to <br />
          <span className="bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            StreamVerse
          </span>
        </h2>
        <p className="text-zinc-400 text-sm font-medium tracking-wide">
          Enter your email or mobile number to continue
        </p>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Email or Mobile Number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            className="h-14 bg-zinc-900/40 border-white/5 text-white placeholder:text-zinc-600 rounded-xl px-5 focus:border-blue-500/30 focus:ring-blue-500/10 transition-all text-base"
          />
        </div>

        <Button
          onClick={handleContinue}
          disabled={!value || isLoading}
          className="w-full h-14 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-extrabold text-base rounded-xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Send OTP
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      <p className="text-[11px] text-zinc-500/80 text-center px-4 leading-relaxed font-medium">
        By continuing, you agree to StreamVerse's{" "}
        <span className="text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
}
