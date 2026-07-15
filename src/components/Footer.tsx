"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

function CtaSection() {
  return (
    <section className="relative py-32 px-6 md:px-16 lg:px-24 text-center overflow-hidden bg-cream">
      <div className="relative z-10">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-navy tracking-tight leading-[0.85] max-w-3xl mx-auto mb-4">
          Your next chapter starts here.
        </h2>
        <p className="text-navy/50 font-body font-light text-sm md:text-base max-w-xl mx-auto mb-8">
          Book a free strategy call. See what AI&#8209;powered alumni mentoring
          can do. No commitment, no pressure. Just possibilities.
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/browse"
            className="rounded-full border border-navy/20 px-6 py-3 text-sm font-medium text-navy flex items-center gap-2 hover:bg-navy/5 transition-all font-body"
          >
            Find a mentor
            <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link
            href="/apply"
            className="bg-navy text-white rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 hover:bg-navy-light transition-colors font-body"
          >
            Become a mentor
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-[-0.03em] text-navy"
          >
            Alum<span className="text-gold">Now</span>
            <sup className="ml-0.5 text-xs text-navy/30">&reg;</sup>
          </Link>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-navy/40 hover:text-navy/70 font-body font-light text-xs transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SimpleFooter() {
  return (
    <footer className="bg-white text-navy border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-[-0.03em] text-navy"
          >
            Alum<span className="text-gold">Now</span>
            <sup className="ml-0.5 text-xs text-navy/30">&reg;</sup>
          </Link>
          <div className="flex gap-5 text-xs text-navy/40">
            <Link href="/privacy" className="hover:text-navy transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-navy transition-colors">
              Terms
            </Link>
            <a
              href="mailto:hello@alumnow.com"
              className="hover:text-navy transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-navy/30">
          <p>&copy; 2026 AlumNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) {
    return <SimpleFooter />;
  }

  return (
    <footer className="relative bg-cream">
      <CtaSection />
    </footer>
  );
}
