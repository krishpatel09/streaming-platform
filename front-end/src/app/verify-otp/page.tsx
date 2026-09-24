'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../services/auth.service';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update email if query parameter changes
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Countdown timer for resend code
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus the first input box on page load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    // If multiple digits (e.g. pasted or fast typing), take only the last digit
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-focus next input if value is typed
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0 && inputRefs.current[index - 1]) {
        // If current box is empty, delete previous box value and focus it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Only paste 6 digit numeric code

    const chars = pastedData.split('');
    setCode(chars);

    // Focus last input box after paste
    if (inputRefs.current[5]) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.verifyOtp(email, fullCode, 'SIGNUP');
      setSuccess('Account verified successfully! Logging you in...');
      
      // Save user profile metadata cache
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect home
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    setError('');
    setSuccess('');

    try {
      await authService.resendOtp(email, 'SIGNUP');
      setSuccess('A new verification code has been sent to your email.');
      setTimer(60); // Reset countdown to 60s
      setCode(['', '', '', '', '', '']); // Clear inputs
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus(); // Focus first input
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
      <div className="mb-8 text-center">
        <Link href="/">
          <h1 className="text-3xl font-black tracking-tighter text-rose-600 hover:text-rose-500 transition-colors">
            STREAMING
          </h1>
        </Link>
        <h2 className="mt-6 text-xl font-bold tracking-tight">Verify Your Account</h2>
        <p className="mt-2 text-sm text-zinc-400">
          We&apos;ve sent a 6-digit verification code to
          <span className="block mt-1 font-semibold text-white">{email || 'your email'}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-8">
        {!emailParam && (
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Verify Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
          </div>
        )}

        <div>
          <label className="block text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Verification Code
          </label>
          <div className="flex justify-between gap-2 sm:gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-zinc-800 bg-zinc-950 text-center text-xl font-bold text-white outline-none transition-all focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || code.some(d => d === '')}
          className="flex w-full items-center justify-center rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/25 transition-all hover:bg-rose-500 hover:shadow-rose-900/35 focus:outline-none focus:ring-2 focus:ring-rose-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            'Verify & Activate'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500">
        Didn&apos;t receive the code?{' '}
        {timer > 0 ? (
          <span className="font-medium text-zinc-400">
            Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-rose-500 hover:text-rose-400 transition-colors focus:outline-none disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-12 text-white selection:bg-rose-600 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.08)_0,transparent_60%)] pointer-events-none" />
      
      <Suspense fallback={
        <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10 flex flex-col items-center justify-center">
          <svg
            className="h-8 w-8 animate-spin text-rose-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      }>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
