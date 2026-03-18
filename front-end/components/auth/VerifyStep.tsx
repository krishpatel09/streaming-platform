"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export function VerifyStep() {
  const { email, username, mode, setStep } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = () => {
    if (otp.length === 6) {
      setStep("success");
    }
  };

  const identifier = mode === "login" ? email : username;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <button 
          onClick={() => setStep("identify")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-tight uppercase">Go Back</span>
        </button>
        <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
          Verify OTP
        </h2>
        <p className="text-zinc-400 text-base font-medium">
          Enter the 6-digit code sent to <br/>
          <span className="text-blue-500 font-semibold">{identifier}</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          className="gap-3"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot 
                key={index} 
                index={index} 
                className="w-12 h-14 text-2xl font-bold rounded-xl bg-zinc-900/50 border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center space-y-2">
          {timer > 0 ? (
            <p className="text-sm text-zinc-500">
              Resend code in <span className="text-zinc-300 font-medium">{timer}s</span>
            </p>
          ) : (
            <button 
              onClick={() => setTimer(30)}
              className="text-sm text-blue-500 font-semibold hover:text-blue-400 hover:underline transition-all"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>

      <Button 
        onClick={handleVerify}
        disabled={otp.length !== 6}
        className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-zinc-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
      >
        Verify & {mode === "login" ? "Login" : "Register"}
      </Button>
    </div>
  );
}
