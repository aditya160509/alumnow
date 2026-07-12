# Navbar & Dashboard UI Research — AlumNow

> Compiled July 2026. Sources include Awwwards, shadcn/blocks, LogRocket, Lucky Graphics, Frontend Masters, Setproduct, Lazarev Agency, Muzli, PatternFly, and production dashboards from Linear, Stripe, Vercel, HubSpot, and Grafana.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Top Navigation Bar Design Patterns](#2-top-navigation-bar-design-patterns)
3. [Liquid Glass Implementation Guide](#3-liquid-glass-implementation-guide)
4. [Dashboard Layout Patterns](#4-dashboard-layout-patterns)
5. [AlumNow-Specific Recommendations](#5-alumnow-specific-recommendations)
6. [Code Snippets & Techniques Worth Adopting](#6-code-snippets--techniques-worth-adopting)
7. [Mobile Navigation Patterns](#7-mobile-navigation-patterns)
8. [Key Resources & References](#8-key-resources--references)

---

## 1. Executive Summary

### Landscape

2026 design trends converge around three pillars: **liquid glass** (refractive, physics-based glassmorphism), **gradient-first navigation** (frosted pills, ambient glow), and **dashboards built on progressive disclosure** (one primary metric per screen, drill-down everywhere else).

### What Changed from 2024–2025

| Trend | 2024 | 2026 |
|-------|------|------|
| Glassmorphism | `backdrop-filter: blur(20px)` | SVG feDisplacementMap lens + chromatic aberration |
| Navbar approach | Solid header, sometimes transparent | Floating pill, liquid-glass nav, scroll-triggered morph |
| Dashboard layout | Many KPIs, many charts | Single metric hero, sparklines, progressive detail |
| Mobile nav | Hamburger only | Gesture-driven sheet + bottom tab hybrid |

### Key Takeaways for AlumNow

1. **Replace white header with liquid-glass floating pill** — the about page already uses `liquid-glass`; the main navbar should match.
2. **Add stats/analytics cards to the dashboard** — currently a bookings list; add KPI row, activity feed, quick-action grid.
3. **Upgrade liquid-glass CSS** — the current implementation is a basic blur; you're 4 CSS declarations away from Apple-level refraction.
4. **Mobile nav should be a bottom sheet or bottom tab bar**, not a simple dropdown.

---

## 2. Top Navigation Bar Design Patterns

### 2.1 The Floating Glass Pill (Recommended for AlumNow)

Used by: Awwwards "Frosted floating nav bar", shadcn Glassmorphism Navbar, Apple visionOS Tab Bar, Aura.build.

**Characteristics:**
- `max-width: 3xl` centered pill, not full-width
- `backdrop-filter: blur(20px) saturate(180%)` with `rgba(255,255,255,0.1)` background
- `border-radius: 9999px` (full pill shape)
- Subtle `border: 1px solid rgba(255,255,255,0.18)`
- Inner highlight via `inset box-shadow`

**Reference Sites:**
- https://www.shadcn.io/blocks/navbar-glassmorphism — shadcn glassmorphism navbar with framer-motion
- https://jeremyfrank.dev/craft/glassmorphic-nav-bar/ — spotlight hover effect, self-fading gradient border
- https://www.awwwards.com/inspiration/frosted-floating-nav-bar — Awwwards frosted floating nav
- https://codeshack.io/apple-style-glassmorphism-navbar-css/ — Apple-style with `saturate(180%)`

**Why it works on video backgrounds:**
- The blur softens motion behind it, preventing visual conflict
- `text-shadow: 0 1px 3px rgba(0,0,0,0.3)` keeps text readable regardless of backdrop luminance
- Semi-transparency preserves the hero video as a design element

### 2.2 Transparent → Solid Scroll Morph

Used by: Apple, Stripe, most SaaS marketing sites.

**Pattern:**
```tsx
// Scroll listener to toggle class
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```
- On hero: fully transparent or glass
- After scrolling past hero: solid `bg-white` with shadow
- Transition duration: `0.3s ease`

**Reference:**
- https://blog.bajarangisoft.com/blog/how-to-create-transparent-navbar-with-video-header-using-css
- Shopify's guide to background videos (2026) — https://www.shopify.com/in/blog/background-video-css

### 2.3 Spotlight / Active Indicator Nav

Used by: Jeremy Frank glassmorphic nav bar, Apple liquid glass nav.

**Pattern:**
- A `.spotlight` pseudo-element or absolute div moves behind the active link
- Uses `clip-path: inset()` with `round 99em` for the pill shape
- JS sets `--left` and `--width` CSS custom properties
- The spotlight has `transition: clip-path 0.2s` for smooth slide

```css
.spotlight {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  clip-path: inset(
    0 calc(100% - ((var(--left) + var(--width)) * 1px))
    0 calc(var(--left) * 1px) round 99em
  );
  transition: clip-path 0.2s;
  pointer-events: none;
}
```

### 2.4 Gradient / Ambient Glow Nav

Used by: Prathamesh Sawant's premium glassmorphic navbar, Aura.build.

**Pattern:**
- Each nav link has a hidden glow element (`absolute`, `rounded-full`, `blur-xl`, `opacity-0`)
- On hover: `opacity: 100` with `transition: opacity 0.3s`
- The glow color matches the brand (e.g., `bg-amber-500`)

```tsx
<a className="relative group flex items-center justify-center overflow-hidden rounded-lg">
  <div className="absolute -bottom-1 translate-y-1/2 size-10 rounded-full bg-accent opacity-0 blur-lg group-hover:opacity-100" />
  <div className="absolute size-6 rounded-full bg-accent opacity-0 blur-xl group-hover:opacity-100" />
  <div className="relative px-8 py-2 rounded-lg text-gray-400 transition-colors duration-300 group-hover:text-white">
    <span className="text-sm font-semibold">{label}</span>
  </div>
</a>
```

---

## 3. Liquid Glass Implementation Guide

### 3.1 Current State in AlumNow

```css
/* src/app/globals.css */
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
```

**What's missing:**
- `saturate(180%)` — makes the refraction vivid
- `brightness(1.1)` — simulates light passing through
- Inset multi-edge shadows — real glass has rim highlights on all 4 edges
- Gradient border (currently has no `border`)
- Sheen overlay — diagonal glossy reflection

### 3.2 Tiered Glass System

Based on the "Ladder" approach from DimonB19a and LeonardSEO's liquid-glass-react:

#### Tier 0 — Opaque Fallback (every browser)
```css
.glass-surface {
  background: rgba(255, 255, 255, 0.9);
}
```

#### Tier 1 — Standard Frost (all modern browsers)
```css
@supports (backdrop-filter: blur(10px)) {
  .glass-surface {
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(12px) saturate(180%) brightness(1.08);
    -webkit-backdrop-filter: blur(12px) saturate(180%) brightness(1.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(255, 255, 255, 0.2),
      inset 1px 0 0 rgba(255, 255, 255, 0.15),
      inset -1px 0 0 rgba(255, 255, 255, 0.15);
  }
}
```

#### Tier 2 — Refractive Lens (Chromium only)
```css
/* Requires SVG filter injected once in layout */
@supports (backdrop-filter: url(#liquid-lens)) {
  html[data-liquid-glass] .glass-surface {
    backdrop-filter: blur(8px) url(#liquid-lens) saturate(180%) brightness(1.08);
  }
}
```

### 3.3 The SVG Displacement Filter

This is the key to Apple-style "liquid glass" where content warps at the edges.

```tsx
// components/LiquidGlassFilter.tsx — render once in root layout
export function LiquidGlassFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter id="liquid-lens">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feImage href="/displacement-map.png" x="0" y="0" width="100%" height="100%" result="map" />
          <feDisplacementMap in="blur" in2="map" scale="-42" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        </filter>
      </defs>
    </svg>
  );
}
```

**Key parameters:**
- `scale="-42"` — **negative** value creates magnifying lens effect (pixels bulge outward)
- The displacement map PNG is a ~2–5KB image with edge gradients
- Falls back gracefully — Safari/Firefox ignore the `url(#filter)` and use the plain blur

**Sources:**
- https://github.com/LeonardSEO/liquid-glass-react — full production component (~5KB)
- https://lucky.graphics/learn/liquid-glass-css-glassmorphism-tutorial/ — 2026 definitive guide
- https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/ — LogRocket tutorial
- https://webtricks.dev/blog/liquid-glass-css — WebTricks frost + rim + sheen
- https://lucaperullo/simple-liquid-glass — zero-dependency React component

### 3.4 Sheen / Specular Highlight

Adds the glossy "wet" look that distinguishes liquid glass from frosted glass:

```css
.glass-surface::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.08) 28%,
    transparent 58%
  );
  mix-blend-mode: screen;
  pointer-events: none;
}
```

The element needs `position: relative` and `isolation: isolate` so the negative `z-index` stays within its stacking context.

### 3.5 Gradient Border (Self-Fading)

```css
.glass-surface::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0) 41%,
    rgba(255, 255, 255, 0) 57%,
    rgba(255, 255, 255, 0.15) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

This creates a border that fades at the top-left and bottom-right — mimicking how light hits real glass.

### 3.6 Readability Best Practices on Video Backgrounds

| Technique | Why |
|-----------|-----|
| `text-shadow: 0 2px 8px rgba(0,0,0,0.4)` | Ensures text legible against bright/dark video frames |
| High blur radius (12–20px) | Smoothes out video motion behind text |
| `saturate(180%)` | Makes background colors pop through glass |
| Dark overlay under glass (`rgba(0,0,0,0.2)`) | Adds contrast anchor behind nav items |
| `font-weight: 600` on nav links | Thicker text cuts through blur |
| Keep glass element small (pill, not full-width bar) | Reduces area where blur needs to render = better perf |

**Performance warning (2026 consensus):**
- Limit concurrent glass panels to **3 maximum**
- Use lower blur radii (8–16px) and compensate with higher saturation
- On mobile, fall back to solid/tint — the GPU cost of `backdrop-filter` on video is significant
- Apply `transform: translateZ(0)` to promote to GPU compositor layer

---

## 4. Dashboard Layout Patterns

### 4.1 The Standard SaaS Dashboard Anatomy

From Setproduct, PatternFly, and SaaS dashboard UX patterns analysis:

```
┌──────────────────────────────────────────────┐
│ Header: title, date range, global filters    │
├──────────────────┬───────────────────────────┤
│ KPI Cards Row    │ KPI Cards Row             │
│ (3–7 cards,      │ (sparkline + delta)       │
│  top-left heavy) │                            │
├──────────────────┴───────────────────────────┤
│ Primary Chart Area (hero chart)              │
├──────────────────┬───────────────────────────┤
│ Secondary Chart  │ Activity Feed /           │
│ or Table         │ Quick Actions             │
├──────────────────┴───────────────────────────┤
│ Data Table (sortable, filterable)            │
└──────────────────────────────────────────────┘
```

**Three layout patterns (from Setproduct, 2026):**

| Pattern | Best For | Example |
|---------|----------|---------|
| Single-page scroll | Status pages, focused tools | Vercel/GitHub status |
| Multi-page tabs | Multi-faceted analytics | Google Analytics 4 |
| Progressive disclosure | Investigative work | Linear |

### 4.2 KPI Card Component Pattern

The **four-part card** structure (Lazarev Agency analysis):

```
┌──────────────────────┐
│ Label (small, muted) │
│ Value (large, bold)  │
│ Delta ▲ +12%        │
│ Sparkline ▁▂▃▅▇     │
└──────────────────────┘
```

**Container query approach** (from Ilir Ivezaj's dashboard design):

```tsx
<div className="kpi-card" style={{ containerType: "inline-size", containerName: "kpi" }}>
  <span className="label">{label}</span>
  <span className="value" style={{ fontSize: "clamp(1.5rem, 9cqi, 2.75rem)" }}>
    {value}
  </span>
  <span className="trend" style={{ display: "none" }}>
    {/* hidden until card is >= 220px wide via @container */}
  </span>
</div>
```

### 4.3 Activity Feed Pattern

Used by: Linear, Notion, Midday.

**Best practices:**
- Timestamped entries with relative time ("2 hours ago")
- Avatar + action description
- Visual hierarchy: avatar → action → timestamp
- Skeleton loaders for feed items
- "View all" link when >5 items
- Empty state: illustration + CTA to first action

### 4.4 Quick-Action Cards

Used by: AlumNow's current dashboard already has two ("Find a mentor", "My bookings"). This is a good pattern — extend it.

**Enhancement suggestions:**
- Add 1-2 more quick-action cards in the grid (e.g., "View Profile", "Messages")
- Use icon + label + chevron pattern (already matches)
- Add subtle hover animation (`-translate-y-0.5` + `shadow-md`)
- Group by theme with section headers

### 4.5 Booking Management Interface

Common patterns from booking dashboards (Calendly, Cal.com, HubSpot Meetings):

- **Tab view**: Upcoming / Past / Cancelled (AlumNow has this — good)
- **Timeline view**: Sessions laid out chronologically with time blocks
- **Countdown timer**: For upcoming sessions (AlumNow has this — good)
- **Quick actions**: Join, Reschedule, Cancel, Add Review
- **Review prompt**: Conditional component after completed sessions (AlumNow has this — good)

**Missing from AlumNow's dashboard:**
- Stats row (total sessions, hours booked, upcoming this week)
- Mentor info inline with booking card
- Session notes / preparation area
- Calendar view toggle

### 4.6 Stats / Analytics Card Designs

Research-backed (Lazarev, Salt Design System, SaaS Dashboard UX Patterns):

| Metric Type | Visualization | Context |
|-------------|--------------|---------|
| Total sessions | Large number + sparkline | Trend direction |
| Hours booked | Number card + delta | % change vs last month |
| Upcoming this week | Number card only | Count, with urgency badge |
| Mentor response rate | Progress bar + % | Quality signal |
| Session categories | Donut chart (max 5 slices) | Distribution |

---

## 5. AlumNow-Specific Recommendations

### 5.1 Navbar (currently `src/components/Navbar.tsx`)

**Current problems:**
- Solid white `bg-white` with `border-b` — no visual relationship with the about page's liquid-glass aesthetic
- Full-width bar feels dated vs. floating pill pattern
- No scroll responsiveness
- No active link indicator
- Mobile menu is a simple toggle with no animation

**Recommended upgrades:**

1. **Replace with floating liquid-glass pill:**

```tsx
// src/components/Navbar.tsx — upgraded
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, UserRound, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/browse", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4">
      <div
        className={`
          flex items-center justify-between w-full max-w-4xl
          px-5 py-2.5 rounded-full
          transition-all duration-300 ease-out
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/20"
              : "bg-white/10 backdrop-blur-xl border border-white/20"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          Alum<span className="text-accent">Now</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative px-4 py-1.5 text-sm font-medium rounded-full
                transition-colors duration-200
                ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserRound size={15} />
                {session.user.name ?? "Account"}
              </span>
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="text-sm text-muted-foreground hover:text-primary p-1.5"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-primary px-3 py-1.5">
                Log in
              </Link>
              <Link href="/register">
                <Button variant="accent" className="rounded-full text-sm px-5 py-1.5">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 text-primary md:hidden hover:bg-primary/5"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-4 right-4 mt-2 md:hidden">
          <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl p-4">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border/50" />
              {session?.user ? (
                <button
                  onClick={() => { signOut({ redirectTo: "/" }); setOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5"
                >
                  <LogOut size={15} /> Log out
                </button>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="flex-1 text-center text-sm font-semibold text-primary py-2 rounded-lg border border-border/50" onClick={() => setOpen(false)}>Log in</Link>
                  <Link href="/register" className="flex-1 text-center text-sm font-semibold text-white bg-primary py-2 rounded-lg" onClick={() => setOpen(false)}>Get started</Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
```

2. **Add the LiquidGlassFilter to the root layout** for use across the app

```tsx
// src/app/layout.tsx
import { LiquidGlassFilter } from "@/components/LiquidGlassFilter";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LiquidGlassFilter />
        {children}
      </body>
    </html>
  );
}
```

3. **Run the liquid-glass gate script** to check for Chromium (prevents Firefox's parse-but-don't-render bug):

```ts
// In layout or a script tag
if (CSS.supports("backdrop-filter", "url(#liquid-lens)")) {
  document.documentElement.setAttribute("data-liquid-glass", "");
}
```

### 5.2 Dashboard (currently `src/app/dashboard/page.tsx`)

**Current problems:**
- No stats/analytics row — jumps straight into booking list
- Two quick-action cards are good but can be extended
- No activity feed or recent mentor interactions
- Mobile not optimized
- No skeleton for the stats area

**Recommended layout:**

```
┌───────────────────────────────────────────────┐
│ Welcome, [Name]                               │
│ [email]                  [Avatar]            │
├───────────────────────────────────────────────┤
│ Stats Row (4 cards in a responsive grid)      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│ │Sessions│ │ Hours  │ │Upcoming│ │Ratings │  │
│ │  12    │ │  18.5  │ │   3    │ │  4.8★  │  │
│ │  +20%  │ │  +5%   │ │  this  │ │  from  │  │
│ │        │ │        │ │ week   │ │  10    │  │
│ └────────┘ └────────┘ └────────┘ └────────┘  │
├───────────────────────────────────────────────┤
│ Quick Actions (same 2-card grid, extend to 3) │
│ ┌─────────────────┐ ┌─────────────────┐      │
│ │ Find a mentor   │ │ My Bookings     │       │
│ └─────────────────┘ └─────────────────┘      │
├──────────────────┬────────────────────────────┤
│ Upcoming / Past  │ Recent Activity Feed       │
│ Tabs             │ • Booked with [mentor]     │
│ ┌ Booking Card 1 │   "2h ago"                │
│ └ + countdown    │ • Review left for [mentor] │
│ ┌ Booking Card 2 │   "1d ago"                │
│ └ + join btn     │ • Session completed w/    │
│                  │   [mentor] "3d ago"       │
└──────────────────┴────────────────────────────┘
```

**Stat cards implementation:**

```tsx
// Stats row — add above the quick actions
const stats = [
  { label: "Total Sessions", value: "12", delta: "+20%", trend: "up" },
  { label: "Hours Mentored", value: "18.5", delta: "+5%", trend: "up" },
  { label: "Upcoming", value: "3", delta: "This week", trend: "neutral" },
  { label: "Avg. Rating", value: "4.8", delta: "From 10 reviews", trend: "up" },
];

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <div key={stat.label} className="rounded-xl border border-border/80 bg-white p-4">
      <p className="text-xs text-muted-foreground">{stat.label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{stat.value}</p>
      <span className={`text-xs font-medium ${
        stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
      }`}>
        {stat.delta}
      </span>
    </div>
  ))}
</div>
```

**Activity feed implementation:**

```tsx
const activities = [
  { type: "booking", mentor: "Sarah Chen", time: "2h ago", action: "Booked a session" },
  { type: "review", mentor: "Mike Johnson", time: "1d ago", action: "Left a review" },
  { type: "completed", mentor: "Priya Patel", time: "3d ago", action: "Session completed" },
];

// In the dashboard, alongside the booking list
<div className="rounded-xl border border-border/80 bg-white p-5">
  <h3 className="text-sm font-semibold text-primary mb-4">Recent Activity</h3>
  <div className="space-y-4">
    {activities.map((activity, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <UserRound size={14} className="text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-primary">
            <span className="font-medium">{activity.action}</span> with{" "}
            <span className="font-medium">{activity.mentor}</span>
          </p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 5.3 About Page Liquid-Glass Button

The current button (`about/page.tsx:158-163`) uses the `.liquid-glass` class which is a basic blur. Upgrade to the full Tier 2 implementation:

```css
/* In globals.css — replace the existing .liquid-glass */
.liquid-glass {
  position: relative;
  isolation: isolate;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(180%) brightness(1.08);
  -webkit-backdrop-filter: blur(12px) saturate(180%) brightness(1.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2),
    inset 1px 0 0 rgba(255, 255, 255, 0.15),
    inset -1px 0 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
}

.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.08) 30%,
    transparent 60%
  );
  mix-blend-mode: screen;
  pointer-events: none;
}

.liquid-glass:hover {
  transform: translateY(-1px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(255, 255, 255, 0.25);
}
```

Then apply the SVG filter for the refractive lens effect (add `data-liquid-glass` attribute on `<html>` after a Chromium check):

```css
html[data-liquid-glass] .liquid-glass {
  backdrop-filter: blur(8px) url(#liquid-lens) saturate(180%) brightness(1.08);
}
```

---

## 6. Code Snippets & Techniques Worth Adopting

### 6.1 Container Query KPI Card

Self-contained card that adapts to its slot width without JS:

```tsx
// components/KpiCard.tsx
export function KpiCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div
      className="kpi-card rounded-xl border border-border/80 bg-white p-4"
      style={{ containerType: "inline-size", containerName: "kpi" }}
    >
      <p className="kpi-label text-xs text-muted-foreground">{label}</p>
      <p
        className="kpi-value mt-1 font-bold text-primary"
        style={{ fontSize: "clamp(1.25rem, 10cqi, 2rem)" }}
      >
        {value}
      </p>
      <span
        className={`kpi-delta mt-1 text-xs font-medium inline-flex items-center gap-1 ${
          trend === "up"
            ? "text-green-600"
            : trend === "down"
            ? "text-red-500"
            : "text-muted-foreground"
        }`}
      >
        {trend === "up" && "▲"}
        {trend === "down" && "▼"}
        {delta}
      </span>
    </div>
  );
}
```

### 6.2 Scroll-Responsive Header

```tsx
// hooks/useScrollState.ts
import { useEffect, useState } from "react";

export function useScrollState(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}
```

### 6.3 Intersection Observer for Video Background Pause

```tsx
// Performance improvement for video background
useEffect(() => {
  const video = document.querySelector("video");
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) video.play();
      else video.pause();
    },
    { threshold: 0.3 }
  );

  observer.observe(video);
  return () => observer.disconnect();
}, []);
```

### 6.4 Dashboard Skeleton Pattern

```tsx
// Better skeleton — mirrors the actual layout structure
<div className="space-y-6 animate-pulse">
  {/* Stats row skeleton */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="rounded-xl border border-border/80 bg-white p-4">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="mt-2 h-6 w-12 bg-muted rounded" />
        <div className="mt-1 h-3 w-20 bg-muted rounded" />
      </div>
    ))}
  </div>
  {/* Quick actions skeleton */}
  <div className="grid gap-4 sm:grid-cols-2">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-2xl border border-border/80 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## 7. Mobile Navigation Patterns

### 7.1 Bottom Tab Bar (Recommended for AlumNow mobile)

Used by: iOS, visionOS Tab Bar, many PWA dashboards.

**Pattern:**
- Fixed at bottom of screen
- 4–5 icon + label tabs
- Active state: filled icon + brand color
- Badge support for notifications

```tsx
// components/MobileNav.tsx
import { Home, Search, Calendar, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/browse", icon: Search, label: "Browse" },
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname.startsWith(href)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

### 7.2 Mobile Bottom Sheet Menu

Used by: Current about page pattern, but applicable globally.

**Pattern:**
- Triggered by hamburger in header
- Slides up from bottom or drops from top
- `backdrop-blur` overlay behind
- Staggered link animations (50ms delay per item)
- CTA button pinned at bottom

### 7.3 Safe Area Handling

```css
/* globals.css */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* For the navbar top */
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0px);
}
```

### 7.4 Touch Target Guidelines

| Element | Min Size | Notes |
|---------|----------|-------|
| Nav links | 44×44px | Apple HIG, WCAG |
| Bottom tab items | 48×48px | + label below |
| Mobile hamburger | 44×44px | Minimum tap target |
| Close/back buttons | 44×44px | Fitts's Law priority |

---

## 8. Key Resources & References

### Navbar Design
- Awwwards Best Navigation: https://www.awwwards.com/websites/navigation/
- shadcn Glassmorphism Navbar: https://www.shadcn.io/blocks/navbar-glassmorphism
- Apple-Style Glassmorphism CSS: https://codeshack.io/apple-style-glassmorphism-navbar-css/
- Jeremy Frank Glassmorphic Nav: https://jeremyfrank.dev/craft/glassmorphic-nav-bar/
- Premium Glassmorphic Navbar (Medium): https://medium.com/@prathamesharjunsawant/crafting-a-premium-glassmorphic-navigation-bar-f8fc2feb8c50

### Liquid Glass
- LeonardSEO/liquid-glass-react: https://github.com/LeonardSEO/liquid-glass-react
- lucaperullo/simple-liquid-glass: https://github.com/lucaperullo/simple-liquid-glass
- Lucky Graphics 2026 Guide: https://lucky.graphics/learn/liquid-glass-css-glassmorphism-tutorial/
- LogRocket Tutorial: https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/
- WebTricks: https://webtricks.dev/blog/liquid-glass-css
- CSS Ladder Approach: https://dimonb19a.hashnode.dev/liquid-glass-needs-a-ladder
- Frontend Masters: https://frontendmasters.com/blog/liquid-glass-on-the-web/

### Dashboard Design
- Muzli 2026 Dashboard Examples: https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/
- Setproduct UI Guide: https://www.setproduct.com/blog/dashboard-ui-design
- Lazarev Agency Analysis: https://www.lazarev.agency/articles/dashboard-ui-examples
- Saas Dashboard UX Patterns: https://www.gitnexa.com/blogs/saas-dashboard-ux-patterns
- shadcnblocks Dashboards: https://www.shadcnblocks.com/ (dashboard9, dashboard10, dashboard12)
- Admin Dashboard React 2026: https://aftershocknetwork.com/answers/how-to-build-admin-dashboard-react/
- shadcn/ui Admin Dashboard 2026: https://dev.to/ausrobdev/how-to-build-a-modern-admin-dashboard-with-shadcnui-in-2026-3477
- TanStack Start Dashboard: https://github.com/Kiranism/tanstack-start-dashboard
- Salt Design System — Analytical Dashboard: https://www.saltdesignsystem.com/salt/patterns/analytical-dashboard
- PatternFly Dashboard: https://www.patternfly.org/patterns/dashboard/design-guidelines/
- Saas Dashboard Design 2026: https://www.sanjaydey.com/saas-dashboard-design-users-love/

### Mobile Patterns
- Apple HIG — Navigation Bars: https://developer.apple.com/design/human-interface-guidelines/navigation-bars
- iOS Safe Area: https://developer.apple.com/documentation/uikit/uiview/positioning_content_relative_to_the_safe_area

### Video Backgrounds
- Shopify Video Background Guide: https://www.shopify.com/in/blog/background-video-css
- LogRocket Video Optimization: https://blog.logrocket.com/optimizing-video-backgrounds-css-javascript/
