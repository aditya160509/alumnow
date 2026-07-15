"use client";
import { ArrowDown } from "lucide-react";

export function ScrollButton({
  target = "how-it-works",
}: {
  target?: string;
}) {
  return (
    <button
      onClick={() =>
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })
      }
      className="inline-flex h-12 items-center gap-2 rounded-full border border-navy/20 px-5 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/5"
    >
      See how it works
      <ArrowDown size={16} />
    </button>
  );
}
