"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollButton } from "./ScrollButton";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const scenes = [["Golden Hour", "https://cdn.sceneai.art/Flawers/0fd3804f-c1dd-4759-b121-d1e1ce3be548.mp4"], ["Still Water", "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4"], ["Deep Woods", "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4"], ["Quiet Dawn", "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4"]] as const;

export function HeroSection() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const reducedMotion = useReducedMotion();

  const change = (next: number) => {
    if (next === active || busy) return;
    setActive(next);
    setBusy(true);
    window.setTimeout(() => setBusy(false), 1000);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") change((active + 1) % scenes.length);
      if (event.key === "ArrowLeft") change((active + scenes.length - 1) % scenes.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden bg-primary-dark text-white">
      <div
        className="absolute inset-0 will-change-transform"
        style={reducedMotion ? undefined : { transform: `translate3d(0, ${Math.min(scrollY * 0.12, 72)}px, 0) scale(1.04)` }}
      >
        {scenes.map(([label, url], index) => (
          <video key={label} src={url} autoPlay muted loop playsInline preload={index === 0 ? "auto" : "metadata"} aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
      <div className="absolute inset-0 bg-primary-dark/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/35 via-primary-dark/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-gradient-to-b from-transparent via-primary-dark/55 to-[#0C1830]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#091228] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex flex-1 flex-col justify-center">
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-white/70 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(245,166,35,.2)]" />
              Real guidance, from people who have done it
            </p>
            <h1 className="font-serif text-6xl leading-[.94] tracking-tight sm:text-7xl md:text-8xl lg:text-[6.5rem]">
              A clearer path <span className="text-accent">to what comes next.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Meet verified JBCN alumni who can help you choose universities, shape applications, and make your next big decision with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/browse"><Button variant="accent" className="h-12 rounded-full px-6 text-base">Find your mentor <ArrowRight size={16} className="ml-2" /></Button></Link>
              <ScrollButton target="how-it-works" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/15 pb-2 pt-5">
          <div className="flex gap-2">
            {scenes.map(([label], index) => (
              <button key={label} onClick={() => change(index)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${index === active ? "bg-white/15 text-white" : "text-white/45 hover:text-white/70"}`}>{label}</button>
            ))}
          </div>
          <span className="text-xs text-white/40 max-sm:hidden">JBCN alumni network · Mumbai to the world</span>
        </div>
      </div>
    </section>
  );
}
