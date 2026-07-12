"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoaderCircle, Sun, Moon, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/Separator";

const DEMO_ACCOUNTS = [
  { label: "Student", email: "student1@alumnow.com", password: "password123", subtitle: "Dashboard & browse mentors" },
  { label: "Alumni", email: "alumni1@alumnow.com", password: "password123", subtitle: "Manage sessions & students" },
  { label: "Admin", email: "admin@alumnow.com", password: "password123", subtitle: "Platform administration" },
];

const inputGlass = "bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-md focus:border-white/50 focus:ring-white/30";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = email ? DEMO_ACCOUNTS.filter((a) => a.email.toLowerCase().includes(email.toLowerCase())) : [];

  const signInWithRedirect = async (email: string, password: string) => {
    setSubmitting(true);
    setError("");
    const result = await login({ email, password });
    if (result.error) { setError(result.error); setSubmitting(false); return; }
    window.location.href = result.data?.redirectTo ?? "/dashboard";
  };

  const selectAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowSuggestions(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signInWithRedirect(email, password);
  }

  async function handleGoogleSignIn() { await signIn("google", { redirectTo: "/dashboard" }); }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {mounted && (
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="fixed top-4 right-4 z-50 h-9 w-9 rounded-[10px] bg-white/15 backdrop-blur-lg border border-white/20 flex items-center justify-center shadow-sm hover:bg-white/25 transition-all duration-150"
          title={theme === "dark" ? "Light mode" : "Dark mode"}>
          {theme === "dark" ? <Sun size={15} className="text-white" /> : <Moon size={15} className="text-white" />}
        </button>
      )}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105"
        poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      <div className="relative mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 sm:p-10">
          <p className="text-center text-3xl font-bold text-white/90">Alum<span className="text-white/60">Now</span></p>
          <h1 className="mt-6 text-3xl font-semibold text-white text-center">Welcome back</h1>
          <p className="mt-2 text-center text-white/50">Sign in to continue exploring.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-white/80 relative">
              Email
              <Input type="email" required value={email}
                onChange={(e) => { setEmail(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                className={`mt-2 ${inputGlass}`} placeholder="you@example.com" />
              {showSuggestions && filtered.length > 0 && (
                <div ref={suggestRef} className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-white/15 bg-[#1C1C1E]/95 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden">
                  {filtered.map((acc) => (
                    <button key={acc.email} type="button" onClick={() => selectAccount(acc)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 transition-all border-b border-white/5 last:border-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/60 uppercase">
                        {acc.label[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{acc.email}</p>
                        <p className="text-[11px] text-white/40 truncate">{acc.subtitle}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] font-mono text-white/30">{acc.password}</p>
                        <p className="text-[10px] font-medium text-white/50">Auto-fill</p>
                      </div>
                      <ChevronRight size={14} className="text-white/30 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </label>
            <label className="block text-sm font-semibold text-white/80">
              Password
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-2 ${inputGlass}`} placeholder="••••••••" />
            </label>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold text-white/70 hover:text-white underline underline-offset-2">Forgot password?</Link>
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button disabled={submitting} className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all duration-150">
              {submitting ? <span className="flex items-center justify-center gap-2"><LoaderCircle className="animate-spin" size={18} /> Signing in...</span> : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-white/15 bg-white/5 backdrop-blur p-5">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">Quick access</p>
            <button type="button" onClick={() => signInWithRedirect(DEMO_ACCOUNTS[0]!.email, DEMO_ACCOUNTS[0]!.password)}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-3 text-sm font-bold text-white border border-white/20 shadow-sm backdrop-blur-md transition-all duration-150">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
              Continue as Student → Dashboard
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-white/40">Other demo accounts</p>
            {DEMO_ACCOUNTS.slice(1).map((acc) => (
              <button key={acc.email} type="button" onClick={() => signInWithRedirect(acc.email, acc.password)}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/20 hover:text-white transition-all">
                {acc.label === "Alumni" ? "Continue as Alumni" : "Continue as Admin"}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Separator />
            <span className="text-xs text-white/40 whitespace-nowrap">or continue with</span>
            <Separator />
          </div>

          <button type="button" onClick={handleGoogleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/20 hover:text-white transition-all">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-white/90 hover:text-white underline underline-offset-2">Sign up</Link>
          </p>
          <p className="mt-2 text-center text-sm text-white/50">
            Want to share your experience?{" "}
            <Link href="/apply" className="font-semibold text-white/90 hover:text-white underline underline-offset-2">Apply as an alumnus</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
