import Link from "next/link";
import { ArrowRight, CalendarHeart, MessageCircleHeart, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified voices",
    body: "Every mentor is grounded in a real JBCN story, so the advice stays practical.",
  },
  {
    icon: MessageCircleHeart,
    title: "Honest conversations",
    body: "Ask about fit, stress, trade-offs, and the things a polished brochure leaves out.",
  },
  {
    icon: CalendarHeart,
    title: "A clear next step",
    body: "Book the right conversation and leave with direction instead of guesswork.",
  },
];

export function ClosingSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0B152A_0%,#091120_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,79,233,0.20),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(245,166,35,0.14),_transparent_30%)]" />
      <div className="relative mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">
              Ready when you are
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              A thoughtful conversation beats a lonely decision.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              AlumNow helps you move from “I need to figure this out” to “I know who to talk to next.”
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/browse"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-primary-dark transition hover:bg-accent-light"
              >
                Find your mentor
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/apply"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:bg-white/5"
              >
                Become a mentor
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
