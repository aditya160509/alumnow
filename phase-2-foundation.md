# AlumNow — Phase 2: Landing Page + Auth Polish + Alumni Self-Apply

**Goal:** Complete the auth experience (forgot/reset password, auto-verify animation, Google OAuth), build the full landing page with all sections, and add a demo alumni self-apply flow.

**Complexity:** Medium
**Estimated files:** ~25 across 12 directories
**Dependencies:** Phase 1 (database, auth, layout, seed data)
**Time estimate:** 5-7 hours for an experienced developer

---

## 0. Prerequisites

Phase 1 must be complete: Prisma schema migrated, auth configured, layout with Navbar/Footer in place, seed data loaded, and all utilities working.

No additional npm packages needed beyond Phase 1 — everything uses existing dependencies.

---

## 1. Landing Page Components

All components go in `src/app/` (as Next.js route components or shared components in `src/components/`).

### 1.1 `PublicNav` — Landing-specific top nav

**File:** `src/app/_components/PublicNav.tsx`

A simplified nav for the landing page only. Hidden once the user logs in (the main Navbar takes over).

```
Props: none (self-contained)
Renders:
├── Logo (left) — "AlumNow" text in Inter semi-bold, --color-primary, links to /
├── Nav links (center, desktop only) — "How It Works" (#how-it-works), "Testimonials" (#testimonials), "About" (/about)
└── Right side — "Log In" secondary button -> /login, "Sign Up" primary button -> /register
```

**States:**
- **Desktop:** Full row with links + two buttons. `position: fixed`, `top: 0`, `z-index: 50`, `bg-white/90 backdrop-blur-md` with `border-bottom: 1px solid var(--color-border)`
- **Mobile:** Same two buttons, nav links collapsed under hamburger. Use `Sheet` from shadcn/ui for the drawer (same pattern as Navbar but simplified).
- **Scroll-state:** On scroll > 80px, swap `bg-white/90` to `bg-white shadow-sm` (use `useEffect` scroll listener).
- **Active link:** Scrollspy — link gets `text-primary` + `border-bottom: 2px solid var(--color-primary)` when scrolled to that section.

**Edge cases:**
- Window resize: re-check scroll position on resize
- Skip `scroll-behavior: smooth` on reduced-motion preference

### 1.2 `HeroSection` — Main hero

**File:** `src/app/_components/HeroSection.tsx`

```
Props: none
Renders:
├── Left column (2/3 width desktop, full width mobile)
│   ├── H1: "Connect with JBCN Alumni Who've Been Where You're Going"
│   ├── P (subtext): "Browse 150+ verified alumni from top universities worldwide.
│   │   Book 1:1 sessions for career guidance, university applications, and subject mentoring."
│   └── CTA row:
│       ├── Button "Browse Alumni" -> /browse (primary, filled, large)
│       └── Button "Learn More" -> #how-it-works (outline, large)
└── Right column (1/3 desktop, hidden mobile) — illustration
    ├── SVG illustration (static, inline): abstract tree graph with small avatar circles
    │   representing students connected to alumni at various universities
    │   └── Colours: primary (#1B3A6B), accent (#F5A623), muted-foreground
    │   └── Design: minimalist line-art style, 4-6 nodes, dashed connection lines
    └── Decorative: subtle gradient blur circle behind illustration (CSS, `filter: blur(80px)`)
```

**States:**
- **Loading:** N/A (static content, no data fetch)
- **Empty:** N/A
- **Mobile:** Stack vertically, illustration hidden, H1 runs max 3 lines, subtext max 4 lines
- **Desktop:**
  - H1: `text-4xl md:text-5xl lg:text-6xl`, `leading-tight`, `font-semibold`
  - Subtext: `text-lg md:text-xl text-muted-foreground`, `max-w-prose`
  - Illustration: fixed 400x400 area, SVG scales proportionally
- **Design tokens:**
  - Background: `bg-gradient-to-b from-primary/5 via-background to-background`
  - Padding: `pt-24 pb-16 md:pt-32 md:pb-24` (account for fixed nav)
  - CTA gap: `gap-4`

**Edge cases:**
- Very long university names in SVG (picsum-style): clip with `text-overflow: ellipsis` on SVG text
- Reduced motion: no parallax, no floating animation on SVG

### 1.3 `HowItWorksCard` + `HowItWorksSection`

**File:** `src/app/_components/HowItWorksCard.tsx`
**File:** `src/app/_components/HowItWorksSection.tsx`

```
HowItWorksCard Props:
  icon: LucideIcon       # e.g. Search, CalendarCheck, Video
  title: string          # e.g. "Browse Alumni"
  description: string    # e.g. "Filter by university, course, or country..."
  stepNumber: number     # 1, 2, or 3

Renders:
├── Step number badge: circle (48x48), bg-primary, text-white, font-semibold
├── Icon: 32x32, text-primary
├── Title: h3, font-semibold, text-lg
└── Description: p, text-muted-foreground, text-sm

HowItWorksSection Props: none (self-contained)

Renders:
├── Section header
│   ├── Badge: "How It Works" (small pill, bg-primary/10 text-primary text-xs uppercase tracking-wide)
│   ├── H2: "Three Steps to Your Future"
│   └── P: "Connect with alumni in minutes, not weeks."
└── 3x HowItWorksCard in a responsive row
    ├── Step 1: Search — "Search 150+ verified JBCN alumni" (Search icon)
    ├── Step 2: Book — "Pick a time that works for you" (CalendarCheck icon)
    └── Step 3: Connect — "Meet online and get real advice" (Video icon)
```

**States:**
- **Desktop:** 3 cards in a row, `grid grid-cols-1 md:grid-cols-3 gap-8`, centered text
- **Mobile:** Stacked vertically, `max-w-sm mx-auto`, centered text each card
- **Hover:** Card lifts 2px (`hover:-translate-y-1 transition-transform`), icon shifts to accent color
- **Section:** `py-16 md:py-24` padding, `bg-muted/30` background (alternating with hero/testimonials)

**Edge cases:**
- Reduced motion: disable hover lift animation (`prefers-reduced-motion: reduce` via `useMediaQuery`)
- Card text overflow: `overflow-hidden` + `line-clamp-3` on description

### 1.4 `StatsBar` — Animated counters

**File:** `src/app/_components/StatsBar.tsx`

Fetches data from `GET /api/public/stats` (see Section 6 below) and animates counting up.

```
Props: none (self-contained)

Renders:
├── Stat items in a row (desktop) or 2x2 grid (mobile)
│   ├── Item 1: count "150+" (actual: stats.alumniCount), label "Verified Alumni"
│   ├── Item 2: count "47+" (actual: stats.sessionsCompleted), label "Sessions Completed"
│   ├── Item 3: count "10+" (actual: stats.universitiesCount), label "Universities"
│   └── Item 4: count "4.8" (actual: stats.avgRating), label "Average Rating"
└── Background: bg-primary, text-white
```

**States & behaviour:**
- **Loading:** Show skeleton bars (same width as counters, `animate-pulse`) — 4 grey rectangles in the grid
- **Error (fetch fails):** Show fallback text "Loading stats..." or the last cached values (in-memory, not persisted)
- **Animation sequence:**
  1. Fetch stats on mount via `fetch("/api/public/stats")` — client component
  2. Display final value immediately, then animate from 0 to final using `requestAnimationFrame`
  3. Duration: 1.5s per counter, `ease-out` easing
  4. Stagger: each counter starts 200ms after the previous
  5. `Intl.NumberFormat` for comma formatting (e.g. "1,234" for alumni count)
- **Empty (zero stats):** Display "0" as final value — no special handling needed
- **Refetch:** On `visibilitychange` (tab becomes visible again), refetch stats in background

**Edge cases:**
- Tab hidden during animation: pause counter, resume on next `requestAnimationFrame`
- Very fast tab switch: abort previous fetch via `AbortController`
- `stats.avgRating` could be `null` — fall back to `"4.8"` as hardcoded demo value

### 1.5 `TestimonialCard` + `TestimonialsSection`

**File:** `src/app/_components/TestimonialCard.tsx`
**File:** `src/app/_components/TestimonialsSection.tsx`
**File:** `src/data/testimonials.json` (see Section 2)

```
TestimonialCard Props:
  quote: string
  authorName: string
  authorRole: string       # e.g. "Student, A2" or "Alumnus, IIT Bombay"
  avatarUrl?: string       # Optional — fallback to initials avatar
  rating: number           # 1-5

Renders:
├── Quote: "..." — italic, text-base, leading-relaxed, max 200 chars
├── Rating: 5 star icons (Star, filled accent), inline
├── Avatar: 48x48 circle, either image or initials (first letters of authorName)
└── Author info: name (font-semibold) + role (text-sm text-muted-foreground)

TestimonialsSection Props: none (config-driven, reads testimonials.json)

Renders:
├── Section header (same pattern as HowItWorksSection)
│   ├── Badge: "Testimonials"
│   ├── H2: "What Our Community Says"
│   └── P: "Real stories from real connections."
├── 3x TestimonialCard in a responsive grid
│   (desktop: 3 cols, tablet: 2 cols, mobile: 1 col)
└── Decorative: subtle accent line above section header (4px, 60px wide, accent color)
```

**States:**
- **Loading:** N/A (static config data, no async fetch)
- **Empty (no testimonials in JSON):** Show 3 hardcoded fallback testimonials inline
- **Hover:** Card subtle border change (`hover:border-primary/30`)
- **Mobile:** Single column, card full width, `mx-4`
- **Long quote:** `line-clamp-4` with gradient fade at bottom if overflow

**Design tokens:**
- Card: `bg-card`, `rounded-xl`, `border border-border`, `p-6`, `shadow-sm`
- Star icons: 16x16, `fill-accent text-accent`
- Empty star: `fill-muted text-muted`
- Avatar initials: `bg-primary/10 text-primary font-semibold`

### 1.6 `MarkdownContent` — MD renderer

**File:** `src/app/_components/MarkdownContent.tsx`

Renders `.md` files as HTML. Used by the About page (Section 3).

```
Props:
  content: string          # Raw markdown string

Renders:
└── div.prose — rendered HTML via react-markdown

Dependencies:
  npm install react-markdown remark-gfm
```

No custom styling — rely on Tailwind Typography (`prose prose-gray max-w-none`). Install:

```bash
npm install react-markdown remark-gfm
npm install -D @tailwindcss/typography
```

Add to `tailwind.config.ts`:
```ts
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
```

**States:**
- **Loading:** N/A (content is passed as prop, already loaded)
- **Empty:** Render nothing (just `null`)
- **Error:** If `react-markdown` throws, render `<p className="text-destructive">Failed to render content</p>`

---

## 2. Content Files

### 2.1 `testimonials.json`

**File:** `src/data/testimonials.json`

```json
[
  {
    "id": "1",
    "quote": "My session with Priya helped me narrow down my university shortlist from 12 to 4. She gave me real insights about campus life at Cambridge that no website could.",
    "authorName": "Ananya Sharma",
    "authorRole": "Student, A2",
    "rating": 5
  },
  {
    "id": "2",
    "quote": "As an alumnus, it's incredibly fulfilling to guide students from my old school. The platform makes it effortless to offer help on my own schedule.",
    "authorName": "Arjun Mehta",
    "authorRole": "Alumnus, IIT Bombay",
    "rating": 5
  },
  {
    "id": "3",
    "quote": "I was nervous about applying to US universities. Rohan's advice on essays and interviews was a game-changer. Got into my dream school!",
    "authorName": "Ishita Reddy",
    "authorRole": "Student, AS Level",
    "rating": 5
  }
]
```

At least 3 entries. All with ratings 4-5 (demo positivity). Each quote 30-60 words. Use names from the seeded alumni and plausible student names.

### 2.2 `about.md`

**File:** `src/content/about.md`

```markdown
## About AlumNow

AlumNow is a student-alumni marketplace built exclusively for JBCN International School. It connects current students with verified alumni who have graduated from JBCN and are now studying or working at top universities worldwide.

### Why we built this

Choosing the right university and course is one of the biggest decisions a student makes. While brochures and rankings provide data, nothing compares to hearing directly from someone who has walked the path. AlumNow makes those connections possible with just a few clicks.

### How it works

1. **Browse** — Search our network of verified JBCN alumni by university, course, country, or area of expertise.
2. **Book** — Choose an available time slot and session type (15-min quick chat, 30-min deep dive, or group session).
3. **Connect** — Meet online via Google Meet for a real conversation with someone who has been exactly where you are.

### Our values

- **Authenticity** — Every alumnus is verified as a former JBCN student before they can be booked.
- **Accessibility** — Sessions are affordable and designed to fit around school schedules.
- **Community** — We believe in the power of the JBCN network to support the next generation.
```

### 2.3 `founders.md`

**File:** `src/content/founders.md`

```markdown
## From the Founders

AlumNow started as a simple observation: JBCN has produced incredible alumni — doctors, engineers, entrepreneurs, researchers — but there was no structured way for current students to reach them.

We built AlumNow to close that gap. Every feature, from the swipe deck to the booking system, was designed with one question in mind: "Does this make it easier for a student to get the guidance they need?"

This is just the beginning. We're constantly adding more alumni, more session types, and more ways to connect.

*— The AlumNow Team*
```

---

## 3. Pages

### 3.1 Landing Page — replaces `src/app/page.tsx`

The current placeholder hero is replaced with a full scrollable landing page:

```
PublicNav (fixed top)
├── HeroSection (full viewport height minus nav)
├── HowItWorksSection (#how-it-works) — id for scrollspy + anchor links
├── StatsBar (full-width primary background)
├── TestimonialsSection (#testimonials)
└── Footer (from Phase 1 — already exists)
```

**Mobile behaviour:**
- All sections stack vertically, full width
- StatsBar switches to 2x2 grid (each stat centered)
- Testimonials to single column
- Hero illustration hidden, full-width text

**Edge cases:**
- Scrolljacking: none — natural scroll, `scroll-behavior: smooth` on anchor links
- Nav scroll-spy: IntersectionObserver observing each section, updates active link in PublicNav
- Footer is the Phase 1 Footer (already exists, shared between landing and internal pages)

### 3.2 About Page

**File:** `src/app/about/page.tsx`

```
Layout:
├── Simple header: H1 "About AlumNow" + breadcrumb "Home > About"
├── MarkdownContent with about.md content
├── Separator (hr)
└── MarkdownContent with founders.md content
```

Uses `fs` to read markdown files? No — for Next.js App Router, import markdown as raw string via a loader or embed directly. Simplest approach: store the markdown in a `.ts` file as a template string, or use `import` with `?raw` syntax.

**Better approach:** Read at build time via a simple loader or embed content directly. For demo simplicity, import the `.md` files:

```ts
// src/app/about/page.tsx
import fs from "fs";
import path from "path";

async function AboutPage() {
  const aboutPath = path.join(process.cwd(), "src/content/about.md");
  const foundersPath = path.join(process.cwd(), "src/content/founders.md");
  const aboutContent = fs.readFileSync(aboutPath, "utf-8");
  const foundersContent = fs.readFileSync(foundersPath, "utf-8");
  // ...
}
```

**States:**
- **Error (file not found):** Show fallback "Content coming soon" paragraph
- **Loading:** N/A (server component, synchronous read)

### 3.3 Privacy & Terms Pages (placeholders)

**File:** `src/app/privacy/page.tsx`
**File:** `src/app/terms/page.tsx`

Minimal placeholder pages with a consistent layout:

```
Header: H1 "Privacy Policy" / "Terms of Use"
Breadcrumb: "Home > Privacy" / "Home > Terms"
Content: "<placeholder-text>" with:
  ├── Last updated date: "July 2026"
  ├── 3-4 section placeholders with headings (e.g. "Information We Collect", "How We Use It")
  └── Note at top: "This is a placeholder. A full policy will be drafted before production launch."
```

**Design:** Same container width as About page (`max-w-3xl mx-auto py-12`), consistent header styles.

**Edge cases:** N/A — these are placeholders, no interactivity.

---

## 4. Auth Extensions

### 4.1 Forgot Password Action

**File:** Extend `src/actions/auth.actions.ts`

```ts
export async function forgotPassword(input: { email: string }): Promise<ApiResponse<{ message: string }>>
```

**Flow:**
1. Validate email with `forgotPasswordSchema` (Zod: `z.object({ email: z.string().email() })`)
2. Check if user exists with that email
   - If yes: generate crypto token, store in `VerificationToken` table with 1hr expiry, call `email.sendPasswordResetEmail(user.email, token)`
   - If no: still return success (prevent email enumeration — security best practice)
3. Return `{ success: true, data: { message: "If an account exists, a reset link has been sent." } }`

**Edge cases:**
- Rate-limited: apply same rate limiter as login (3 per 15 min per IP) to prevent abuse
- User with Google OAuth only (no password): still send reset link — they can set a password on reset page
- Duplicate requests: check for existing unexpired token before creating new one

**Production note:** Demo uses `console.log` email — the "sent" animation is instant. Replace with async email queue in production.

### 4.2 Reset Password Action

**File:** Extend `src/actions/auth.actions.ts`

```ts
export async function resetPassword(input: { token: string; password: string; confirmPassword: string }): Promise<ApiResponse<{ message: string }>>
```

**Flow:**
1. Validate with `resetPasswordSchema` (Zod: `z.object({ token: z.string(), password: z.string().min(8), confirmPassword: z.string() }).refine(...)`)
2. Find `VerificationToken` by token value
   - If not found: return error `{ success: false, error: "Invalid or expired reset link" }`
   - If expired: return error `{ success: false, error: "Reset link has expired. Please request a new one." }`
3. Find user by identifier (email) on the token
4. Update user's `passwordHash` with new bcrypt hash
5. Delete all tokens for this identifier
6. Return success + message "Password reset successfully. Redirecting to login..."

**Edge cases:**
- Token reuse: token is single-use (deleted after reset)
- Same password as old: allowed (no "cannot reuse" check for demo simplicity)
- Expired token page: show link "Request a new reset link" -> `/forgot-password`

### 4.3 Forgot & Reset Password Pages

**Files already exist** from Phase 1 (`src/app/forgot-password/page.tsx`, `src/app/reset-password/page.tsx`).

**Phase 2 enhancements:**
- Add `forgotPassword` action call to the forgot password page
- Add `resetPassword` action call to the reset password page
- Both use `useActionState` pattern (Next.js 14) or direct `startTransition` + `toast`
- Reset page reads `token` from `searchParams` and passes it to action
- Error display: inline red text for field errors, toast for server errors

### 4.4 Auto-Verify Animation (Signup)

Already specified in Phase 1 but the animation is refined here. The signup form in `src/app/register/page.tsx` shows this sequence on submit:

```
Timeline (2.7s total):
├── t=0ms:    Button changes to spinner + "Creating your account..." (800ms)
│             Form fields disabled, button disabled
├── t=800ms:  Transition to "Verifying your email..."
│             Show pulsing amber dot (CSS animation: border + glow, 1s cycle)
├── t=2000ms: Green checkmark appears (scale: 0->1 spring animation, 300ms)
│             "Email verified!" text in green
├── t=2300ms: "Redirecting to Browse..." (400ms)
└── t=2700ms: router.push("/browse")
```

**Implementation approach:** Use a state machine with `useState` or `useReducer`:
```ts
type SignupStep = "idle" | "creating" | "verifying" | "verified" | "redirecting";
```

Each step transitions via `setTimeout` or chained promises. Cancel all timers on unmount via `useRef` + cleanup.

**Edge cases:**
- Page navigation during animation: cancel timeout via ref
- Form submission error: skip animation, show error toast immediately
- Duplicate email error (Prisma unique constraint): show toast "Email already registered. Try logging in." — no animation

### 4.5 Google OAuth Complete Callback

**File:** `src/app/api/auth/callback/google/route.ts` (Next.js App Router)

The Google OAuth button calls `signIn("google")` which redirects to Google. On callback:

1. NextAuth handles token exchange automatically
2. Post-signup: if user signed up via Google, the `account` table stores their Google credentials
3. First-time Google sign-in: NextAuth creates a `User` record with `googleOauthId` set
4. On subsequent sign-ins: NextAuth matches by `googleOauthId` and logs user in

**Post-OAuth redirect:** After successful Google auth, redirect to `/browse` (or the page the user was trying to access).

**Edge cases:**
- Google email already exists as a password account: NextAuth v5 handles this via `adapter.linkAccount` — no duplicate
- Google OAuth cancelled by user: redirect back to `/login` with no error message (NextAuth default)
- No Google client ID in env: button shows "Google SSO unavailable" (disabled) with a tooltip "Configure in production"

---

## 5. Alumni Self-Apply Flow (Demo)

### 5.1 Overview

A demo-only feature that lets a user apply as an alumnus. In production this would involve manual verification of JBCN graduation. In demo, it auto-approves with a realistic animation sequence — mirroring the student signup auto-verify pattern.

### 5.2 Route & Navigation

**New route:** `/apply` — accessible from the landing page PublicNav ("Are you an alumnus? Apply here" link under the main CTAs) and from the login page ("Want to offer mentorship? Apply as an alumnus").

**Navigation links to add:**
- Landing page PublicNav: small text link below the two CTA buttons — `"Are you an alumnus? Apply to mentor →"`
- Login page: text below the login form — `"Want to share your experience? Apply as an alumnus"` linking to `/apply`

### 5.3 Application Form — `src/app/apply/page.tsx`

A single-page form with the following fields:

```
Full Name (text input, required)
  └─ placeholder: "Enter your full name"
  └─ validation: min 2 chars, max 100 chars

Email (email input, required)
  └─ placeholder: "you@example.com"
  └─ validation: valid email format
  └─ checked against existing User table — if email exists, show inline error "An account with this email already exists"

Phone (tel input, required)
  └─ placeholder: "+91 98765 43210"
  └─ validation: Indian mobile format (10 digits) or international format

Password (password input, required)
  └─ placeholder: "Create a password (min 8 characters)"
  └─ validation: min 8 chars, with toggle visibility

Confirm Password (password input, required)
  └─ validation: must match password

University Name (text input, required)
  └─ placeholder: "e.g. Indian Institute of Technology, Bombay"
  └─ validation: min 2 chars

Course (text input, required)
  └─ placeholder: "e.g. B.Tech in Computer Science"
  └─ validation: min 2 chars

Graduation Year (number input, required)
  └─ placeholder: "e.g. 2023"
  └─ validation: 2015-2026 (reasonable range for JBCN alumni)

Country (text input, required)
  └─ placeholder: "e.g. India, United Kingdom"
  └─ validation: min 2 chars

Current Study Level (select, required)
  └─ Options: "Undergraduate", "Postgraduate", "Working Professional"
  └─ Default: "Undergraduate"

Bio (textarea, optional)
  └─ placeholder: "Tell us about your journey after JBCN..."
  └─ max: 300 chars with character counter
  └─ rows: 4

Languages (comma-separated input, optional)
  └─ placeholder: "e.g. English, Hindi, Gujarati"
  └─ hint below: "Separate with commas"
  └─ stored as JSON array string: split by comma, trim each

LinkedIn URL (url input, optional)
  └─ placeholder: "https://linkedin.com/in/your-profile"
  └─ validation: URL format (not strict — any valid URL accepted)

Terms of Service (checkbox, required)
  └─ Label: "I confirm I am a former student of JBCN International School and agree to the Terms of Service"
```

**Form layout:** Two columns on desktop (info left, details right), single column on mobile. Styled consistently with the student registration form.

**Validation:** Use the same Zod pattern — define `alumniApplySchema` in `src/lib/validation.ts`:

```ts
export const alumniApplySchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  confirmPassword: z.string(),
  universityName: z.string().min(2).max(200),
  course: z.string().min(2).max(200),
  graduationYear: z.number().int().min(2015).max(2026),
  country: z.string().min(2).max(100),
  currentStudyLevel: z.enum(["undergraduate", "postgraduate", "working_professional"]),
  bio: z.string().max(300).optional(),
  languages: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  tosAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

### 5.4 Server Action — `alumni.apply`

**File:** Extend `src/actions/auth.actions.ts` (or create `src/actions/alumni.actions.ts`)

```ts
export async function applyAsAlumni(input: unknown): Promise<ApiResponse<{ redirectTo: string }>>
```

**Flow:**
1. Validate input with `alumniApplySchema`
2. Rate-limited: 3 applications per 15 min per IP (same limiter)
3. Check email uniqueness — if user exists with this email, return error
4. Hash password with bcrypt (12 rounds)
5. Create user in a transaction:
   - `User` with `role: "alumnus"`, `emailVerifiedAt: new Date()`
   - `AlumniProfile` with all fields, `verificationStatus: "approved"` (demo — always approved), `avgResponseTimeHours: 24` (default)
   - 4 default session type offerings: `call_30` (₹299), `call_45` (₹399), `call_60` (₹499), `group_40` (₹999)
   - 5 default availability slots (Mon-Fri, 10:00-17:00, 1-hour blocks, recurring)
6. Auto-login: call `signIn("credentials", { email, password, redirect: false })`
7. Return `{ success: true, data: { redirectTo: "/alumni/dashboard" } }`
8. Log email: `email.sendAlumniWelcome(user.email, fullName)`

**Edge cases:**
- Email taken: return error "An account with this email already exists"
- Network error during hash: caught by try/catch, return generic error
- Prisma transaction failure: rollback entire transaction (no partial user/profile)

### 5.5 Auto-Approval Animation

Same pattern as the student signup auto-verify, but with alumni-specific copy:

```
Timeline (3.0s total):
├── t=0ms:    Button changes to spinner + "Creating your profile..." (800ms)
│             Form fields disabled, button disabled
├── t=800ms:  Transition to "Verifying your JBCN alumni status..."
│             Show pulsing amber dot animation
├── t=2000ms: Green checkmark appears (scale: 0->1 spring)
│             "Profile approved!" text in green
├── t=2600ms: "Redirecting to your dashboard..." (400ms)
└── t=3000ms: router.push("/alumni/dashboard")
```

### 5.6 Alumni Dashboard Link (Post-Apply)

After auto-approval, the user lands on `/alumni/dashboard` — a placeholder page showing:
- "Welcome, {name}! Your profile is live." with a green success banner
- "You're now visible to students browsing alumni." — explanatory text
- Quick links: "View your profile", "Manage availability" (linked to Phase 7)
- "Browse upcoming sessions" — if any bookings exist (none initially)

**File:** `src/app/alumni/dashboard/page.tsx`

This is a simple placeholder — Phase 7 builds the full alumni dashboard.

### 5.7 Profile Photo

Since no real upload is available, seeded alumni get `https://picsum.photos/seed/{name}/400/400` as their `profilePhotoUrl`. New self-applied alumni get the same treatment (a deterministic picsum URL based on their name hash).

Set this in the server action:
```ts
const nameSlug = fullName.toLowerCase().replace(/\s+/g, "-");
const profilePhotoUrl = `https://picsum.photos/seed/${nameSlug}/400/400`;
```

This ensures every profile has a unique, consistent placeholder photo without file uploads.

---

## 6. Public Stats API Route

**File:** `src/app/api/public/stats/route.ts`

A GET endpoint that returns platform statistics for the landing page StatsBar.

```ts
// GET /api/public/stats
export async function GET(): Promise<Response> {
  const stats = await prisma.platformStat.findMany();
  const alumniCount = stats.find(s => s.key === "alumni_count")?.value ?? 150;
  const sessionsCompleted = stats.find(s => s.key === "sessions_completed")?.value ?? 47;
  const universitiesCount = stats.find(s => s.key === "universities_count")?.value ?? 10;

  // Compute average rating across all approved alumni
  const ratingAgg = await prisma.alumniProfile.aggregate({
    _avg: { ratingAvg: true },
    where: { verificationStatus: "approved" },
  });
  const avgRating = ratingAgg._avg.ratingAvg ?? 4.8;

  return Response.json({
    alumniCount,
    sessionsCompleted,
    universitiesCount,
    avgRating: +avgRating.toFixed(1),
  });
}
```

**Headers:** No auth required (public endpoint). Add `Cache-Control: public, max-age=300, stale-while-revalidate=60` for 5-min caching.

**Error state:** If `PlatformStat` table is empty (shouldn't happen due to seed), fall back to hardcoded demo values: 150 alumni, 47 sessions, 10 universities, 4.8 rating.

---

## 7. What Works After Phase 2

- Complete auth: signup, login, logout, forgot password, reset password, Google OAuth
- Auto-verify animation on signup (2.7s feel-real sequence)
- Full landing page: Hero → How It Works → Stats (live from API) → Testimonials → Footer
- Stats fetched from `PlatformStat` table (cached 5 min, admin-editable)
- Testimonials driven by `data/testimonials.json` config array
- About page renders markdown from `content/about.md` + `content/founders.md`
- Privacy & Terms placeholder pages
- Mobile-responsive layout pass for all landing sections
- PublicNav with scroll spy, mobile hamburger, scroll-state styling
- Alumni self-apply flow: signup form, auto-approve animation (3.0s), immediate dashboard redirect
- New alumni appear in browse immediately (pre-seeded + newly applied)
- 4 default session offerings + 5 availability slots created automatically for new alumni
- Admin sees newly applied alumni in their list (Phase 6 for full CRUD)
- Fixed PublicNav on scroll (80px threshold)
- All form states: loading, error, validation, success animations
- No external dependencies for any of the above (fully self-contained demo)

---

## 8. Verification Checklist

### Landing Page
- [ ] `/` renders full landing page with all sections
- [ ] Hero section: headline, subtext, two CTA buttons, illustration visible on desktop
- [ ] How It Works: 3-step section with icons, step numbers, descriptions
- [ ] StatsBar: fetches from `/api/public/stats`, counters animate from 0 to final value
- [ ] StatsBar: shows skeleton loading state while fetching
- [ ] StatsBar: fallback values used if API fails
- [ ] Testimonials: 3 cards from config JSON, star ratings, avatar initials fallback
- [ ] PublicNav: fixed top, logo + links + two buttons, scroll spy highlights active section
- [ ] PublicNav: switches from transparent to white background after 80px scroll
- [ ] PublicNav: hamburger drawer on mobile, sheet slides in from right
- [ ] All sections stack vertically on mobile, no horizontal scroll
- [ ] StatsBar switches to 2x2 on mobile
- [ ] Testimonials single column on mobile
- [ ] Hero illustration hidden on mobile

### Auth
- [ ] Forgot password page: email input, submits to action, shows success message
- [ ] Forgot password: rate-limited (3 per 15 min)
- [ ] Forgot password: returns same message whether email exists or not (no enumeration)
- [ ] Reset password page: reads token from URL, shows password + confirm inputs
- [ ] Reset password: invalid token shows error message with "Request new link"
- [ ] Reset password: expired token shows error message
- [ ] Reset password: success message + redirect to login
- [ ] Google OAuth button renders on login page
- [ ] Google OAuth: shows "Google SSO unavailable" when no client ID configured
- [ ] Signup auto-verify animation plays full 2.7s sequence
- [ ] [ ] Auto-verify: cancels timers on unmount
- [ ] Auto-verify: skips animation on form error, shows toast instead

### Alumni Self-Apply
- [ ] `/apply` page renders with all form fields
- [ ] Form validation works: empty fields show errors, email format checked, password match checked
- [ ] Form submits successfully with valid data
- [ ] Auto-approval animation plays full 3.0s sequence
- [ ] After animation, redirects to `/alumni/dashboard`
- [ ] New alumni profile has 4 default session offerings + 5 availability slots
- [ ] Profile photo URL is set to picsum placeholder
- [ ] Logged-in email console log shows welcome email
- [ ] Alumni can log in with their new credentials
- [ ] Email uniqueness: duplicate email shows error
- [ ] Rate limiting: 3 applications per 15 min per IP
- [ ] Navigation links to `/apply` exist on landing page and login page

### Pages
- [ ] `/about` renders both about.md and founders.md content
- [ ] `/about` shows fallback if markdown file is missing
- [ ] `/privacy` renders placeholder with sections
- [ ] `/terms` renders placeholder with sections
- [ ] `react-markdown` renders markdown with correct heading/paragraph styles
- [ ] Tailwind prose styles applied to markdown content

### API
- [ ] `GET /api/public/stats` returns JSON with alumniCount, sessionsCompleted, universitiesCount, avgRating
- [ ] API returns fallback values when PlatformStat table is empty
- [ ] API has Cache-Control header (5 min)

### Mobile & Responsive
- [ ] Landing page: no horizontal scroll at 375px width
- [ ] All section headings scale down appropriately on mobile
- [ ] Form fields full width on mobile
- [ ] PublicNav hamburger visible on mobile
- [ ] Sheet drawer opens/closes smoothly

---

## 9. What's NOT in Phase 2 (deferred to later phases)

| Feature | Phase | Reason |
|---------|-------|--------|
| Browse page with grid/swipe + filters | Phase 3 | Core product feature, needs Phase 2 landing page complete |
| Alumni profile page | Phase 4 | Needs browse to link from |
| Booking flow + payment | Phase 5 | Needs profiles |
| Student dashboard | Phase 5 | Needs bookings |
| Admin CRUD pages | Phase 6 | Needs data volume |
| Alumni account management (profile edit, availability, pricing) | Phase 7 | Nice-to-have, last |
| Real file upload for profile photos | Phase 7 | Uses picsum placeholders in demo |
| Concurrency-safe booking | Prod | Skipped in demo |
| Real email delivery | Prod | Uses console.log |

---

## 10. File Manifest (Complete Phase 2 File List)

```
src/
├── app/
│   ├── page.tsx                           # (replace) Full landing page
│   ├── layout.tsx                         # (no change) Root layout from Phase 1
│   ├── _components/
│   │   ├── PublicNav.tsx                  # Landing-specific fixed nav
│   │   ├── HeroSection.tsx                # Hero with 2 CTAs + inline SVG illustration
│   │   ├── HowItWorksCard.tsx             # Single step card (reusable)
│   │   ├── HowItWorksSection.tsx          # 3x HowItWorksCard section
│   │   ├── StatsBar.tsx                   # Counter animation with /api/public/stats fetch
│   │   ├── TestimonialCard.tsx            # Config-driven testimonial card
│   │   ├── TestimonialsSection.tsx        # 3x TestimonialCard section
│   │   └── MarkdownContent.tsx            # react-markdown wrapper
│   ├── about/
│   │   └── page.tsx                       # About Us + Founders Note
│   ├── privacy/
│   │   └── page.tsx                       # Placeholder privacy policy
│   ├── terms/
│   │   └── page.tsx                       # Placeholder terms of use
│   ├── apply/
│   │   └── page.tsx                       # Alumni self-apply form
│   ├── alumni/
│   │   └── dashboard/
│   │       └── page.tsx                   # Post-apply placeholder dashboard
│   ├── forgot-password/
│   │   └── page.tsx                       # (enhance) Add action call + error states
│   ├── reset-password/
│   │   └── page.tsx                       # (enhance) Add action call + token handling
│   ├── register/
│   │   └── page.tsx                       # (enhance) Add auto-verify state machine
│   └── api/
│       └── public/
│           └── stats/
│               └── route.ts              # GET public stats endpoint
├── actions/
│   ├── auth.actions.ts                    # (extend) Add forgotPassword, resetPassword, applyAsAlumni
│   └── alumni.actions.ts                  # (new) applyAsAlumni action
├── content/
│   ├── about.md                           # About Us markdown
│   └── founders.md                        # Founder note markdown
├── data/
│   └── testimonials.json                  # 3 placeholder testimonials
├── lib/
│   └── validation.ts                      # (extend) Add alumniApplySchema
├── components/
│   └── ...                                # (no new components, Phase 1 primitives sufficient)
└── middleware.ts                          # (extend) Add /apply and /alumni/* to auth-protected routes
```

**Total new/changed files: ~25**

---

## 11. Running Phase 2

```bash
# 1. Install new dependency for markdown rendering
npm install react-markdown remark-gfm
npm install -D @tailwindcss/typography

# 2. Ensure Phase 1 is fully migrated and seeded
npx prisma migrate dev --name init   # if not already done
npx prisma db seed                    # if not already done

# 3. Start development server
npm run dev

# 4. Verify checklist items above at http://localhost:3000
```

**No database migrations needed** — Phase 2 only adds UI components, pages, and server actions. The schema from Phase 1 already supports alumni profiles with `verificationStatus: "approved"` field, session type offerings, and availability slots.

---

## 12. Design Token Usage Guide for Phase 2 Components

All colours reference CSS variables from `globals.css` (Phase 1). No hardcoded hex values.

| Token | Usage | Value |
|-------|-------|-------|
| `--color-primary` | Buttons, headings, active links, icons | `#1B3A6B` |
| `--color-accent` | Star ratings, decorative lines, amber dot animation | `#F5A623` |
| `--color-background` | Page/section backgrounds | `#F8F9FB` |
| `--color-foreground` | Body text | `#1a1a2e` |
| `--color-muted-foreground` | Secondary text, descriptions | `#6b7280` |
| `--color-border` | Cards, dividers, input borders | `#e2e8f0` |
| `--color-card` | Card backgrounds | `#ffffff` |

**Animation tokens (from Phase 1 tailwind.config.ts):**
- `animate-shimmer` — skeleton loading
- `animate-pulse` — amber dot pulsing
- Framer Motion `spring` — checkmark scale-in, card hover lift
- CSS `transition-all duration-300` — nav background swap, card border hover

**Typography (Inter from next/font, already in Phase 1 layout):**
- H1: `text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight`
- H2: `text-3xl font-semibold`
- H3: `text-xl font-semibold`
- Body: `text-base leading-relaxed`
- Small: `text-sm text-muted-foreground`

---

## 13. Common Pitfalls & Gotchas

### react-markdown import
`react-markdown` is an ESM-only package. Next.js handles ESM imports in the App Router, but ensure `tsconfig.json` has `"moduleResolution": "bundler"` (should already be set from Phase 1).

### Scroll spy with IntersectionObserver
Use a single `IntersectionObserver` in `PublicNav` observing all section elements. Set `rootMargin: "-80px 0px -50% 0px"` to account for the fixed nav height. Clean up observer on unmount.

### StatsBar counter performance
Use `requestAnimationFrame` (not `setInterval`) for smooth animation. Calculate increment per frame based on elapsed time: `const progress = Math.min(elapsed / duration, 1); const current = Math.floor(start + (end - start) * easeOutCubic(progress));`.

### Form state during auto-verify animation
When the animation starts, disable ALL form fields and the submit button. Re-enable only if navigating back (unlikely but use cleanup). The form is a controlled component with `disabled` on all inputs.

### Alumni self-apply rate limiting with seeded accounts
The seeded 10 alumni already exist in the database with their emails. If someone tries to apply with `alumni1@alumnow.com`, the unique email constraint will reject it. This is correct behaviour — seeded accounts are pre-existing.

### Missing phase-1-foundation.md references
The Phase 2 doc assumes Phase 1 is complete. If any Phase 1 component is missing (Navbar, Footer, Toaster, etc.), the landing page will break. Verify Phase 1 checklist before starting Phase 2.
