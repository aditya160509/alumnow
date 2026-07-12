import { CalendarDays, Search, Video } from "lucide-react";

const steps = [
  { icon: Search, number: "01", title: "Find a useful perspective", body: "Explore alumni by university, course, country, and the questions you are carrying." },
  { icon: CalendarDays, number: "02", title: "Choose a time that works", body: "Pick a focused session that fits your schedule and the depth of guidance you need." },
  { icon: Video, number: "03", title: "Leave with a next step", body: "Have an honest video conversation and turn uncertainty into something actionable." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-accent-dark">How it works</p>
            <h2 className="font-serif text-5xl leading-[.94] tracking-tight text-primary-dark sm:text-6xl lg:text-7xl">
              Three simple moves toward a <span className="text-accent-dark">clearer choice.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/60">
              No complicated process. Just the right person, the right question, and enough space to think clearly.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, body }) => (
              <article key={number} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-accent-dark">{number}</span>
                  <Icon size={20} className="text-primary/70" />
                </div>
                <h3 className="mt-10 text-base font-semibold text-primary-dark">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
