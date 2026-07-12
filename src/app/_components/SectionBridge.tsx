"use client";

import { useEffect, useState } from "react";
import { Compass, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import Link from "next/link";

const steps = [
  {
    icon: Compass,
    label: "01",
    title: "Start with context",
    body: "Find a JBCN alumnus who took the same path — the same university shortlist, the same career fork. Their context is the map you need.",
  },
  {
    icon: MessageCircle,
    label: "02",
    title: "Have the real conversation",
    body: "Ask what a brochure will never tell you: the day-to-day reality, the surprising trade-offs, the things they wish they knew before choosing.",
  },
  {
    icon: Sparkles,
    label: "03",
    title: "Leave with direction",
    body: "Turn one honest conversation into one clear next step — whether that's a university, a major, an internship, or simply knowing which door to open first.",
  },
];

export function SectionBridge() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.2 }
    );
    const el = document.getElementById("bridge-transition");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const show = visible || reducedMotion;

  return (
    <section
      id="bridge-transition"
      aria-label="From search to conversation"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F4F6FB 0%, #EEF2F8 30%, #10172A 100%)",
      }}
    >
      {/* Ambient radial glows */}
      <div className="absolute inset-x-0 top-0 h-px bg-primary/10" />
      <div className="absolute inset-x-0 top-16 h-[36rem] bg-[radial-gradient(circle_at_50%_0%,rgba(91,79,233,0.10),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-[radial-gradient(circle_at_50%_100%,rgba(91,79,233,0.15),transparent_55%)]" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-32">

        {/* ─── Eyebrow + Heading ─── */}
        <div className="max-w-3xl">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.34em] text-primary/60 transition-all duration-500 ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            From finding to talking
          </p>
          <h2
            className={`mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-primary-dark sm:text-5xl lg:text-6xl transition-all duration-500 delay-75 ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            The search should not end at a page.
            <span className="text-accent"> It should open a conversation.</span>
          </h2>
          <p
            className={`mt-5 max-w-2xl text-base leading-7 text-primary-dark/65 sm:text-lg transition-all duration-500 delay-100 ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Every JBCN graduate carries answers students are still searching for.
            AlumNow closes that gap with a single, honest call.
          </p>
        </div>

        {/* ─── How-it-works cards ─── */}
        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-3">
          {steps.map(({ icon: Icon, label, title, body }, index) => (
            <article
              key={title}
              className={`group rounded-[28px] border border-white/70 bg-white p-7 shadow-[0_18px_60px_rgba(15,34,64,0.08)] transition-all duration-500 hover:shadow-[0_24px_80px_rgba(15,34,64,0.14)] hover:-translate-y-1 ${
                show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${140 + index * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary/45">{label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/6 text-accent group-hover:bg-accent/10 transition-colors">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="mt-11 text-xl font-semibold tracking-[-0.03em] text-primary-dark">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-primary-dark/60">
                {body}
              </p>
            </article>
          ))}
        </div>

        {/* ─── Stats strip ─── */}
        <div
          className={`mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-primary/10 pt-12 transition-all duration-500 delay-[350ms] ${
            show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {[
            { value: "100+", label: "Verified alumni" },
            { value: "15 min", label: "Avg. booking time" },
            { value: "4.9★", label: "Avg. session rating" },
            { value: "Free", label: "Trial session" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-serif text-3xl tracking-tight text-primary-dark">
                {value}
              </span>
              <span className="text-xs text-primary-dark/50 uppercase tracking-[0.18em]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ─── CTA + descent arrow ─── */}
        <div
          className={`mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 delay-[400ms] ${
            show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Find your mentor
          </Link>
          <span className="text-sm text-primary-dark/50">
            No account needed · Book in under 2 minutes
          </span>
        </div>

        {/* descent indicator */}
        <div className="mt-20 flex flex-col items-center gap-3">
          <div className="h-12 w-px bg-gradient-to-b from-primary/20 to-accent/60" />
          <div
            className={`flex flex-col items-center gap-2 transition-all duration-500 delay-500 ${
              show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <ChevronDown size={15} className="text-accent animate-bounce" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-dark/40">
              Continue to the conversation
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
