"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthDialog = () => {
  const { isOpen, step, email, setOpen, setStep, setEmail, reset } =
    useAuthStore();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to /auth/api/login
    setTimeout(() => {
      setLoading(false);
      setStep("verify");
      toast.success("OTP sent to your email");
    }, 1500);
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    // Simulate API call to /auth/api/verify-otp
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      toast.success("Login successful!");
      setTimeout(() => reset(), 2000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-background border-border text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === "identify" && "Login / Sign Up"}
            {step === "verify" && "Verify OTP"}
            {step === "success" && "Welcome Back!"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === "identify" &&
              "Enter your email to receive a 6-digit verification code."}
            {step === "verify" && `We've sent a code to ${email}`}
            {step === "success" && "You have successfully logged in."}
          </DialogDescription>
        </DialogHeader>

        {step === "identify" && (
          <form onSubmit={handleIdentify} className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="email@example.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        )}

        {step === "verify" && (
          <div className="space-y-6 pt-4 flex flex-col items-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="bg-white/5 border-white/10"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleVerify}
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify & Login"
              )}
            </Button>
            <div className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button
                className="text-primary hover:underline"
                onClick={handleIdentify}
              >
                Resend
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <p className="text-center text-gray-300">
              Setting up your profile...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
