import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-shimmer rounded-[6px] bg-gradient-to-r from-[var(--color-bg-hover)] via-[var(--color-border)] to-[var(--color-bg-hover)] bg-[length:200%_100%]", className)} />;
}
