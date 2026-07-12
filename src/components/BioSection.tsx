"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ResponseTimeBadge } from "./ResponseTimeBadge";

export function BioSection({
  bio,
  languages,
  responseHours,
}: {
  bio: string | null;
  languages: string[];
  responseHours: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const fullText = bio ?? "This mentor is ready to share practical, experience-backed guidance.";
  const words = fullText.split(/\s+/);
  const shouldTruncate = words.length > 150;
  const displayText = shouldTruncate && !expanded ? words.slice(0, 150).join(" ") + "\u2026" : fullText;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-primary">About this mentor</h2>
      <p className="leading-7 text-muted-foreground max-w-[65ch]">
        <span>{displayText}</span>
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-accent hover:text-accent-light text-xs font-semibold transition-colors"
            aria-label={expanded ? "Show less" : "Read more"}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {languages.map((language) => (
          <Badge key={language}>{language}</Badge>
        ))}
        <ResponseTimeBadge hours={responseHours} />
      </div>
    </section>
  );
}
