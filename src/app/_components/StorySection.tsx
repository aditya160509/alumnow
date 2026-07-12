"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const storyVideo = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4";

export function StorySection() {
  return (
    <section id="story" className="relative bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-accent-dark sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(184,216,208,.3)]" />
              Guidance with a human point of view
            </p>
            <h2 className="font-serif text-5xl leading-[1.02] tracking-tight text-primary-dark sm:text-6xl md:text-7xl">
              Make the next choice <span className="text-accent-dark">feel more yours.</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-lg">
              From university shortlists to the first steps of a career, turn uncertainty into a conversation with someone who has already lived the questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/browse"><Button variant="primary" className="h-12 rounded-full px-6">Meet a JBCN alumnus <ArrowRight size={16} className="ml-2" /></Button></Link>
              <Link href="/about" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-primary transition hover:bg-muted">Our story</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            <video src={storyVideo} autoPlay muted loop playsInline preload="metadata" className="aspect-[4/3] w-full object-cover" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
