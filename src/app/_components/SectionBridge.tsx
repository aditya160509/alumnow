"use client";

import { useEffect, useState } from "react";
import { Compass, MessageCircle, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const steps = [
  {
    icon: Compass,
    label: "01",
    title: "Start with context",
    body: "Find an alumnus who took the same path — the same university shortlist, the same career fork. Their context is the map you need.",
    gradient: "from-[#e8573a]/20 to-[#e8573a]/5",
  },
  {
    icon: MessageCircle,
    label: "02",
    title: "Have the real conversation",
    body: "Ask what a brochure will never tell you: the day-to-day reality, the surprising trade-offs, the things they wish they knew before choosing.",
    gradient: "from-[#d97706]/20 to-[#d97706]/5",
  },
  {
    icon: Sparkles,
    label: "03",
    title: "Leave with direction",
    body: "Turn one honest conversation into one clear next step — whether that's a university, a major, an internship, or simply knowing which door to open first.",
    gradient: "from-[#16a34a]/20 to-[#16a34a]/5",
  },
];

export function SectionBridge() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 }
    );
    const el = document.getElementById("how-it-works");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const show = visible || reducedMotion;

  return (
    <section
      id="how-it-works"
      aria-label="From search to conversation"
      className="relative overflow-hidden bg-[#0D0D0D]"
    >
      {/* Top divider with depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-coral/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <div className="max-w-3xl">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.34em] text-white/30 transition-all duration-700 ${
              show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            From finding to talking
          </p>
          <h2
            className={`mt-5 text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-white font-bold font-heading transition-all duration-700 delay-75 ${
              show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            The search should not end at a page.
            <span className="text-coral">
              {" "}
              It should open a conversation.
            </span>
          </h2>
          <p
            className={`mt-5 max-w-2xl text-base leading-7 text-white/40 sm:text-lg transition-all duration-700 delay-100 ${
              show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            Every graduate carries answers students are still searching for.
            alumnow closes that gap with a single, honest call.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
          {steps.map(({ icon: Icon, label, title, body, gradient }, index) => (
            <article
              key={title}
              className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-700 hover:-translate-y-1.5 hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
                show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{
                transitionDelay: `${180 + index * 100}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Gradient accent bar */}
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradient}`} />

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/20 font-medium tracking-wider">
                  {label}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-coral border border-white/[0.04]">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em] text-white font-heading">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/40 font-light">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
