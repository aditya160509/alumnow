"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  /** Enables a continuous scroll-linked parallax offset instead of a one-time reveal. */
  parallax?: boolean;
  /** How far (px) the element travels across the scroll range when parallax is on. */
  parallaxAmount?: number;
};

/**
 * GSAP ScrollTrigger wrapper: fades/slides an element in the first time it enters
 * the viewport, or (with `parallax`) ties its position continuously to scroll
 * progress for a depth effect. No-ops under prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  y = 32,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  parallax = false,
  parallaxAmount = 60,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      if (parallax) {
        gsap.fromTo(
          el,
          { y: parallaxAmount },
          {
            y: -parallaxAmount,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, parallax, parallaxAmount, y, duration, delay, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Call once on mount (e.g. in a layout) to keep ScrollTrigger positions in sync with Next.js route/content changes. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
