"use client";

import { useRef } from "react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    quote:
      "I booked a call before my CAT results even came in. The alumnus I spoke to had been through the exact IIM vs ISB debate — he gave me the clearest framework I'd ever heard.",
    name: "Riya Desai",
    role: "Now at IIM Bangalore · Batch of 2024",
    avatar: "https://picsum.photos/seed/riya/80/80",
    stars: 5,
  },
  {
    quote:
      "Nobody in my family had done engineering abroad. I talked to three alumni in two weeks. By the end I had a shortlist, a timeline, and actual confidence.",
    name: "Arjun Mehta",
    role: "Now at TU Delft · Batch of 2023",
    avatar: "https://picsum.photos/seed/arjun/80/80",
    stars: 5,
  },
  {
    quote:
      "The alumni I spoke to had worked at the exact firm I was targeting. Fifteen minutes of that conversation was worth more than three months of Googling.",
    name: "Priya Kapoor",
    role: "Now at McKinsey · Batch of 2025",
    avatar: "https://picsum.photos/seed/priya2/80/80",
    stars: 5,
  },
  {
    quote:
      "I was stuck between product and finance. A 30-minute call with a JBCN alumnus who'd switched lanes mid-career made that choice feel obvious.",
    name: "Siddharth Nair",
    role: "Now at Razorpay · Batch of 2024",
    avatar: "https://picsum.photos/seed/sid/80/80",
    stars: 5,
  },
  {
    quote:
      "I almost picked the wrong masters programme. The alumnus walked me through his actual day-to-day — it was completely different from the university website.",
    name: "Ananya Iyer",
    role: "Now at LSE · Batch of 2023",
    avatar: "https://picsum.photos/seed/ananya/80/80",
    stars: 5,
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({
  t,
  delay,
}: {
  t: (typeof testimonials)[0];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 rounded-[24px] p-6"
      style={{
        background: "rgba(255,255,255,0.90)",
        border: "1px solid rgba(15,34,64,0.08)",
        boxShadow: "0 4px 24px rgba(15,34,64,0.06)",
      }}
    >
      <StarRow count={t.stars} />
      <p className="flex-1 text-sm leading-6 text-primary-dark/65">"{t.quote}"</p>
      <div className="flex items-center gap-3 pt-1 border-t border-primary/[0.06]">
        <img
          src={t.avatar}
          alt={t.name}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10"
        />
        <div>
          <p className="text-sm font-medium text-primary-dark">{t.name}</p>
          <p className="text-[11px] text-primary/45">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineH = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F4F6FB 70%, #10172A 100%)" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/[0.06]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,79,233,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">

        {/* ─── Header ─── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[520px]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-primary/55 mb-4">
              From the network
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.0] tracking-[-0.03em] text-primary-dark"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Students who had the conversation.{" "}
              <em className="not-italic text-primary/40">In their own words.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:flex-col lg:items-end lg:gap-4"
          >
            {/* Aggregate rating */}
            <div className="flex items-center gap-3">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-primary/50">4.9 average · 100+ sessions</p>
              </div>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary/70 hover:bg-primary/5 hover:text-primary transition-all"
            >
              Browse all alumni <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* ─── Testimonials grid ─── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 0.08} />
          ))}
        </div>

        {/* Second row — offset for visual rhythm */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {testimonials.slice(3).map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={0.25 + i * 0.08} />
          ))}
        </div>

        {/* ─── Stats strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-primary/10 pt-14"
        >
          {[
            { value: "100+", label: "Verified alumni" },
            { value: "4.9 ★", label: "Session rating" },
            { value: "< 2 min", label: "To book a call" },
            { value: "Free", label: "First session" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <span
                className="text-3xl sm:text-4xl font-normal tracking-[-0.02em] text-primary-dark"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-primary/40">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ─── Descent line into footer ─── */}
        <div className="mt-24 flex justify-center">
          <div className="relative h-20 w-px overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#5B4FE9]/60 to-transparent"
              style={{ height: lineH }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
