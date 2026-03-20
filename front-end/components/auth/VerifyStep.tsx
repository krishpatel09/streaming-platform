import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authService } from "@/serivces/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function VerifyStep() {
  const { identifier, identifierType, setStep, setAuth, setOpen, reset } =
    useAuthStore();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({
        identifier,
        identifier_type: identifierType,
        otp,
        device_fingerprint: window.navigator.userAgent,
        device_name: "Web Browser",
        device_type: "desktop",
      });

      setAuth(response.user, response.tokens);
      toast.success("Login successful!");

      setOpen(false);

      router.push(`/mypage`);

      setTimeout(reset, 500);
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authService.sendOtp(identifier, identifierType!, "login");
      setTimer(30);
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <button
          onClick={() => setStep("identify")}
          disabled={isLoading}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-widest uppercase">
            Go Back
          </span>
        </button>
        <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">
          Verify OTP
        </h2>
        <p className="text-zinc-400 text-sm font-medium tracking-wide">
          Enter the 6-digit code sent to <br />
          <span className="text-blue-400 font-bold">{identifier}</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
          className="gap-4"
        >
          <InputOTPGroup className="gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-14 h-16 text-3xl font-black rounded-xl bg-zinc-900/40 border-white/5 text-white focus:border-blue-500/30 focus:ring-blue-500/10 transition-all"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center space-y-2">
          {timer > 0 ? (
            <p className="text-sm text-zinc-500 font-medium">
              Resend code in{" "}
              <span className="text-zinc-300 font-bold">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-sm text-blue-500 font-bold hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-all disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>

      <Button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isLoading}
        className="w-full h-14 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-extrabold text-base rounded-xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Verify & Login"
        )}
      </Button>
    </div>
  );
}
