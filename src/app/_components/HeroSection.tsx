"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScrollButton } from "./ScrollButton";
import { MetalFx } from "metal-fx";
import { useEffect, useState } from "react";

const LightPillar = dynamic(() => import("@/components/LightPillar/LightPillar"), { ssr: false });

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] overflow-hidden bg-[#0D0D0D] text-white"
    >
      {/* Three.js light pillar backdrop */}
      <div className="absolute inset-0">
        <LightPillar
          topColor="#F97316"
          bottomColor="#000000"
          intensity={0.6}
          rotationSpeed={0.3}
          glowAmount={0.005}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="normal"
        />
      </div>

      {/* Dual radial glows for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(232,87,58,0.10),transparent_55%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(232,87,58,0.04),transparent_50%)]" />

      {/* Breathing pulse animation (overdrive) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, #e8573a 0%, transparent 70%)",
          animation: mounted ? "heroPulse 6s ease-in-out infinite" : "none",
        }}
      />

      <style>{`
        @keyframes heroPulse {
          0%, 100% { transform: scale(1); opacity: 0.04; }
          50% { transform: scale(1.12); opacity: 0.08; }
        }
        @keyframes tagPing {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col px-6 py-6 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        <div className="flex flex-1 flex-col justify-center">
          <div className="max-w-4xl">
            <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.20em] text-white/50 sm:text-sm">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-coral" style={{ animation: "tagPing 2.4s ease-out infinite" }} />
                <span className="absolute inset-0 rounded-full bg-coral shadow-[0_0_0_6px_rgba(232,87,58,0.20)]" />
              </span>
              Alumni-Student Connect Platform
            </p>
            <h1 className="text-[clamp(2.8rem,8vw,7rem)] leading-[.92] tracking-[-0.04em] font-bold font-heading text-white">
              A clearer path{" "}
              <span className="text-coral text-glow-coral">to what comes next.</span>
            </h1>
            <p className="mt-6 max-w-[42rem] text-[clamp(1rem,1.8vw,1.2rem)] leading-relaxed text-white/45 sm:text-lg font-light tracking-wide">
              Meet verified alumni who can help you choose universities, shape
              applications, and make your next big decision with confidence.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <MetalFx preset="chromatic" strength={1}>
                <Link href="/browse">
                  <Button
                    variant="accent"
                    className="h-13 rounded-full px-7 text-base font-semibold tracking-tight"
                  >
                    Find your mentor{" "}
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </MetalFx>
              <ScrollButton target="how-it-works" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-white/5 pb-2 pt-5 mt-8">
          <span className="text-xs text-white/20 max-sm:hidden font-mono tracking-wider">
            From where you are. To where you want to be.
          </span>
        </div>
      </div>
    </section>
  );
}
