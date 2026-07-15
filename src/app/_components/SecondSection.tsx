import Link from "next/link";
import {
  ArrowRight,
  Compass,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const points = [
  {
    icon: Compass,
    title: "Start with context",
    body: "Find someone who knows the university, the course, and the questions behind your decision.",
  },
  {
    icon: MessageCircle,
    title: "Have the real conversation",
    body: "Ask what a prospectus cannot answer: the everyday trade-offs, surprises, and details.",
  },
  {
    icon: Sparkles,
    title: "Leave with direction",
    body: "Turn a useful conversation into one clear next step for your application or career.",
  },
];

export function SecondSection() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-cream text-navy">
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col justify-between px-6 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-20 lg:px-16">
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-navy/40">
            The conversation after the search
          </p>
          <span className="font-mono text-xs text-navy/25">02 / 02</span>
        </div>
        <div className="grid gap-12 py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-gold">
              What happens next
            </p>
            <h2 className="max-w-3xl text-6xl leading-[.88] tracking-[-.04em] font-semibold sm:text-7xl">
              A better question can change the{" "}
              <em className="not-italic text-gold">whole route.</em>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-navy/60 sm:text-lg">
              AlumNow makes the space between &ldquo;I&rsquo;m not sure&rdquo;
              and &ldquo;I know what to do next&rdquo; feel smaller.
            </p>
            <Link
              href="/browse"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
            >
              Explore the network <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {points.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">
                    0{index + 1}
                  </span>
                  <Icon size={20} className="text-navy/40" />
                </div>
                <h3 className="mt-12 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-navy/50">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
