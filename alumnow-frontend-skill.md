# AlumNow — Frontend Design & Engineering Skill

**Version:** 2.1
**Stack:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Framer Motion
**Design DNA:** Warm-educational marketplace — 4-colour palette, Inter font, playful-but-trustworthy

---

## 0. Design Philosophy

AlumNow is a **two-sided marketplace** connecting students with verified alumni for paid video-call sessions. The UI must feel:
- **Trustworthy** — students are minors, parents are paying. Clean, safe, professional.
- **Warm** — not cold SaaS. Human faces, rounded corners, amber accents.
- **Playful but restrained** — the mobile swipe deck is fun, but booking/payment is serious.
- **Educational** — aspirational. Alumni photos, university branding, achievement signals.

Every page falls into one of two surface classes:

| Surface | Pages | Rules |
|---------|-------|-------|
| **MARKETING** | `/` landing, `/about`, `/privacy`, `/terms` | Full Awwwards license: hero motion, scroll narrative, staggered reveals |
| **APP** | `/browse`, `/alumni/[id]`, `/book/*`, `/bookings`, `/dashboard`, `/admin/*`, `/profile/*` | Dense, functional, utilitarian. No decorative motion. Data-density prioritised. |

---

## 1. Design Tokens (Locked — Never Deviate)

```css
:root {
  /* Brand palette — exactly 4 colours */
  --color-primary: #1B3A6B;     /* Deep Indigo Blue — buttons, links, headers */
  --color-accent:  #F5A623;     /* Warm Amber — CTAs, badges, highlights */
  --color-bg:      #F8F9FB;     /* Off-White — page backgrounds */
  --color-text:    #2C3E50;     /* Charcoal — body text */

  /* Extended (from the 4) */
  --color-primary-light: #2B5A9B;
  --color-primary-dark:  #0F2240;
  --color-accent-light:  #FFC55C;
  --color-accent-dark:   #D4880F;
  --color-bg-card:       #FFFFFF;
  --color-bg-hover:      #EEF0F4;
  --color-border:        #E2E5EA;
  --color-text-muted:    #7A8BA0;
  --color-success:       #22C55E;
  --color-error:         #EF4444;
  --color-warning:       var(--color-accent);

  /* Typography */
  --font-sans: 'Inter', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* Scale */
  --fs-micro:   0.6875rem;   /* 11px — badges, timestamps */
  --fs-small:   0.75rem;     /* 12px — secondary labels */
  --fs-body:    0.875rem;    /* 14px — body text */
  --fs-base:    0.9375rem;   /* 15px — default UI */
  --fs-h3:      1.125rem;    /* 18px — card titles */
  --fs-h2:      1.375rem;    /* 22px — section headers */
  --fs-h1:      1.75rem;     /* 28px — page titles */
  --fs-hero:    clamp(2.5rem, 6vw, 4.5rem); /* landing page hero */

  /* Spacing (8px grid) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-7: 32px; --space-8: 40px; --space-9: 48px; --space-10: 64px;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(27, 58, 107, 0.08);
  --shadow-md: 0 4px 12px rgba(27, 58, 107, 0.1);
  --shadow-lg: 0 8px 24px rgba(27, 58, 107, 0.12);
  --shadow-xl: 0 16px 48px rgba(27, 58, 107, 0.15);
}
```

**Rules:**
- All colours in code MUST reference `var(--color-*)` tokens — no inline hex
- `--font-sans` for all UI text. `--font-mono` only for prices, dates, transaction refs
- No italic headers. Ever. Carrying emphasis with weight or accent colour
- The 4-colour limit is enforced by lint rule — any 5th colour is a build error

---

## 2. Banned Aesthetics & Patterns

### Visual Bans
- ❌ Purple/indigo gradients (no "AI purple")
- ❌ Glassmorphism (no `backdrop-blur` on cards)
- ❌ Neon glows, outer box-shadow glows
- ❌ Gradient text on headers
- ❌ Pure black (`#000`) — always use `--color-text` or `--color-primary-dark`
- ❌ Emojis in UI — use lucide-react icons
- ❌ Stock photos (use `picsum.photos/seed/{name}/400/400` for demo profiles)
- ❌ Fake metrics ("Trusted by 10K+ students") — use real data or placeholder skeleton
- ❌ 3-column equal-card feature rows — banned layout pattern

### Typography Bans
- ❌ Inter as the only font (default OK here, but pair with display face on landing)
- ❌ Italic headings at any size
- ❌ All-caps for anything other than badges/tags
- ❌ Letter-spacing increases on headers
- ❌ Serif fonts anywhere in APP surfaces (MARKETING only: use Instrument Serif for hero)

### Interaction Bans
- ❌ Auto-playing carousels
- ❌ Confetti / celebration animations on booking (this is educational, not a game)
- ❌ Skeleton loaders that cause layout shift — fixed dimensions always
- ❌ `h-screen` — always use `min-h-[100dvh]`
- ❌ Custom mouse cursors
- ❌ 3D tilt cards, parallax tilt, holographic effects

### Content Bans
- ❌ "John Doe", "Jane Smith", "Acme Corp"
- ❌ "Revolutionary", "seamless", "elevate", "unlock", "next-gen"
- ❌ Placeholder charts or fake data visualizations
- ❌ Powered by / built with badges in the UI

---

## 3. Typography System

### Font Pairings

| Surface | Display/Headers | Body | Data/Numbers |
|---------|----------------|------|-------------|
| MARKETING | `Instrument Serif` (hero only) | `Inter` | `JetBrains Mono` |
| APP | `Inter` (semibold 600) | `Inter` (regular 400) | `JetBrains Mono` |

### Size Scale (APP surfaces)

```css
h1 { font-size: var(--fs-h1); font-weight: 600; line-height: 1.2; }
h2 { font-size: var(--fs-h2); font-weight: 600; line-height: 1.25; }
h3 { font-size: var(--fs-h3); font-weight: 600; line-height: 1.3; }
body, p { font-size: var(--fs-body); line-height: 1.6; color: var(--color-text); }
.meta { font-size: var(--fs-small); color: var(--color-text-muted); }
.badge { font-size: var(--fs-micro); font-weight: 500; }
.price { font-family: var(--font-mono); font-size: var(--fs-base); }
```

**Rules:**
- Body text max-width: `max-w-[65ch]`
- Prices in `--font-mono`, right-aligned in tables
- Section headers: always left-aligned in APP, centered optional in MARKETING
- No heading below 600 weight

---

## 4. Component Architecture

### 4.0 Component API Design Patterns

Every component in the system follows one of these patterns. Choose before implementing.

**Controlled vs Uncontrolled:**
- `SearchBar`, `FilterPanel`, `SwipeDeck` — controlled (parent owns state via `value`/`onChange`)
- `CountdownTimer`, `Toast`, `Skeleton` — uncontrolled (self-managed internal state)
- `AlumniCard` (save toggle) — uncontrolled with optimistic local state, syncs to server via mutation callback
- `ReviewForm` — controlled (form state managed by parent), submit mutation fires callback

**Event handler naming:**
- Navigation: `onNavigate`, `onTabChange`
- Data mutation: `onSave`, `onSkip`, `onBook`, `onCancel`, `onSubmitReview`
- Filter: `onFilterChange`, `onSearch`, `onClearFilters`
- UI: `onToggle`, `onClose`, `onOpen`, `onDismiss`

**Compound component pattern** (used via shadcn/ui Radix primitives):
```
Dialog.Trigger → opens the dialog
Dialog.Content → modal content
Dialog.Header → title+description
Dialog.Footer → action buttons
```
Same for Select, Popover, HoverCard. DO NOT re-implement compound patterns — always extend shadcn/ui.

**Polymorphic component pattern:**
- `Button` uses `asChild` prop (from Radix) when the trigger needs to be a custom element
- `Avatar` always renders as `span` — no polymorphism needed
- `Badge` renders as `span` by default, accepts `as` prop for semantic HTML when needed

**Props interface rules:**
- Every component with a `variant` prop uses `class-variance-authority` (CVA) — no if/else style branching
- `className` prop on every component via `cn()` utility — never block custom styling
- Optional callbacks default to `noop` (not `undefined` check inside component)
- `loading` and `disabled` states are always boolean props — never derived from data presence
- Event handler signatures match React convention: `(event, payload?) => void`

### 4.1 Shared Component Tree

```
components/
├── ui/                      # shadcn/ui primitives (customised)
│   ├── Button.tsx           # Rounded, shadow on hover, active: scale-[0.97]
│   ├── Card.tsx             # White bg, --color-border, --radius-md
│   ├── Input.tsx            # --radius-sm, focus ring in --color-primary
│   ├── Dialog.tsx           # Modal overlay + content
│   ├── Select.tsx           # Customised dropdown
│   ├── Badge.tsx            # Pill badge (verified, pending, etc.)
│   ├── Avatar.tsx           # Round image or initials fallback
│   ├── Toast.tsx            # Top-right, 4s auto-dismiss
│   └── Skeleton.tsx         # Fixed-dimension shimmer
├── Navbar.tsx               # N1b canonical SaaS: logo + links + user menu
├── Footer.tsx               # Ft3: 4-col links + social + copyright
├── AuthGuard.tsx            # Redirects to /login if unauthenticated
├── AdminGuard.tsx           # Redirects if role !== ADMIN
├── AlumniCard.tsx           # Variant prop: grid | swipe
├── AlumniGrid.tsx           # Responsive grid 1→2→3→4 cols
├── SwipeDeck.tsx            # Framer Motion drag="x" deck
├── FilterPanel.tsx          # University/Country/Course/GradYear/QS/Availability
├── SearchBar.tsx            # Debounced 300ms input
├── AvailabilityCalendar.tsx # Weekly view, booked slots greyed
├── SessionPricingCard.tsx   # Pricing card with live capacity
├── BookingSummaryCard.tsx   # Session details summary
├── PaymentModal.tsx         # UPI QR + text input
├── CountdownTimer.tsx       # Client-side countdown
├── ReviewCard.tsx           # Stars + text (first name + grade only)
├── ReviewForm.tsx           # 1-5 star rating + 200 char text
├── HeroSection.tsx          # MARKETING only
├── HowItWorksSection.tsx    # MARKETING only
├── StatsBar.tsx             # Admin-editable platform stats
└── TestimonialsSection.tsx  # MARKETING only
```

### 4.2 Component Design Rules

**AlumniCard (variant: grid)**
- White card, 1px border, `--radius-md`
- Photo top (16:9 crop, object-cover)
- Name, university, course, grad year, country flag
- One-line bio truncated to 2 lines
- Star/save icon top-right (optimistic UI toggle)
- Hover: shadow elevation from `--shadow-sm` to `--shadow-md`, 200ms ease

**AlumniCard (variant: swipe)**
- Full viewport width on mobile, 90% width on tablet
- Photo full-bleed top 60%, content bottom 40%
- Swipe right → save (heart icon fills, green check overlay)
- Swipe left → skip (no persistence, just next card)
- Undo button appears for 3s after swipe, then fades
- Framer Motion: `drag="x"`, `onDragEnd` velocity threshold, `AnimatePresence`

**PaymentModal**
- Centered dialog, max-w-md
- QR code image (centered, 200x200)
- UPI ID text (selectable, copy button)
- Text input: "Enter UPI reference number"
- Submit button: amber (`--color-accent`), full-width
- On submit: spinner 800ms → green check → toast → auto-close
- Optimistic: always succeeds in demo

**AvailabilityCalendar**
- 7-column grid (Mon-Sun), time slots as rows
- Available: green tint, clickable
- Booked: grey, strikethrough, tooltip "Booked"
- Past: dimmed, unclickable
- Today column: subtle blue left-border indicator
- Click opens booking draft modal

### 4.3 State Matrix (Every Interactive Component)

| Component | Loading | Empty | Error | Edge case |
|-----------|---------|-------|-------|-----------|
| AlumniGrid | 12 skeleton cards (fixed w/h) | "No alumni match your filters." + clear filters link | "Could not load alumni." + retry button | Single result: centered, not stretched |
| SwipeDeck | Single skeleton card with shimmer | "No more alumni to show." + check saved tab | "Could not load deck." + retry | Filter change: reshuffle deck, don't keep old cards |
| FilterPanel | Disabled during fetch | No results: grey badges | N/A | All filters cleared: reset URL params |
| AvailabilityCalendar | Grey placeholder grid (no skeleton) | "No availability set." | "Could not load." + retry | Alumnus has no slots → hide calendar section |
| PaymentModal | Spinner on submit (800ms min) | N/A | "Payment failed. Try again." | Already paid: show green check, disable re-pay |
| Booking dashboard | Skeleton booking cards | "No bookings yet. Browse alumni to book!" + CTA button | "Could not load bookings." + retry | Past booking: show review CTA instead of join link |
| ReviewForm | Submit spinner | N/A | "Could not submit review." | Already reviewed: hide form, show "You reviewed this session" |

---

## 5. Mobile Swipe Deck (Highest-Risk Component)

This is the signature UI element. Must feel native, not web-wrapped.

### Implementation Spec

```typescript
// SwipeDeck.tsx
import { motion, AnimatePresence } from 'framer-motion'

interface SwipeDeckProps {
  alumni: AlumniProfile[]
  onSave: (id: string) => void
  onSkip: (id: string) => void
  onUndo: () => void
  currentIndex: number
}
```

**Behavior:**
- Single card visible at a time, `position: absolute`, stacked
- Cards are pre-loaded (next 2 buffered behind current)
- `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}`
- Swipe threshold: 100px OR velocity > 500px/s
- Right swipe (positive x): interpolate rotation 0→15deg, opacity 1→0.8, scale 1→0.95
- Left swipe (negative x): rotation 0→-15deg, same opacity/scale
- On commit: `AnimatePresence` exit animation (300ms), next card enters (200ms)
- Undo: reverse animation, restore previous card, `removeLast()` from skipped/saved

**Performance:**
- `React.memo` on each card
- Images: `loading="lazy"`, `fetchpriority="high"` on current card only
- Motion values via `useMotionValue` (not `useState`) for drag x/y

**Accessibility:**
- Buttons visible at all times: Star button (right), Skip button (left)
- Keyboard: left/right arrow keys trigger actions
- Screen reader: "Swipe right to save, swipe left to skip. Star and Skip buttons also available."

### Framer Motion Implementation

```typescript
// Key implementation approach — SwipeDeck.tsx
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

// Per-card drag handler pattern
function AlumniCardSwipe({ profile, isTop, onSave, onSkip }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15])
  const opacity = useTransform(x, [-300, 0, 300], [0.8, 1, 0.8])
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95])
  
  // Direction overlays — shown when dragged past 50px
  const saveOpacity = useTransform(x, [0, 100], [0, 1])
  const skipOpacity = useTransform(x, [-100, 0], [1, 0])
  
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 100
    const velocity = 500
    if (info.offset.x > threshold || info.velocity.x > velocity) {
      onSave(profile.id)
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      onSkip(profile.id)
    }
    // Otherwise spring back to center (default Framer behavior)
  }

  return (
    <motion.div
      style={{ x, rotate, opacity, scale }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      exit={{ x: x.get() > 0 ? 400 : -400, opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Save overlay — appears on right drag */}
      <motion.div style={{ opacity: saveOpacity }} className="overlay save">
        <Heart className="text-accent" size={48} />
      </motion.div>
      {/* Skip overlay — appears on left drag */}
      <motion.div style={{ opacity: skipOpacity }} className="overlay skip">
        <X className="text-text-muted" size={48} />
      </motion.div>
      {/* Card content */}
    </motion.div>
  )
}
```

**Stack implementation:**
```typescript
// Parent SwipeDeck renders cards in reverse order so top card is last child
// (highest z-index via DOM order)
{cards.map((profile, index) => {
  const isTop = index === currentIndex
  const zOffset = (cards.length - index) * 2
  return (
    <AnimatePresence key={profile.id}>
      {index >= currentIndex - 1 && ( // Buffer: only render current + next 2
        <AlumniCardSwipe
          profile={profile}
          isTop={isTop}
          style={{ zIndex: zOffset }}
          onSave={handleSave}
          onSkip={handleSkip}
        />
      )}
    </AnimatePresence>
  )
})}
```

**Exit animation sequence:**
1. On swipe commit: card animates to `x: 400` (right) or `x: -400` (left) over 300ms
2. `onAnimationComplete` fires → `setCurrentIndex(i + 1)`
3. Next card (already rendered in DOM) becomes draggable with `drag={true}`
4. Previous card unmounts via `AnimatePresence` after exit animation
5. Behind-the-scenes: pre-loaded image for card `currentIndex + 3` starts fetching

### Gesture Conflict Handling

The swipe deck coexists with vertical page scroll. Conflicts resolved by:

- `drag="x"` — locks dragging to horizontal axis only, vertical scroll passes through
- Touch events on the swipe deck container: `touch-action: pan-y` — browser handles vertical scroll, Framer handles horizontal drag
- On mobile browse page: the swipe deck sits in a `min-h-[calc(100dvh-56px)]` container with `overflow: hidden` — no page scroll while deck is active
- Filter drawer (left drag) and swipe deck (left/right drag) cannot fire simultaneously:
  - Swipe deck active: filter drawer trigger disabled (`pointer-events: none` on the drawer handle)
  - Filter drawer open: swipe deck hidden (deck opacity 0, pointer-events none)
- Star/Skip buttons use `onClick` with `e.stopPropagation()` — no gesture conflict

```css
.swipe-deck-container {
  touch-action: pan-y;      /* Vertical scroll passes through */
  overflow: hidden;          /* No page scroll inside deck */
  -webkit-overflow-scrolling: touch;
}
```

### Image Preloading Strategy

Alumni photos are the heaviest assets. Preloading ensures zero flicker between cards.

```typescript
// lib/hooks/useImagePreloader.ts
function useImagePreloader(urls: string[], currentIndex: number) {
  useEffect(() => {
    // Preload next 3 images
    const preloadUrls = urls.slice(currentIndex + 1, currentIndex + 4)
    preloadUrls.forEach(url => {
      const img = new Image()
      img.src = url
      img.fetchPriority = 'high'
    })
  }, [currentIndex, urls])
}
```

**Preloading rules:**
- Current card image: `fetchpriority="high"`, `loading="eager"` — highest priority
- Next 2 cards: preloaded via JS `new Image()` constructor — no `loading` attribute needed
- Card 3 ahead: preloaded at lower priority via `requestIdleCallback` — only if browser idle
- Images beyond 3 ahead: never preloaded — `loading="lazy"` for native lazy loading
- After swipe: immediately preload the new next-2 set (cancel previous in-flight if not used)
- Image dimensions: all alumni photos at 400x400px WebP — exact size, no responsive variants needed
- Fallback: if preload fails (network error), show `AvatarFallback` with lucide/User icon — no broken image icon

```typescript
// Optimised image component for swipe cards
function AlumniSwipeImage({ src, alt, isCurrent }: { src: string; alt: string; isCurrent: boolean }) {
  return (
    <div className="swipe-image-wrapper">
      <img
        src={src}
        alt={alt}
        loading={isCurrent ? 'eager' : 'lazy'}
        fetchpriority={isCurrent ? 'high' : 'low'}
        className="swipe-image"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
          // Show fallback via sibling AvatarFallback element
        }}
      />
    </div>
  )
}
```

### Performance Optimization

| Technique | Implementation | Impact |
|-----------|---------------|--------|
| `React.memo` | Wrap `AlumniCardSwipe` with shallow prop comparison | Prevents re-render of non-top cards |
| `useMotionValue` | x, y, rotate, scale as motion values (not state) | Zero React re-renders during drag |
| `useTransform` | Derived opacity/scale from x motion value | Single source of truth, GPU-composited |
| DOM pruning | Only render currentIndex + next 2 (not full list) | Max 3 cards in DOM vs N |
| `will-change: transform` | On active card only, removed on transition end | GPU layer promotion when needed |
| Image memoization | Preloaded images cached in `Map<string, HTMLImageElement>` | No duplicate network requests |
| RAF throttling | `requestAnimationFrame` for overlay opacity updates | No layout thrashing during drag |
| CSS containment | `contain: layout style paint` on card wrapper | Isolates card repaint to its own layer |

**Performance targets:**
- Drag response: < 16ms (60fps) from touch to card movement
- Card switch: < 100ms from swipe commit to next card interactive
- Image load: < 500ms from preload trigger to card visible
- Memory: max 3 card DOM nodes + 5 preloaded Image objects

### Touch vs Mouse Drag Handling

The swipe deck must handle both touch (mobile) and mouse (desktop tablet) input without conflicts.

- Framer Motion `drag` prop handles both pointer types natively — no separate touch/mouse handlers
- `dragElastic={0.9}` on touch, `dragElastic={0.7}` on mouse (less elastic on desktop for precision)
- Distinguish via `pointerType` in `onDragStart` event — log for analytics, no behavior difference
- Touch devices: disable page pull-to-refresh when touch starts on swipe deck: `overscroll-behavior: contain` on deck container
- Mouse devices: prevent accidental text selection during drag: `user-select: none` on deck container (CSS, not JS)
- Windows Precision Touchpad: Framer Motion `drag` works with touchpad gestures — no special handling needed, but test surface book / Lenovo trackpad

### Scroll vs Swipe Gesture Disambiguation

The swipe deck sits inside a page that also scrolls vertically. Disambiguation strategy:

| Gesture | Axis | Direction | Target |
|---------|------|-----------|--------|
| Page scroll | Vertical | Up/down | Page content |
| Card swipe | Horizontal | Left/right | Swipe deck |
| Filter drawer | Horizontal | Left (from edge) | Filter panel |

**Implementation:**
- Swipe deck: `drag="x"` — locks to horizontal axis, vertical passes through to page scroll
- Filter drawer: `drag="x"` with `dragConstraints` limiting to the drawer width — horizontal drag from left edge only
- Swipe deck cards: `touch-action: pan-y` — browser handles vertical, Framer handles horizontal
- Filter drawer trigger (edge handle): `touch-action: pan-x` — only fires on horizontal drag
- Conflict prevention: when deck is active, drawer trigger has `pointer-events: none`. When drawer is open, deck has `pointer-events: none` and opacity 0.
- Desktop: swipe deck also works with horizontal scroll on trackpad — handled by Framer Motion natively

### Card Stack Z-Index Management

Cards rendered in reverse order so the top card (highest index in array) is the last DOM child, giving it the highest z-index:

```typescript
const zOffsets = useMemo(() => 
  cards.map((_, i) => (cards.length - i) * 2 + 1), [cards.length])
// Card at index 0 (bottom of stack): z-index: 11
// Card at index currentIndex (top): z-index: 21 (example with 10 cards)
```

**Rules:**
- Bottom 2 cards in stack: z-index increment of 2 (visually stacked, 1px offset each)
- Cards beyond bottom 2: not rendered (see DOM pruning above)
- Exit animation card: `position: absolute`, same z-index as when it was top, removed after animation
- Overlay elements (save/skip indicators): z-index 50 (above card content)
- Buttons (Star, Skip): z-index 60 (above overlays, always clickable)

### Image Preloading Strategy (N+2 with Priority)

Detailed preloading pipeline:

```
Card currentIndex:     fetchpriority="high", loading="eager" — loaded immediately
Card currentIndex + 1: preloaded via JS new Image() — starts when current card mounts
Card currentIndex + 2: preloaded via JS new Image() — starts when currentIndex + 1 becomes current
Card currentIndex + 3: preloaded via requestIdleCallback — only if browser is idle
Cards beyond +3: loading="lazy" — native lazy loading, no JS preload
```

**Preload cancellation:** When user swipes rapidly past card +1 before its image loads, abort the pending preload:
```typescript
const preloadAbortController = useRef<AbortController>()
// Each preload call assigns a new AbortController
// On swipe (index change): preloadAbortController.current?.abort()
// Note: Image loading doesn't natively support AbortController — use a boolean flag pattern instead:
const cancelledRef = useRef(false)
// Set cancelledRef.current = true on index change, check in onload callback
```

**Edge cases:**
- Network slow: after 5s, show `AvatarFallback` with User icon — brokwn image icon never appears
- Same image in multiple cards: `Map<string, HTMLImageElement>` cache prevents duplicate loads
- Empty image URL: skip preload entirely, immediately show fallback

### Performance: useMotionValue vs useState

| Approach | Re-renders during drag | Gesture tracking | When to use |
|----------|----------------------|-----------------|-------------|
| `useState` + `onDrag` | Every frame (60/s) | State updates cause re-render tree | Never for drag — use for post-swipe state |
| `useMotionValue` | Zero | Value changes don't trigger re-render | Always for drag x/y, opacity, rotation |
| `useTransform` | Zero | Derived from MotionValue | Always for computed values (skipOpacity, saveOpacity) |

**Reference:**
```typescript
// GOOD — zero re-renders during drag
const x = useMotionValue(0)
const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15])

// BAD — 60 re-renders/second during drag
const [x, setX] = useState(0)
const handleDrag = (_, info) => setX(info.offset.x)
```

**`will-change` strategy:**
- Top card (current): `will-change: transform` applied on mount, removed on `onAnimationComplete` after exit
- Non-top cards: no `will-change` — saves GPU memory
- Overlay elements: `will-change: opacity` only during drag (set in `onDragStart`, removed in `onDragEnd`)
- Button elements: never `will-change` — hover/active are GPU-composited without it

### Accessibility: Keyboard Navigation, Focus Management, SR

**Keyboard controls:**
- ArrowLeft: trigger skip action on current card
- ArrowRight: trigger save action on current card
- Tab/Shift+Tab: cycle focus between Star button, Skip button, and Undo toast
- Space: activate focused button (Star or Skip)
- Escape: if in fullscreen swipe mode, exit to grid view

**Focus management:**
- On card swipe commit: focus moves to the first focusable element of the new card (Star button)
- On undo: focus returns to the restored card's Star button
- On deck exit (swipe last card): focus moves to the "Check Saved" link in empty state
- Focus never lands on card `<div>` itself — only on buttons inside it

**Screen reader announcements:**
- On new card load: `aria-live="polite"` region announces "Card N of M: [Alumni Name], [University], swipe right to save or left to skip"
- On save: "Saved [Name] to shortlist. 3 saved total."
- On skip: "Skipped [Name]."
- On undo: "Undo. Restored [Name]."
- These use a visually hidden `<div>` with `aria-live="polite"` — not `role="alert"` (too aggressive)
- Button labels: `aria-label="Save [Name]"`, `aria-label="Skip [Name]"` (not generic "Save"/"Skip")

### Edge Cases: Rapid Swiping, Race Conditions

**Rapid swiping:**
- User swipes card N right, then immediately starts dragging card N+1 before exit animation of N completes
- Solution: `currentIndex` state update is instant (not waiting for exit animation). Card N+1 is already interactive.
- Guard: `onDragStart` on card N+1 checks `isAnimating.current` ref — if still animating, `drag` is temporarily `false`
- Max queue: if user triggers 3+ swipe actions in under 500ms, subsequent actions are queued and processed sequentially

**Swipe + filter change race condition:**
- User swipes card N, and before the swipe commit callback fires, changes a filter
- The callback references `cards[currentIndex]` which is now stale
- Solution: use `useRef` for the swipe decision, not closure state:
```typescript
const swipeDecisionRef = useRef<{id: string; direction: 'left' | 'right'} | null>(null)
const handleDragEnd = (_, info) => {
  if (info.offset.x > 100) swipeDecisionRef.current = { id: profile.id, direction: 'right' }
}
// In a useEffect watching swipeDecisionRef, process after confirming filters haven't changed
useEffect(() => {
  if (!swipeDecisionRef.current) return
  const decision = swipeDecisionRef.current
  swipeDecisionRef.current = null
  // Check if this card still exists in the current filtered set
  if (cards.find(c => c.id === decision.id)) {
    decision.direction === 'right' ? onSave(decision.id) : onSkip(decision.id)
  }
}, [cards, onSave, onSkip])
```

**Image load error mid-swipe:**
- User drags card, image hasn't loaded yet
- Solution: images preloaded before card becomes interactive. Rare case: preload fails.
- When `onDragStart` fires and image hasn't loaded: show `AvatarFallback` immediately, log error, continue swipe
- Card always has `min-height` matching loaded image height — no layout shift

**Empty deck (all cards swiped):**
- Transition: deck shrinks (scale: 1 → 0.95, opacity: 1 → 0, 200ms), empty state fades in (200ms delay)
- Empty state message: "You've seen everyone! Check your saved list."
- CTA: "View Saved" button → scrolls to Saved tab on browse page
- Undo: "Undo Last" button visible for 5s after last card exits

---

## 6. Motion & Animation

## 6. Motion & Animation

### APP Surfaces (Restrained)

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Button hover | Background darken + shadow deepen | 150ms | ease |
| Button active | `scale(0.97)` | 100ms | ease |
| Card hover | Shadow `sm → md`, Y `0 → -2px` | 200ms | ease-out |
| Modal enter | Opacity 0→1 + scale 0.95→1 | 200ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Modal exit | Opacity 1→0 + scale 1→0.95 | 150ms | ease-in |
| Toast enter | Slide right 50px→0 + opacity 0→1 | 300ms | spring(damping: 20) |
| Toast exit | Opacity 1→0 | 200ms | ease-in |
| Page transition | None — instant (Next.js default) | 0 | — |
| List stagger | Children fade+translateY 10px, stagger 50ms | 300ms | ease-out |
| Swipe card | Drag x + rotation + opacity | 300ms | spring(stiffness: 300, damping: 30) |
| Countdown | CSS `transition` on number change | 500ms | ease |

### MARKETING Surfaces (Generous)

| Element | Animation | Duration |
|---------|-----------|----------|
| Hero headline | Stagger words fade+translateY, 30ms delay | 500ms per word |
| How It Works | Scroll-reveal fade+translateY, Intersection Observer | 500ms |
| Stats bar | Count-up on viewport enter (CSS only) | 1500ms |
| Testimonials | Horizontal auto-scroll, pauses on hover | — |
| Nav links | Underline expand on hover, center-out | 200ms |

**Motion budget:** APP surfaces ≤ 3 animation types per page. MARKETING ≤ 6.

**Reduced motion:** All animations use `@media (prefers-reduced-motion: reduce)` → `transition-duration: 0.01ms` (not `none` — `none` breaks WebKit).

**Never animate:** `top`, `left`, `width`, `height`. Always `transform` + `opacity`.

### CSS Transitions Reference

Every CSS transition in the system maps to these exact configurations. No ad-hoc transition values.

| Property | Duration | Easing | Use case |
|----------|----------|--------|----------|
| `background-color` | 150ms | `ease` | Button hover, select hover, badge hover |
| `box-shadow` | 200ms | `ease-out` | Card hover, modal shadow |
| `color` | 100ms | `ease` | Link hover, text color change |
| `border-color` | 150ms | `ease` | Input focus, radio/checkbox |
| `opacity` | 150ms | `ease` | Fade in/out overlays, toasts |
| `transform` (scale) | 100ms | `ease` | Button active, star fill |
| `transform` (translateY) | 200ms | `ease-out` | Card hover lift, skeleton shimmer |
| `width` | 300ms | `ease-out` | Progress bar, filter chip expand |
| `outline` | 100ms | `ease` | Focus ring (instant on, 150ms off) |
| `fill` | 150ms | `ease` | SVG icon fill change |

**Transition shorthand rules:**
- Multiple properties on same element: always comma-separated explicit list — never `transition: all`
- Button: `transition: background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease`
- Card: `transition: box-shadow 200ms ease-out, transform 200ms ease-out`
- Input: `transition: border-color 150ms ease, box-shadow 150ms ease`
- Separator CSS transitions from Framer Motion — never mix `transition` CSS prop with `motion` component on same transform

### Animation Timing Functions

All CSS cubic-bezier curves in the system:

| Name | cubic-bezier | Use case |
|------|-------------|----------|
| `ease-out` | `(0, 0, 0.2, 1)` | Default for hover, card lift, shadow |
| `ease-in` | `(0.4, 0, 1, 1)` | Exit animations, toast dismiss |
| `ease` | `(0.25, 0.1, 0.25, 1)` | Background transitions, color changes |
| `ease-in-out` | `(0.4, 0, 0.2, 1)` | Progress bar fill, morphing elements |
| `ease-out-expo` | `(0.16, 1, 0.3, 1)` | Modal enter, spring-like CSS (best non-spring) |
| `ease-in-expo` | `(0.7, 0, 0.84, 0)` | Modal exit, quick disappear |

### Stagger Orchestration Strategy

Staggered animations use a parent-child variant architecture via Framer Motion `variants`:

```
Parent variants (container):
  hidden: { opacity: 0 }
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,    // 50ms between each child
      delayChildren: 0.1,       // 100ms delay before first child
      ease: 'easeOut',
      duration: 0.3
    }
  }

Child variants (item):
  hidden: { opacity: 0, y: 10 }
  visible: { opacity: 1, y: 0 }
```

**Stagger values by component:**
- AlumniGrid cards: stagger 50ms, delay 100ms — only on page mount
- Filter chips: stagger 30ms, no delay — only on add
- Session pricing cards: stagger 80ms, delay 150ms — scroll-triggered via `whileInView`
- Review cards: stagger 60ms, delay 200ms — scroll-triggered
- Admin table rows: no stagger — tables load in one block
- Landing page sections: no stagger (MARKETING uses Intersection Observer + CSS animation)

**Rules:**
- Stagger only fires once (`viewport: { once: true }` for scroll-triggered)
- No stagger on secondary pages (bookings, profile) — only on browse and dashboard
- Filter change resets stagger: set `key` prop on grid to `Date.now()` on filter change → component remounts → stagger re-fires
- Never stagger more than 20 children — beyond 20, the total delay exceeds 1s and feels slow. For >20 items, batch in groups of 10 with 200ms between groups.

### Spring Physics Reference

All Framer Motion spring animations use these pre-defined configurations. No spring should use raw stiffness/damping values outside this table.

| Use Case | stiffness | damping | mass | Notes |
|----------|-----------|---------|------|-------|
| Button press | 500 | 30 | 1 | Snappy, no overshoot |
| Card hover | 300 | 25 | 1 | Subtle lift |
| Modal enter | 400 | 25 | 0.8 | Light, quick settle |
| Swipe card | 300 | 30 | 1 | Weighted but responsive |
| Star/heart fill | 400 | 15 | 0.6 | Playful overshoot |
| Checkmark pulse | 200 | 10 | 0.5 | Bouncy celebration |
| Toast slide-in | 180 | 20 | 1 | Smooth, no bounce |
| Drawer drag | 350 | 35 | 1 | Friction-heavy |
| List stagger item | — | — | — | Use `ease-out` (not spring) for list entries |

**Rules:**
- No spring on any MARKETING surface — use CSS `ease-out` for scroll reveals
- No spring on skeleton loaders — CSS shimmer only
- List stagger items use `ease-out` with `duration: 300ms`, never spring
- Mass < 1 for small elements (icons, checkmarks), mass = 1 for full components

### CSS vs Framer Motion Decision Tree

Before adding any animation, determine the tool:

```
Is the animation state-driven (drags, gestures, layout animations)?
  YES → Framer Motion (useMotionValue, AnimatePresence, layout)
  NO  → Is it a hover/focus/active state change?
         YES → CSS transition (150-200ms ease)
         NO  → Is it a mount/unmount or scroll-reveal?
                YES → CSS animation with @keyframes (avoid Framer)
                NO  → Is it a page-level gesture (swipe, drag)?
                       YES → Framer Motion
                       NO  → Don't animate.
```

**Decision rules:**
- Hover states: CSS `transition` only — never Framer Motion `whileHover`
- Focus rings: CSS `transition` — instant on focus, 150ms on blur
- Scroll reveals (MARKETING only): Intersection Observer + CSS animation — no Framer Motion
- Skeleton loaders: CSS `@keyframes` shimmer — never JS animation
- Modals: Framer Motion `AnimatePresence` for enter/exit
- Lists: CSS `animation-delay` stagger for small lists (<10 items), Framer `staggerChildren` for swipe deck
- Page transitions: none — instant (Next.js App Router default)
- Any animation that requires interaction (drag, swipe, gesture): Framer Motion

### Reduced Motion Strategy

```css
/* Global reduced-motion — applied in globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Framer Motion: force immediate final state */
  [data-reduced-motion="true"] {
    --motion-duration: 0.01ms;
  }
}
```

**Framer Motion integration:**
```typescript
// lib/hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion'

function useMotionSafe() {
  const prefersReduced = useReducedMotion()
  return {
    transition: prefersReduced ? { duration: 0.01 } : undefined,
    animate: prefersReduced ? { opacity: 1 } : undefined,
    initial: prefersReduced ? false : undefined,
  }
}
```

### Per-Animation Reduced Motion Fallbacks

Every animated element has a specific reduced-motion behaviour, not a blanket disable.

| Animation | Normal | Reduced Motion |
|-----------|--------|----------------|
| Button hover shadow | 150ms transition | Instant (no transition) — shadow always at hover state |
| Button active scale | 100ms, scale 0.97 | No scale — button stays at 1.0 |
| Card hover lift | 200ms translateY -2px | No lift — shadow stays at `--shadow-sm` |
| Modal enter | 200ms scale+opacity | Opacity only (0→1, 50ms) |
| Toast slide-in | 300ms spring translateX | Opacity only (0→1, 50ms) |
| Scroll-triggered reveal | 300ms fade+translateY | Show final state immediately — no animation |
| Page header stagger | 50ms chain delays | All elements visible immediately (0ms delay) |
| Countdown number change | 500ms transition | Instant number swap (0ms transition) |
| Capacity pulse | 1s opacity cycle | Static text, no opacity change |
| Skeleton shimmer | 1.5s shimmer animation | Static grey background, no shimmer |
| Skin/unsave spring | 300ms spring scale | Instant fill change (0ms) |
| Undo toast fade | 3s delay + fade | Same delay, but opacity 1→0 in 50ms (not 200ms) |
| Progress bar fill | 600ms width transition | Instant width (0ms) |
| Scroll progress indicator | Continuous position update | No progress bar rendered |
| Star hover preview | 100ms color transition | Instant color change (0ms) |
| Filter chip remove | 150ms collapse | Instant hide |
| Hero stagger (MARKETING) | 500ms word fade | All text full opacity immediately |
| Image reveal (profile) | 400ms scale+opacity | Opacity only (100ms) |
| Nav underline expand | 200ms width | Instant full width on hover |

**Implementation pattern for per-animation control:**
```typescript
// utils/motion-safe.ts
import { useReducedMotion } from 'framer-motion'

export function useReducedTransition(duration = 200) {
  const prefersReduced = useReducedMotion()
  return prefersReduced ? { duration: 0.01 } : { duration, ease: [0.16, 1, 0.3, 1] }
}

export function useReducedTransform() {
  const prefersReduced = useReducedMotion()
  return prefersReduced ? {} : { scale: 0.97 }
}
```

**Rules:**
- `transition-duration: 0.01ms` — never `0` or `none` (both break WebKit)
- Framer Motion components check `prefersReduced` and skip gesture animations
- `drag` prop set to `false` when reduced motion is preferred
- Swipe deck: hide drag hint overlay, show Star/Skip buttons more prominently
- Scroll-triggered reveals: show final state immediately
- Countdown timer: skip the flip animation, update number instantly
- Capacity pulse: disable the pulsing animation, show static text
- Marketing hero stagger: show all text at full opacity immediately
- The `useMotionSafe()` hook replaces raw Framer Motion configs across all components
- Every component using animation must check `useMotionSafe()` — no component skips this rule
- Any animation with `whileHover`, `whileTap`, `whileInView` must wrap in a `prefersReduced` condition

---

## 7. Page-Specific Design Specs

### 7.1 Landing Page (/)

```
MARKETING surface
Macrostructure: Marquee Hero → Features → Stats → Testimonials → CTA → Footer
Hero: Split-screen — left text, right illustration (SVG, 2-3 colours)
  - Headline: "Talk to JBCN Alumni Who've Been Where You Want to Go."
  - Subtext: max 2 sentences
  - CTA: Amber button "Find Your Mentor" → /register
  - Illustration: student + alumnus connected via screen, flat vector
Stats bar: 3 numbers (alumni_count, universities_count, sessions_completed)
  - Each: large mono number, small label below
  - Fetched from GET /api/public/stats, cached 5 min
How It Works: 3 steps in a row (desktop) / column (mobile)
  - Step 1: Browse (icon + "Find alumni from your dream university")
  - Step 2: Book (icon + "Pick a time that works for you")
  - Step 3: Learn (icon + "Get personalised guidance on a video call")
Testimonials: 3 cards, config-driven from content/testimonials.json
  - Avatar, name, quote (max 2 lines), grad year
  - Horizontal scroll on mobile
Footer: Logo + About/Contact/Privacy/Terms links + Social icons + Copyright
```

### 7.2 Browse Page (/browse)

```
APP surface
Macrostructure: Filter sidebar (collapsible on mobile) + Grid/Swipe content
Filters (left, 280px on desktop, slide-over drawer on mobile):
  - University (searchable dropdown, debounced 300ms)
  - Country (dropdown with flags via country-code-emoji)
  - Course/Degree (text input, autocomplete)
  - Study Level (toggle: Undergraduate | Postgraduate)
  - JBCN Grad Year (range slider: min 2015, max current)
  - QS Ranking Tier (checkboxes: Top 50 | Top 100 | Top 200 | Unranked)
  - Availability (toggle: This week | This month | Any)
  - Session Type (toggle: 1:1 | Group | Both)
  - Clear All Filters link
Search bar: Full-width above grid, placeholder "Search universities, courses, or keywords..."
Desktop (≥ 768px): 3-4 column grid with pagination (20 per page)
Mobile (< 768px): Full-bleed swipe deck, filter as slide-over drawer
Tabs at top: "Browse" | "Saved" (shows saved alumni with grid/swipe)
URL state: All filters persisted in ?university=X&country=Y&... — shareable
```

### 7.3 Alumni Profile (/alumni/[id])

```
APP surface
Macrostructure: Vertical scroll, stacked sections
Sections in order:
  1. ProfileHeader — Photo, name, university, course, country flag, verified badge
  2. BioSection — Bio text (max 150 words), languages, response-time badge
  3. AvailabilityCalendar — Weekly view, bookable slots in green, clickable
  4. SessionPricingCard — 4 cards: Call 30 / Call 45 / Call 60 / Group 40
     - Each: title, price (₹XXX), "Book" button
     - Group: "3 of 6 spots filled" live capacity
  5. Reviews — "Reviews from students" header + ReviewCard list
     - Each: star rating, text (max 200 chars), first name + grade only
     - Sort: most recent first, "Read all N reviews" expand
  6. Book Now button — Fixed bottom on mobile, CTA on desktop
```

### 7.4 Booking Flow (/book/[draftId])

```
APP surface
Macrostructure: Stepped wizard (Step indicator at top)
Step 1 — Confirm:
  - BookingSummaryCard: alumnus name + photo, session type, date/time, price
  - "Confirm & Proceed to Payment" button
Step 2 — Payment:
  - PaymentModal: QR code, UPI ID, reference input, submit
  - Auto-verifies in demo (800ms spinner → green check)
Step 3 — Confirmation:
  - Green checkmark, "Session Confirmed!"
  - Session details card
  - Google Meet link (placeholder: "Link will appear 10 min before")
  - "Add to Google Calendar" button (template URL)
  - "Go to Dashboard" CTA
```

### 7.5 Student Dashboard (/dashboard + /bookings)

```
APP surface
Macrostructure: Tabbed dashboard
Tab 1 — Upcoming:
  - Cards for upcoming sessions
  - Each: CountdownTimer, alumnus name + photo, session type, date/time
  - Join button (active 10 min before → end)
  - Cancel button (with confirmation dialog)
Tab 2 — Past:
  - Past session cards
  - Each: date, alumnus, session type
  - "Leave a Review" button (if no review exists)
Tab 3 — Saved:
  - Grid of SavedAlumni cards (same as AlumniCard grid variant)
  - Remove from saved (optimistic toggle)
Tab 4 — Settings:
  - Edit profile form: name, email, phone, grade, profile photo upload
  - Save button with spinner
```

### 7.6 Admin Panel (/admin/*)

```
APP surface
Macrostructure: Left sidebar nav + content area
Sidebar: Dashboard | Alumni | Bookings | Users | Settings | Reviews
Dashboard: 4 stat cards (total alumni, total bookings, revenue, pending reviews)
Alumni: Table with search, edit inline, create new, soft-delete toggle
Bookings: Table with status/date filters, export CSV button
Settings: UPI ID input, QR image upload, platform stats editor
Reviews: Pending review list with approve/reject buttons
All tables: Virtual scrolling (TanStack Table or custom), sortable columns
```

---

## 8. Page Data Flow

Every page uses React Query (`@tanstack/react-query`) for server state. This table documents the query key, loading strategy, stale time, refetch interval, and cache invalidation for each page's data.

| Page | Query / Mutation | Query Key | staleTime | refetchInterval | Loading Strategy | Cache Invalidation |
|------|-----------------|-----------|-----------|-----------------|------------------|-------------------|
| `/` (landing) | `usePublicStats` | `['public', 'stats']` | 5 min | none | `suspense: true`, fallback skeleton | — |
| `/browse` | `useAlumniList(filters)` | `['alumni', filters]` | 30s | none | Skeleton grid (12 cards), `keepPreviousData: true` | On filter change: refetch |
| `/browse` (saved) | `useSavedAlumni(userId)` | `['alumni', 'saved', userId]` | 30s | none | Skeleton grid | After toggle save: `invalidate(['alumni', 'saved', userId])` |
| `/alumni/[id]` | `useAlumniProfile(id)` | `['alumni', id]` | 2 min | 30s (availability only) | Skeleton sections matching layout | — |
| `/alumni/[id]` | `useAvailability(alumniId)` | `['availability', alumniId]` | 1 min | none | Grey placeholder grid | — |
| `/alumni/[id]` | `useReviews(alumniId)` | `['reviews', alumniId]` | 2 min | none | Skeleton review cards | After submit: `invalidate(['reviews', alumniId])` |
| `/book/[draftId]` | `useBookingDraft(draftId)` | `['booking', 'draft', draftId]` | 5 min | none | Skeleton summary card | On confirm: navigate to step 2 |
| `/book/[draftId]` | `useSubmitPayment()` | mutation | — | — | Optimistic: always succeeds in demo, 800ms min spinner | On success: `invalidate(['booking', 'confirmed'])`, push to step 3 |
| `/bookings` | `useBookings(userId, tab)` | `['bookings', userId, tab]` | 1 min | 15s (upcoming tab only) | Skeleton booking cards | After cancel: `invalidate(['bookings', userId, 'upcoming'])` |
| `/bookings` | `useCancelBooking(id)` | mutation | — | — | Optimistic: remove card immediately, rollback on error | On success: `invalidate(['bookings', userId])` |
| `/dashboard` | `useUserProfile(userId)` | `['user', userId]` | 5 min | none | Skeleton form fields | After save: `invalidate(['user', userId])` |
| `/admin/dashboard` | `useAdminStats()` | `['admin', 'stats']` | 30s | 30s | Skeleton stat cards (4) | — |
| `/admin/alumni` | `useAdminAlumni(filters)` | `['admin', 'alumni', filters]` | 30s | none | Skeleton table rows (10) | After edit/toggle: `invalidate(['admin', 'alumni'])` |
| `/admin/bookings` | `useAdminBookings(filters)` | `['admin', 'bookings', filters]` | 30s | 15s | Skeleton table rows | — |
| `/admin/reviews` | `useAdminReviews()` | `['admin', 'reviews']` | 30s | none | Skeleton review cards | After approve/reject: `invalidate(['admin', 'reviews'])` |
| `/admin/settings` | `useAdminSettings()` | `['admin', 'settings']` | 5 min | none | Skeleton form | After save: `invalidate(['admin', 'settings'])` |

**Data fetching rules:**
- All queries use `@tanstack/react-query` v5 syntax — no `fetch` or `axios` directly in components
- Loading states show skeleton components matching final layout dimensions — never full-page spinners
- Optimistic updates for: save/unsave alumni, cancel booking, submit review, toggle admin alumni active status
- Error states always show retry button — never silent failure
- `keepPreviousData: true` on `/browse` — prevents layout jump when filters change
- `refetchInterval` only on live data (availability, upcoming bookings, admin stats) — never on reference data (alumni profiles, reviews)
- All mutations return `onSuccess` callback that invalidates the correct query keys
- No polling on MARKETING surfaces — cached 5 min, manual refresh only

---

## 9. Micro-Interactions & Craft Details

### 9.1 Magnetic Drawer (Mobile Filters)
Filter panel slides in from left as a drawer on mobile. Handle at edge: 24px wide, subtle amber accent. Drag to open/close via Framer Motion `drag="x"` with friction. Backdrop overlay at 50% opacity.

### 9.2 Undo Swipe Toast
After swiping, a small toast appears bottom-center: "Saved to shortlist" or "Skipped" + "Undo" button. Auto-dismisses after 3s. If undo is tapped, reverse the action with a spring-back animation.

### 9.3 Capacity Pulse
When group session capacity is between 1-2 remaining spots, the "N spots left" text pulses gently (opacity 0.6→1, 1s cycle, CSS animation only — no JS). Creates urgency without fake scarcity.

### 9.4 Image Reveal on Scroll (Profile Page)
Alumni profile photo: loads with a subtle scale(1.05 → 1) + opacity(0 → 1) reveal as it enters viewport. One-shot, 400ms, CSS animation with `animation-delay` based on scroll position.

### 9.5 Price Animation
When total price appears in booking summary: count-up from 0 to final price (300ms, `requestAnimationFrame` with `easeOutCubic`). Only on first render, not re-renders.

### 9.6 Skeleton Shimmer
All skeletons use a linear gradient shimmer moving left to right at 1.5s cycle. Gradient: `--color-bg-card` → `--color-bg-hover` → `--color-bg-card`. `background-size: 200% 100%`, `animation: shimmer 1.5s infinite`.

### 9.7 Star/Heart Fill Spring
When user taps the save/star icon on an AlumniCard or floating save button: icon scales from 1 to 1.3 (100ms), fills with `--color-accent`, then springs back to 1 (spring: stiffness 400, damping 15). Uses Framer Motion `useSpring` on the scale value, not a CSS transition. SVG stroke-to-fill morphs via `pathLength` animation (200ms).

### 9.8 Booking Confirmation Check Pulse
After payment succeeds in PaymentModal: the green checkmark icon scales from 0 to 1 with an overshoot spring (stiffness: 200, damping: 10), then a subtle ring pulse radiates outward (CSS `@keyframes ring-pulse` — box-shadow spreads from 0 to 8px, opacity 0.4 to 0, 600ms). This is the only "celebration" allowed in the app — restrained, single-color, 600ms.

### 9.9 Filter Badge Removal
When user clicks X on a filter badge in FilterPanel: badge shrinks to 0 scale (150ms, ease-in), then the remaining badges reflow with a 50ms stagger `layout` animation via Framer Motion. Uses `AnimatePresence` with `exit={{ scale: 0, opacity: 0 }}`.

### 9.10 Input Focus Lift
On input focus: the label text (positioned above the input) shifts up by 2px and scales to 0.9 (100ms, ease-out), input border transitions to `--color-primary`. On blur with content: label stays lifted. On blur without content: label returns to original position. Pure CSS with `:focus-within` and `:not(:placeholder-shown)` selectors — no JS.

### 9.11 Nav Link Underline
Navbar links: underline expands from center on hover. Implemented via `::after` pseudo-element: `width: 0` → `width: 100%` on hover, `transition: width 200ms ease`, `transform-origin: center`. Active page link: underline persistent at full width, `--color-accent` color.

### 9.12 Page Header Stagger
When navigating to a new page (APP surfaces): the page title fades in (opacity 0→1, 200ms), followed by secondary elements with 50ms stagger (filters bar, tabs, grid). Only on page mount, not on filter changes. One-shot `useEffect` with `setTimeout` chain — not Framer Motion (too heavy for this).

### 9.13 Session Card Hover Lift
SessionPricingCard on hover: subtle Y translation -3px, shadow elevation from `--shadow-sm` to `--shadow-md`, top border (--color-primary) transitions from 2px to 3px height. 200ms ease-out. Selected card: top border stays at 3px, background tinted `--color-bg-hover`.

### 9.14 Image Error Fallback Fade
When an alumni photo fails to load: the broken image icon fades in (opacity 0→1, 150ms), replacing the `<img>` element. Uses `onError` handler that swaps `src` to a data-URI of a simple SVG silhouette (inline, no network request). The fallback fades while the original image fades out (concurrent 150ms crossfade).

### 9.15 Admin Save Spinner
Admin settings save button: on click, button text fades to 0 opacity (100ms), a spinner icon (lucide/loader) fades in at the same position. On success: spinner fades out, green checkmark appears for 1.2s, then reverts to original text. On error: spinner fades out, original text returns with a brief shake (CSS `translateX` oscillation ±3px, 3 cycles, 300ms).

### 9.16 Button Ripple Effect
On click: a radial gradient circle expands from the click coordinates (`event.clientX/Y` relative to button bounds). Duration 600ms, `ease-out`, circle fades from 30% opacity to 0. Implemented via a `<span>` inserted at click position with `position: absolute`, `transform: translate(-50%, -50%) scale(0)` animating to `scale(4)`. Removed on `animationend`. Only on primary and accent buttons — never on ghost.

### 9.17 Magnetic Button Effect (Hero CTA)
Hero CTA button subtly tracks mouse position within its bounding box. On mousemove: button translates up to 4px toward cursor (inverse — button moves away from cursor edge, creating a magnetic repulsion feel). Uses `requestAnimationFrame` and `useMotionValue` for the offset. Resets with spring on mouseleave. Desktop only — no mouse tracking on mobile.

### 9.18 Direction-Aware Hover Fill
On AlumniCard hover: the background fill enters from the direction of the cursor. Four `<div>` elements (top/bottom/left/right edges) slide in from the entry edge and fill the card. Detected via `onMouseEnter` event `offsetX/Y` compared to card dimensions. Implementation: `useRef` + `getBoundingClientRect`, sets CSS `--enter-from` variable, `::before` pseudo-element animates from that edge. 250ms, ease-out. Replaces the simple shadow-elevation hover on cards that support it (browse grid cards only).

### 9.19 Morphing Search Bar (Mobile)
On mobile browse: search icon (lucide/search) in the navbar expands to a full-width input on tap. The icon morphs: circular badge → rectangular input, 300ms spring (stiffness: 350, damping: 25). The placeholder text fades in after the morph completes (100ms delay). On blur with empty value: reverses to icon. On blur with value: stays expanded. Uses Framer Motion `layout` animation on the container div with `layoutId="search-bar"`.

### 9.20 Animated Number Ticker (Dashboard Stats)
When stat numbers load (session count, saved count, review count): digits roll from 0 to final value. Each digit is a vertical column of 0-9 that translates upward to the correct digit. Duration 800ms, easing `ease-out`, per-digit stagger of 30ms. Pure CSS with `@keyframes` per digit — no JS interval. Only on first mount, not on re-renders. Respects reduced motion: show final value instantly.

### 9.21 Progress Bar Fill Animation (Booking Capacity)
The capacity heat bar (Section 18.2) animates from 0% to its final width on mount: 600ms, `ease-out`, CSS `transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1)`. When capacity changes (e.g., another student books), the bar animates from its current width to the new width — 400ms, no easing reset. Uses `layout` from Framer Motion when the SessionPricingCard re-renders with new data.

### 9.22 Notification Dot Pulse
Unread count badge on the navbar notification bell: a 6px dot pulses with opacity 1→0.4→1, 2s cycle, CSS `@keyframes pulse-opacity`. On new notification arrival: dot scales 1→1.5→1 in 300ms with a spring (stiffness: 400, damping: 15) then settles into the pulse cycle. When count is 0: dot hidden via `display: none` (not rendered in DOM).

### 9.23 Image Zoom on Hover (Alumni Profile Photo)
On the alumni profile page: the header photo scales from 1 to 1.05 on hover, 400ms ease-out. A subtle lens flare overlay (linear gradient, white at 5% opacity top-left) shifts position based on cursor. Desktop only. Implementation: CSS `transform: scale(1.05)` with `transition: transform 400ms ease-out`. The lens flare uses `useMotionValue` for the gradient position, throttled to 30fps via `requestAnimationFrame`.

### 9.24 Card Stack Parallax (Browse Page, Desktop Grid)
When scrolling through the AlumniGrid, cards at the edge of the viewport have a subtle Y offset based on their distance from center. Cards near the top of the viewport shift down by 5px, cards near the bottom shift up by 5px. Uses Intersection Observer with `rootMargin: 200px` to avoid recalculating on every scroll. CSS `transform: translateY()` with `transition: transform 100ms linear`. One-time calculation on scroll end — not continuous.

### 9.25 Filter Chip Add/Remove Animation
When adding a filter: chip slides in from the left (translateX -20px → 0, opacity 0 → 1, 200ms ease-out). When removing: chip collapses to 0 width horizontally (150ms ease-in) before being removed from DOM via `AnimatePresence exit={{ width: 0, opacity: 0, marginRight: 0 }}`. Remaining chips reflow with 50ms stagger `layout` animation. Filter row is `display: flex`, `overflow: hidden`, `gap: var(--space-2)`.

### 9.26 Star Rating Hover Preview + Click Lock
In ReviewForm: on hover over each star, the preceding stars fill with `--color-accent` (preview), on mouseleave they return to grey. On click: the star locks at the clicked position — filled stars stay amber, unfilled stay grey. Preview uses CSS `:hover` on parent container and `~` sibling selector — no JS. Click uses `useState` for the locked rating. Transition: star fill color 100ms ease, star scale 1→1.15→1 on click with spring (stiffness: 400, damping: 15).

### 9.27 Calendar Slot Pulse on Available
In AvailabilityCalendar: available time slots have a subtle green pulse (opacity 1→0.7→1, 3s cycle) that activates after the cell has been visible (in viewport) for 2s. Only pulses 3 times, then settles at full opacity. Implementation: CSS `@keyframes pulse-gentle` with `animation-delay: 2s`, `animation-iteration-count: 3`. Booked slots have no animation. Past slots have no animation.

### 9.28 Scroll Progress Indicator (Alumni Profile Page)
A thin (2px) horizontal progress bar fixed at the top of the profile page (below navbar) showing scroll progress through the page content. Bar fills from 0% to 100% width as user scrolls. `--color-accent` for fill, `--color-bg` for track. Uses `useScroll` from Motion (formerly Framer Motion) linked to the page container ref — not window scroll. Mount/unmount with 300ms fade when entering/leaving the profile page. Only on APP profile page, not on other pages.

### 9.29 Loading Button with Morphing Text
On PaymentModal submit: button text "Pay ₹XXX" fades out (100ms), a spinner icon fades in at center (100ms). On success: spinner fades out, a lucide/check icon appears with a stroke-dasharray draw animation (200ms, animating `stroke-dashoffset` from value to 0), then the text "Confirmed!" fades in (100ms). On error: spinner fades out, the original button text returns. All fades use CSS `transition: opacity 100ms ease`. The checkmark draw uses SVG `pathLength` animation via Framer Motion.

### 9.30 Success Checkmark Draw Animation (Booking Confirmation)
After booking completes: a circular ring draws first (stroke-dasharray animation, 300ms), followed by the checkmark path (200ms). Ring: CSS `stroke-dashoffset` animation, 300ms ease-out, `--color-success` (green). Checkmark: Framer Motion `pathLength` animation from 0 to 1, 200ms, spring (stiffness: 200, damping: 10). After draw completes: subtle scale pulse 1→1.05→1 (200ms). This is the only celebration in the app — restrained, green-only, 700ms total.

---

## 10. Data Formatting Rules

All formatting utilities live in `lib/format.ts`. Every number, date, and name in the UI must pass through these functions — no inline `toFixed()` or `Intl` calls.

```typescript
// Prices — INR with rupee sign, no decimals for whole numbers
function formatPrice(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
  return formatter.format(amount);
}
// "₹499" — whole number, no decimals
// "₹749.50" — with decimals when needed
// Never use ₹ symbol in font-mono — use the native rupee sign via Intl

// Dates — student-friendly format
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
// "12 Jul 2026" — compact, readable

function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}
// "03:30 PM" — 12-hour with IST

function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} · ${formatTime(date)}`;
}
// "12 Jul 2026 · 03:30 PM"

// Names — first name only (privacy for students)
function formatName(firstName: string, lastName?: string): string {
  if (!lastName) return firstName;
  return `${firstName} ${lastName.charAt(0)}.`;
}
// "Aarav" — no last name
// "Priya S." — first + last initial
// Never show full last names of students or alumni in browse/swipe views

// Session duration — human-readable
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}
// "30 min", "1h", "1h 30m"

// Session capacity — live count display
function formatCapacity(filled: number, total: number): string {
  if (filled >= total) return 'Fully booked';
  const remaining = total - filled;
  return `${remaining} of ${total} spots left`;
}
// "3 of 6 spots left"
// "Fully booked"
// Used by SessionPricingCard capacity display + Capacity Pulse micro-interaction

// Rating — compact star display
function formatRating(score: number): string {
  return score.toFixed(1);
}
// "4.5" — single decimal, no padding

// Phone numbers — Indian format
function formatPhone(phone: string): string {
  if (!phone || phone.length < 10) return phone;
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}
// "+91 98765 43210"

// University name — common abbreviation mapping
const UNIVERSITY_ABBREVIATIONS: Record<string, string> = {
  'massachusetts institute of technology': 'MIT',
  'harvard university': 'Harvard',
  'stanford university': 'Stanford',
  'university of oxford': 'Oxford',
  'university of cambridge': 'Cambridge',
  'university of california berkeley': 'UC Berkeley',
  'university of california los angeles': 'UCLA',
  'university of toronto': 'U of T',
  'university of melbourne': 'Melbourne',
  'national university of singapore': 'NUS',
  'university of tokyo': 'UTokyo',
  'indian institute of technology': (name: string) => {
    const campus = name.replace('indian institute of technology ', '').toUpperCase();
    return `IIT ${campus}`;
  },
  'london school of economics': 'LSE',
};
function formatUniversity(name: string): string {
  const key = name.toLowerCase();
  const abbr = UNIVERSITY_ABBREVIATIONS[key];
  if (typeof abbr === 'function') return abbr(name);
  return abbr || name;
}
// "MIT", "IIT Bombay", "Stanford"

// Relative time — "2 hours ago", "in 3 days"
function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);
  const isPast = diffSec < 0;

  const units: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [unit, seconds] of units) {
    const count = Math.floor(absSec / seconds);
    if (count >= 1) {
      return isPast
        ? `${count} ${unit}${count > 1 ? 's' : ''} ago`
        : `in ${count} ${unit}${count > 1 ? 's' : ''}`;
    }
  }
  return isPast ? 'Just now' : 'Now';
}
// "2 hours ago", "in 3 days", "Just now", "Now"
// Never shows seconds — rounds to nearest minute minimum

// Ordinal numbers — "1st", "2nd", "3rd"
function formatOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
// "1st", "2nd", "3rd", "11th", "21st"
// Used for grad year displays, ranking

// List formatting with Oxford comma
function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
// "Alice", "Alice and Bob", "Alice, Bob, and Charlie"

// Review count — handles singular/zero
function formatReviewCount(count: number): string {
  if (count === 0) return 'No reviews';
  if (count === 1) return '1 review';
  return `${count} reviews`;
}
// "No reviews", "1 review", "12 reviews"

// Compact number — "1.2K", "3.4M"
function formatCompactNumber(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}
// "42", "1.2K", "3.4M"
// Used for alumni count in stats, admin dashboard totals
```

**Formatting rules:**
- Every price display uses `formatPrice()` — never raw number output
- Student names in reviews, bookings, and profile headers use `formatName()` — last name initial only
- Session dates use `formatDateTime()` — never ISO strings in UI
- Duration uses `formatDuration()` — never raw minute numbers
- Capacity uses `formatCapacity()` — never raw fractions
- Prices always right-aligned in `--font-mono`
- Dates always left-aligned in `--font-sans` (not mono — dates are not data)
- University names abbreviated via lookup — raw names from API are too long for cards

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, swipe deck, drawer filters, bottom CTA |
| Tablet | 640–1023px | 2-column grid, sidebar collapse, inline filters |
| Desktop | 1024–1439px | 3-column grid, persistent sidebar, full filter panel |
| Wide | ≥ 1440px | 4-column grid (browse), max-w-[1400px] container |

**Mobile rules:**
- All asymmetric layouts collapse to single column
- Filter panel becomes slide-over drawer (left, 85vw)
- Admin sidebar becomes bottom tab bar
- Tables horizontal-scroll with sticky first column
- Swipe deck replaces grid entirely on browse
- CTA buttons full-width, bottom-anchored in modals

---

## 12. Performance Budget

| Metric | APP | MARKETING |
|--------|-----|-----------|
| FCP | < 1.5s | < 2.0s |
| LCP | < 2.0s | < 2.5s |
| TBT | < 100ms | < 200ms |
| CLS | < 0.05 | < 0.05 |
| JS bundle (initial) | < 120KB | < 80KB |

**Image budget:**
- Alumni photos: 400×400px, WebP, `loading="lazy"`
- Hero illustration: inline SVG (no network request), max 15KB
- UPI QR code: 200×200px PNG, `loading="eager"`
- Founder headshots: 200×200px WebP, `loading="lazy"`

**Bundle rules:**
- Charts/calendar libraries lazy-loaded per page
- Framer Motion tree-shaken — only used components imported
- `lucide-react` imports by name only, never barrel import
- shadcn/ui components are local copies (fully tree-shakable)
- No moment.js, no lodash — use native Intl + Date APIs

---

## 13. Accessibility (a11y)

- All interactive elements reachable via keyboard (Tab, Enter, Space, Arrow keys)
- Swipe interactions have visible button alternatives (Star, Skip)
- Colour contrast: all text meets WCAG AA (4.5:1 normal, 3:1 large)
- Focus indicators: 2px solid `--color-primary` outline, `outline-offset: 2px`
- Form inputs: label above, error text below, `aria-describedby` for errors
- Images: meaningful `alt` text on alumni photos, decorative `alt=""` on icons
- Toast notifications: `role="alert"`, `aria-live="polite"`
- Modals: focus trap, `aria-modal="true"`, escape key closes
- Skeleton loaders: `aria-hidden="true"`, `role="presentation"`
- Skip-to-content link as first focusable element

---

## 14. State Handling Matrix

Every interactive component must handle all data states. This table documents the exact visual for every component in every state.

| Component | Loading | Empty | Error | Edge case |
|-----------|---------|-------|-------|-----------|
| AlumniGrid | 12 skeleton cards (fixed w/h, shimmer) | "No alumni match your filters." + clear filters link | "Could not load alumni." + retry button | Single result: centered, not stretched |
| SwipeDeck | Single skeleton card with shimmer | "No more alumni to show." + check saved tab | "Could not load deck." + retry | Filter change: reshuffle deck, keep no old cards |
| FilterPanel | All dropdowns disabled, grey loading indicators | No results: grey badges | N/A | All filters cleared: reset URL params, refetch |
| AvailabilityCalendar | Grey placeholder grid (no skeleton, 7x8 cells) | "No availability set for this week." | "Could not load availability." + retry | Alumnus has no slots: hide calendar section entirely |
| SearchBar | Debounce spinner (lucide/loader) in suffix | N/A (no-results handled by grid) | N/A | Search while filters active: combine both query params |
| AlumniProfile (full page) | Skeleton layout matching section positions | N/A (always has profile) | "Could not load profile." + retry + back link | Deactivated alumnus: show "Not currently accepting bookings" banner |
| SessionPricingCard | Price skeleton lines (3 per card, `--fs-h2` height) | "No sessions available." | "Could not load pricing." + retry | All sessions booked: show "Fully booked" overlay, disable Book buttons |
| PaymentModal | Spinner on submit (800ms min, no skip) | N/A | "Payment failed. Try again." + retry | Already paid: green check + "Already confirmed" + disable re-pay |
| BookingSummaryCard | Skeleton text lines (name, date, price) | N/A | "Could not load booking details." + retry | Expired draft: redirect to /browse with toast + "Session draft expired" |
| Booking dashboard tab | Skeleton booking cards (3 per tab, fixed w/h) | "No bookings yet. Browse alumni to book!" + CTA button | "Could not load bookings." + retry | Past booking: show "Leave a Review" CTA instead of "Join" link |
| UpcomingTab | Skeleton countdown + card | "No upcoming sessions." | "Could not load upcoming." + retry | Session starting in <1hr: show "Join" button highlighted |
| PastTab | Skeleton list items | "No past sessions yet." | "Could not load history." + retry | Unreviewed session: show review prompt with amber badge |
| SavedTab | Skeleton grid (6 cards) | "No saved alumni yet. Start browsing!" + "Browse" CTA | "Could not load saved alumni." + retry | All saved alumni removed: show empty state with undo toast |
| SettingsTab | Skeleton form fields (4 lines) | N/A | "Could not load profile." + retry | Email change: require confirmation dialog with "Are you sure?" |
| CountdownTimer | Grey dash "--:--" | "Session ended" text | N/A | Timer > 7 days: show date instead of countdown |
| ReviewCard | Star skeleton + text skeleton (2 lines) | N/A (hidden if no reviews) | "Could not load reviews." + retry | Empty review text: show "No comment" in italic |
| ReviewForm | Submit spinner, all fields disabled | N/A | "Could not submit review." + retry + error badge | Already reviewed: hide form, show "You reviewed this session" badge |
| Navbar | Skeleton logo + link placeholders (desktop) | N/A | N/A | Unauthenticated: hide user menu, show Login/Signup |
| Footer | Static content (no loading state) | N/A | N/A | N/A |
| HeroSection (landing) | Skeleton text blocks (no image) | N/A (always has content) | Use default copy, don't show error | N/A |
| HowItWorksSection | 3 skeleton step cards | N/A (always has content) | Use default copy | N/A |
| StatsBar | 3 skeleton number cards (fixed w/h) | "No stats yet." | "Could not load stats." + retry | Zero values: show "0", not "N/A" |
| TestimonialsSection | 3 skeleton cards (avatar + text) | "No testimonials yet." | "Could not load testimonials." + retry | Single testimonial: center, disable auto-scroll |
| AdminSidebar | Skeleton nav items | N/A | N/A | Collapsed mobile: hamburger button, expand on click |
| AdminStatsCards | 4 skeleton stat cards | "No stats yet." | "Could not load stats." + retry | Zero value: show "0 — no data yet" |
| AdminAlumniTable | 10 skeleton rows (fixed h) | "No alumni registered yet." | "Could not load alumni data." + retry | Filtered to 0: "No alumni match your filters." + clear link |
| AdminBookingsTable | 10 skeleton rows | "No bookings yet." | "Could not load bookings." + retry | Filtered to 0: show "No bookings matching filter." |
| AdminReviewsTable | 5 skeleton review rows | "No reviews pending moderation." | "Could not load reviews." + retry | All approved: "No pending reviews." |
| AdminSettingsForm | Skeleton form fields (UPI, QR, stats) | N/A | "Could not load settings." + retry | Save with empty UPI: inline validation error |
| AuthGuard | Full-page spinner (centered) | N/A | Redirect to /login with toast "Session expired" | Already authenticated: pass through silently |
| AdminGuard | Full-page spinner + "Checking access..." text | N/A | Redirect to /dashboard with "Access denied" toast | Role check in flight: show loading, not blank |
| BookingStepIndicator | Static step numbers (no loading needed) | N/A | N/A | Invalid step: redirect to step 1 |
| AlumniCard (grid) | Skeleton card (image + text shimmer) | N/A (hidden by grid empty state) | Show broken image fallback | Save toggle optimistic: immediately show filled heart, rollback on error |
| AlumniCard (swipe) | Skeleton card image + shimmer | N/A (hidden by deck empty state) | `AvatarFallback` with `User` icon | Rapid swipe: queue processing, no lost actions |
| FloatingSaveButton | Hidden until first save action | N/A | N/A | Already saved: show filled heart, toast "Already saved" |
| CapacityHeatBar | Skeleton bar (grey, 60% width) | N/A (hidden if no group session) | N/A | 0 spots: red bar at 100%, "Fully booked" text |
| UndoToast | Fades in bottom-center after swipe | N/A | N/A | Multiple undo: only last action is undoable (stack of 1) |
| PageHeader | Staggered fade-in (no loading) | N/A | N/A | Very long title (>60 chars): truncate with ellipsis |
| Mobile filters drawer | Spinner while filter options load | "No filter options available" | "Could not load filter options." + retry | Drawer open + filter change: preserve scroll position |
| Booking flow wizard | Step content skeleton | N/A | "Could not load draft." + back to /browse | Browser back button: confirm "Leave booking?" dialog |

**Rules:**
- Every skeleton has fixed width + height — no layout shift on state change
- Error states always include a retry action
- Empty states always include a path forward (CTA link or suggestion)
- Loading skeletons match the final layout shape (not generic circles)
- No component renders without covering all 4 states

---

## 15. Critical Anti-Slop Checklist

Before shipping any component, verify:

### Visual Gates
- [ ] No purple/indigo gradients or AI-purple aesthetic
- [ ] No glassmorphism (`backdrop-blur` on surface components)
- [ ] No neon glows or outer box-shadow glows
- [ ] No gradient text on headers
- [ ] No emojis anywhere in UI — lucide-react icons used instead
- [ ] No `h-screen` — all `min-h-[100dvh]`
- [ ] No stock photos — use `picsum.photos/seed/{name}/400/400` for demo profiles
- [ ] No fake metrics, placeholder charts, or data visualizations with no data source
- [ ] No 3-column equal-card layout pattern
- [ ] No custom mouse cursors
- [ ] No re-drawn browser chrome (fake URL bars, phone frames, code window chrome)
- [ ] No 3D tilt cards, parallax tilt, or holographic effects
- [ ] No `backdrop-blur` on any surface component
- [ ] No pure black (`#000`) — use `--color-text` or `--color-primary-dark`

### Typography Gates
- [ ] No Inter as the only font on MARKETING surfaces (pair with Instrument Serif)
- [ ] No italic headers at any size
- [ ] No all-caps for anything other than badges/tags
- [ ] No letter-spacing increases on headers
- [ ] No serif fonts in APP surfaces
- [ ] No oversized H1 that crowds the viewport — respect the scale tokens
- [ ] No font-weight below 500 for headings
- [ ] Body text respects `max-w-[65ch]`

### Interaction Gates
- [ ] Auto-playing carousels banned — user must initiate
- [ ] No confetti or celebration animations on booking
- [ ] Skeleton loaders have fixed dimensions — no layout shift
- [ ] All 8 states covered: default · hover · focus · active · disabled · loading · error · success
- [ ] Buttons: hover (shadow deepen) + active (`scale(0.97)`) states both present
- [ ] Modals: focus trap, escape key closes, `aria-modal="true"`
- [ ] Swipe deck has non-gesture alternatives (Star/Skip buttons always visible)
- [ ] Toast notifications auto-dismiss after 4s max
- [ ] Every interactive element reachable via keyboard (Tab, Enter, Space, Arrow)
- [ ] Hover tooltips don't block click targets — offset away from cursor
- [ ] Drag-and-drop only where it adds real value (swipe deck is the exception)

### Content Gates
- [ ] No "John Doe", "Jane Smith", "Acme Corp" — use real or seed-specific names
- [ ] No filler words: "revolutionary", "seamless", "elevate", "unlock", "next-gen"
- [ ] No placeholder testimonials with fake avatars
- [ ] No "Powered by" / "Built with" badges in UI
- [ ] No copyright or trademark symbols outside footer
- [ ] All testimonials use real content or come from `content/testimonials.json`
- [ ] Stats use real data or skeleton — never invented numbers

### Data & State Gates
- [ ] Loading states exist for every data-fetching component
- [ ] Empty states exist for every list/grid
- [ ] Error states exist for every API call
- [ ] Colours reference CSS variables, not inline hex values
- [ ] Motion respects `prefers-reduced-motion: reduce`
- [ ] Mobile responsive: verified at 320px, 375px, 414px, 768px
- [ ] No `console.log` or debug artifacts in production code
- [ ] All React Query mutations invalidate correct caches on success
- [ ] 401 response clears auth state + redirects to /login
- [ ] Optimistic UI updates have rollback on error

### Layout Gates
- [ ] No `h-screen` — use `min-h-[100dvh]` for full-viewport sections
- [ ] No hamburger menu on desktop — nav items visible
- [ ] Content not narrower than 90vw on 1440px+ screens
- [ ] Admin sidebar becomes bottom tab bar on mobile
- [ ] Tables horizontal-scroll with sticky first column on mobile
- [ ] Headers compact (56px max, including nav)
- [ ] Section headers left-aligned in APP, centered optional in MARKETING
- [ ] Loading/empty/error/edge states for every data-dependent component
- [ ] Build passes: `npm run build` — zero errors
- [ ] Lint passes: `npm run lint` — zero warnings

---

## 16. shadcn/ui Customisation Overrides

All shadcn/ui primitives are customised to match AlumNow's design tokens. These CSS overrides go in `app/globals.css` or a dedicated `styles/shadcn-overrides.css` file.

```css
/* ── Button ── */
.button {
  height: 40px;
  font-size: var(--fs-body);
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: 0 var(--space-5);
  transition: background 150ms ease, box-shadow 150ms ease, transform 100ms ease;
}
.button--primary {
  background: var(--color-primary);
  color: #fff;
}
.button--primary:hover {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}
.button--primary:active {
  transform: scale(0.97);
}
.button--primary:disabled {
  background: var(--color-bg-hover);
  color: var(--color-text-muted);
  box-shadow: none;
  transform: none;
}
.button--accent {
  background: var(--color-accent);
  color: var(--color-primary-dark);
}
.button--accent:hover {
  background: var(--color-accent-light);
}
.button--ghost {
  background: transparent;
  color: var(--color-primary);
}
.button--ghost:hover {
  background: var(--color-bg-hover);
}
.button--loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}
.button--loading::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

/* ── Card ── */
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.card-header {
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.card-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--color-text);
}
.card-description {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}
.card-content {
  padding: var(--space-4) 0;
}
.card-footer {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

/* ── Input ── */
.input {
  height: 40px;
  font-size: var(--fs-body);
  font-family: var(--font-sans);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-3);
  color: var(--color-text);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder {
  color: var(--color-text-muted);
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(27, 58, 107, 0.15);
  outline: none;
}
.input:disabled {
  background: var(--color-bg-hover);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
.input--error {
  border-color: var(--color-error);
}
.input--error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

/* ── Select ── */
.select-trigger {
  height: 40px;
  font-size: var(--fs-body);
  font-family: var(--font-sans);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-3);
  color: var(--color-text);
  transition: border-color 150ms ease;
}
.select-trigger:focus {
  border-color: var(--color-primary);
  outline: none;
}
.select-content {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}
.select-item {
  font-size: var(--fs-body);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
}
.select-item:hover {
  background: var(--color-bg-hover);
}
.select-item[data-highlighted] {
  background: var(--color-primary);
  color: #fff;
}

/* ── Badge ── */
.badge {
  font-size: var(--fs-micro);
  font-weight: 500;
  padding: 1px var(--space-2);
  border-radius: var(--radius-full);
  text-transform: none;
  letter-spacing: normal;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
.badge--default {
  background: var(--color-bg-hover);
  color: var(--color-text-muted);
}
.badge--primary {
  background: var(--color-primary);
  color: #fff;
}
.badge--accent {
  background: var(--color-accent);
  color: var(--color-primary-dark);
}
.badge--success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}
.badge--error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

/* ── Dialog / Modal ── */
.dialog-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: none; /* no glassmorphism */
}
.dialog-content {
  background: var(--color-bg-card);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-6);
  max-width: 480px;
  width: 90vw;
}
.dialog-header {
  margin-bottom: var(--space-4);
}
.dialog-title {
  font-size: var(--fs-h2);
  font-weight: 600;
  color: var(--color-text);
}
.dialog-description {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}
.dialog-footer {
  margin-top: var(--space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* ── Avatar ── */
.avatar {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-hover);
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  font-weight: 500;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.avatar--sm { width: 32px; height: 32px; }
.avatar--md { width: 40px; height: 40px; }
.avatar--lg { width: 64px; height: 64px; }
.avatar--xl { width: 96px; height: 96px; }

/* ── Skeleton ── */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-card) 0%,
    var(--color-bg-hover) 50%,
    var(--color-bg-card) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Separator ── */
.separator {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-4) 0;
}

/* ── Toast ── */
.toast {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: var(--fs-body);
  color: var(--color-text);
  padding: var(--space-3) var(--space-4);
}
.toast[data-type="success"] {
  border-left: 3px solid var(--color-success);
}
.toast[data-type="error"] {
  border-left: 3px solid var(--color-error);
}
```

**Override rules:**
- Never use shadcn/ui default theme colours — always reference `var(--color-*)` tokens
- Button height: 40px (default is 36px — too short for AlumNow)
- Card padding: `var(--space-5)` minimum
- Input height: 40px to match buttons
- All radii use `var(--radius-*)` tokens, never hardcoded
- No backdrop filters on overlay/dialog components
- Dialog max-width: 480px for payment and booking modals
- Avatar always has `AvatarFallback` for image load failures
- Skeleton uses the branded gradient shimmer, not Tailwind's default pulse

---

## 17. Build Order — Components Per Phase

Each phase maps to the components defined in Section 4. Dependencies flow top-to-bottom.

| Phase | Components To Build | Depends On | Description |
|-------|-------------------|------------|-------------|
| **P1: Scaffold** | Design tokens (`globals.css`), Tailwind config, shadcn/ui init, `lib/utils.ts` (`cn()`), Next.js layout + providers | — | Foundation |
| **P2: Shared UI** | Button, Card, Input, Select, Badge, Dialog, Avatar, Skeleton, Toast (shadcn/ui overrides) | P1 | Primitive components with AlumNow tokens |
| **P3: Layout Shell** | Navbar, Footer, AuthGuard, AdminGuard, `app/layout.tsx` (nav + footer integration) | P2 | Page chrome |
| **P4: Browse** | SearchBar, FilterPanel, AlumniCard (grid), AlumniGrid, useAlumniList (React Query) | P2, P3 | Core discovery |
| **P5: Swipe Deck** | SwipeDeck + AlumniCard (swipe variant with Framer Motion drag, AnimatePresence, useMotionValue) | P2, P3 | Mobile browse |
| **P6: Profile** | AvailabilityCalendar, SessionPricingCard, ReviewCard, useAlumniProfile, useAvailability, useReviews | P2, P3 | Alumni detail page |
| **P7: Booking** | BookingSummaryCard, CountdownTimer, PaymentModal, useBookingDraft, useSubmitPayment | P2, P3, P4, P6 | Booking flow |
| **P8: Dashboard** | Booking dashboard tabs (Upcoming, Past, Saved, Settings), ReviewForm, useBookings, useSavedAlumni | P2, P3, P4, P7 | Student dashboard |
| **P9: Marketing** | HeroSection, HowItWorksSection, StatsBar, TestimonialsSection, usePublicStats | P2, P3 | Landing page |
| **P10: Admin** | Admin sidebar nav, data tables (TanStack Table), stats cards, UPI settings form, review moderation | P2, P3, P8 | Admin panel |
| **P11: Polish** | Loading/empty/error states audit, responsive pass, a11y audit, motion budget check, anti-slop checklist | All | Quality gate |

**Build rules:**
- Each phase produces shippable, testable UI — no phase leaves broken routing
- P4-P5 can be built in parallel (different devs)
- P8 depends on P7's hooks (reuse `useBookings`)
- Marketing (P9) is intentionally late — APP surfaces are the product
- Admin (P10) reuses table patterns from P8 dashboard
- P11 is mandatory before any production deploy
- Every component built in P4-P10 must pass the Anti-Slop Checklist (Section 15) before PR

---

## 18. Theme Reference — Awwwards-Inspired Patterns

Adapted from 2026 award-winning design trends for the education-marketplace genre:

### 18.1 Profile Card with Verified Hover
The alumni profile photo card reveals a "Verified JBCN Alumnus" tooltip with a subtle amber glow on hover. The verification badge (small shield icon from lucide-react, `--color-accent`) sits on the photo bottom-right. Tooltip uses `HoverCard` from shadcn/ui, not custom CSS.

### 18.2 Capacity Heat Bar
Group session capacity shown as a horizontal progress bar: green (0-60% full) → amber (60-85%) → red (>85%). Thin, 4px height, `border-radius-full`. Animates width on data change (300ms ease-out). Uses `--color-success`, `--color-accent`, `--color-error` respectively.

### 18.3 Staggered Session Cards
Session pricing cards stagger in on scroll with 50ms delay between each. Each card: subtle top-border in `--color-primary`, icon (lucide/phone, lucide/clock, lucide/users), price prominently in `--font-mono`.

### 18.4 Floating Save Button (Mobile)
On mobile browse, a small floating heart button (lucide/heart) sits bottom-right (offset 16px from edge). On tap: heart fills with spring animation (stiffness: 300, damping: 20), toast confirms. Only visible when not actively swiping. Uses `AnimatePresence` for mount/unmount.

### 18.5 Review Carousel (Landing Page)
Horizontal auto-scrolling review cards on the landing page. Pauses on hover. Each card: star rating (filled amber stars via lucide/star), quote text, reviewer name + grad year. Smooth 30s infinite scroll CSS animation (`translateX` on a duplicated content block, not JS interval).

### 18.6 Countdown Merge
When countdown timer < 1 hour, it merges into the navbar as a small pill: "Session in 45:12" with a subtle pulsing amber dot (CSS `@keyframes pulse-opacity`, 2s cycle). Helps students see upcoming sessions without navigating to dashboard. Pill uses `Badge` component with `badge--accent` variant.

---

## 19. Design Decision Log

Every major design choice in this file was made deliberately. This section documents the rationale for each, so future engineers can understand why — and know when a decision should be revisited.

### Why 4-Colour Palette

Educational brands perform better with restrained palettes. Duolingo, Khan Academy, and Coursera all use ≤5 colours. A limited palette reduces cognitive load for students (who are minors) and enforces visual consistency across the two-sided marketplace. The 4 colours map to clear semantic roles: primary (trust/authority), accent (action/warmth), background (clean canvas), text (readability). Every extended colour is a derivative of these 4 — no independent 5th colour introduced.

### Why Inter for APP Surfaces

Inter was designed for UI readability at small sizes (its x-height is optimised for 14-16px text). On APP surfaces where data density is prioritised, Inter's tight spacing and clear letterforms maximise content per viewport. Instrument Serif on MARKETING surfaces provides the aspirational, editorial feel needed for first impressions without sacrificing APP readability.

**Decision boundary:** If a new design requires a third typeface, it must pass a readability audit at 14px on a 375px viewport. Currently no such need exists.

### Why No Dark Mode

The demo targets a controlled school environment (daytime use, well-lit classrooms, parent-supervised sessions). Dark mode adds a 50% increase in token maintenance, introduces contrast issues with `--color-accent` on dark backgrounds, and provides zero user-research justification for this demographic. If dark mode is requested, implement via CSS `color-mix()` with OKLCH — no separate token file.

### Why No Page Transitions (APP Surfaces)

Next.js App Router page transitions introduce complexity (layout animations, scroll position restoration, `AnimatePresence` wrapping) for marginal UX gain on a functional app. The instant transition is deliberate: students browsing alumni want data, not theatre. MARKETING surfaces (landing page) can use scroll-driven narrative animations because the goal is engagement, not task completion.

**Revisit if:** User research shows confusion about navigation or page boundaries. Then add a 200ms fade on the `<main>` content area — never full-page transitions.

### Why 40px Button Height (Not shadcn/ui's Default 36px)

At 40px, buttons have a 14px touch target above WCAG's 24px minimum and match input height for inline form layouts. The 36px default is too short for the Indian market where touch targets must accommodate varied device sizes. This applies to all button variants, inputs, and select triggers.

### Why Swipe Deck Replaces Grid on Mobile (Not Toggle)

Mobile users in the 16-18 demographic are accustomed to swipe-based discovery (Tinder, Instagram stories, TikTok). The swipe deck reduces the taps to reach a profile from 3 (scroll → tap → view) to 1 (swipe). Grid view on mobile would require precise tapping on small cards — poor UX for this demographic. The toggle exists for tablet users who may prefer grid scanning.

### Why No Confetti on Booking

Educational platforms that gamify financial transactions train students to associate payment with entertainment. Booking a mentorship session is a serious commitment — the green checkmark draw animation (Section 9.30) provides feedback without trivialising the transaction.

### Why `min-h-[100dvh]` Not `h-screen`

`h-screen` maps to `100vh` on mobile browsers, which does not account for the address bar. `100dvh` (dynamic viewport height) adjusts for browser chrome. `min-h` (not `h`) allows content to extend beyond the viewport when needed. This is a standard mobile-web best practice, not a stylistic choice.

### Why 8px Grid Spacing

An 8px base grid divides evenly into 4px (micro spacing for badges, icons) and 16px (card padding, section gaps). It's the most common design grid (Material Design, Bootstrap, shadcn/ui) because 8 divides by 2, 4, and 1 — enabling consistent half/double relationships without fractions. The 4px step (`--space-1`) provides fine-grained control for edge cases.

### Why No `will-change` by Default

`will-change` promotes elements to GPU layers, consuming memory. Applied indiscriminately, it degrades performance on low-end devices (common in the Indian education market). Only the top swipe card gets `will-change: transform` — removed after exit animation. All other animations rely on the browser's existing GPU compositing for `transform` and `opacity`.

### Why 400x400px Fixed Images (Not Responsive)

Alumni profile photos are small (cards: 200x200, profile page: 300x300). Serving a single 400x400px WebP covers both use cases with a single cache entry. Responsive `srcset` variants would add complexity (3 variants × N alumni × 2x/3x = 6N images) for marginal bandwidth savings. The 400x400 image is ~30KB WebP — acceptable for a single image load.

---

## 20. Route Design Specs

Every route in the app has a detailed design specification. These spec blocks serve as the single source of truth for layout, behaviour, and state handling on each page.

### 20.1 Landing Page (/)

```
MARKETING surface
Layout: Full-viewport sections, stacked vertically
Container: max-w-[1400px] centered for feature sections, full-bleed for hero/CTA

Section-by-section:

1. NAVBAR
   - Transparent (hero background shows through), becomes solid `--color-bg` on scroll
   - Logo (left), nav links (center): About, How It Works, For Alumni, For Schools
   - CTAs (right): "Login" (ghost button), "Get Started" (accent button, links to /register)
   - Mobile: hamburger menu with slide-over drawer (right, 80vw)

2. HERO (full viewport height, min-h-[100dvh])
   - Split: left 55% text, right 45% illustration
   - Headline: Instrument Serif, 48-72px fluid, leading 1.1
   - Sub-text: Inter, 18px, max-w-[45ch], 2 sentences max
   - CTA: accent button, 48px height (larger than APP buttons), "Find Your Mentor"
   - Secondary CTA: ghost button, "Learn More" → scrolls to How It Works
   - Illustration: inline SVG, flat vector style, 2-3 colours (primary + accent + bg)
   - Animation: headline stagger (see MARKETING rules, Section 6)
   - Background: --color-bg, subtle radial-gradient at center-right
   - No video, no auto-play, no particle effects

3. HOW IT WORKS (3 steps)
   - Container: max-w-[1000px], centered
   - Header: h2 "How It Works", centered, Instrument Serif, 36px
   - 3 columns on desktop, stacked on mobile
   - Each step: icon (lucide, 48px, `--color-accent`), h3, p (max 2 lines)
   - Step 1: search icon + "Find alumni from your dream university"
   - Step 2: calendar icon + "Pick a time that works for you"
   - Step 3: video icon + "Get personalised guidance on a video call"
   - Animation: fade+translateY on scroll via Intersection Observer (CSS only)

4. STATS BAR
   - Background: --color-primary, text: white
   - 3 stats: alumni count, universities count, sessions completed
   - Each: number in JetBrains Mono (48px), label in Inter (14px)
   - Number animation: count-up on viewport enter (CSS only, 1500ms)
   - Data: fetched from GET /api/public/stats, cached 5 min, SSG fallback

5. TESTIMONIALS
   - Container: max-w-[1200px], centered
   - Header: h2 "What Students Say", centered, Instrument Serif
   - 3 cards in a row (desktop), horizontal scroll (mobile)
   - Each card: avatar (40px), name, grad year, quote (max 3 lines), star rating
   - Quotes from content/testimonials.json (config-driven, admin-editable)
   - Animation: horizontal auto-scroll on desktop, pauses on hover
   - No auto-scroll on mobile (manual swipe only)

6. CTA SECTION
   - Background: --color-accent, text: --color-primary-dark
   - Headline: "Ready to Find Your Mentor?", Instrument Serif
   - Button: primary style (on accent bg), "Get Started Free" → /register
   - No secondary CTA — single action

7. FOOTER
   - 4 columns: About, For Students, For Alumni, Legal
   - Logo + social icons (lucide: twitter, linkedin, instagram)
   - Copyright: "© 2026 JBCN AlumNow. All rights reserved."
   - Links: About, Contact, Privacy Policy, Terms of Service, FAQ
   - Background: --color-primary, text: white
```

**States:**
- Loading: skeleton text blocks for stats (3 number cards), testimonials (3 cards) — hero and How It Works are static HTML
- Error: stats show "—" instead of number, testimonials use static defaults from JSON, no error state for hero
- Edge case: very long testimonial (>200 chars) truncated with ellipsis + "Read more" link

### 20.2 Browse Page (/browse)

```
APP surface
Layout: Filter sidebar (left) + content area (right)
Container: max-w-[1400px] with --space-8 padding on desktop

FILTER PANEL (desktop: 280px persistent sidebar, mobile: slide-over drawer from left)
   - University: searchable dropdown (shadcn/ui Combobox), debounced 300ms, fetches from /api/universities
   - Country: dropdown with country flags (via country-flag-emoji CDN), searchable
   - Course/Degree: text input with autocomplete suggestions from /api/courses
   - Study Level: segmented control (Undergraduate | Postgraduate | Both)
   - Grad Year: range slider (shadcn/ui Slider), min 2015, max current year + 1
   - QS Ranking Tier: checkbox group (Top 50 | Top 100 | Top 200 | Unranked)
   - Availability: segmented control (This week | This month | Any)
   - Session Type: segmented control (1:1 | Group | Both)
   - "Clear All Filters" link — resets all filters, clears URL params
   - "N results found" counter at top of filter panel — updates as filters change
   - Mobile drawer: 85vw width, backdrop overlay (50% opacity black), drag to close via Framer Motion drag="x"

SEARCH BAR
   - Full-width above grid
   - Placeholder: "Search universities, courses, or keywords..."
   - Debounced: 300ms before triggering filter update
   - Clears on Escape key
   - Has a search icon (lucide/search) left and a clear button (lucide/x) right when value present

TABS (above content area)
   - "Browse" tab (default) | "Saved" tab
   - Saved tab shows `useSavedAlumni` data in same grid/swipe layout
   - Saved tab empty state: "You haven't saved any alumni yet" + "Browse" CTA
   - Tab switch preserves filter state (filters apply to both tabs)

CONTENT AREA
   - Desktop (≥1024px): 3-column grid (4-column on ≥1440px)
   - Tablet (640-1023px): 2-column grid, no persistent sidebar (filters above grid as chips)
   - Mobile (<640px): Full-bleed swipe deck, no grid
   - Pagination: 20 per page, "Load More" button (not infinite scroll — intentional for focus)
   - "Load More" triggers skeleton row of 4 cards while fetching
   - When all results loaded: "You've seen all N alumni" text (no further button)

URL STATE MANAGEMENT
   - All filters stored in URL search params: ?university=MIT&country=US&...
   - Initial load reads from URL params — shareable URLs work
   - Filter change pushes new URL via `useRouter.replace` (not push — doesn't add browser history entry for every filter tweak)
   - Tab state in URL: ?tab=browse or ?tab=saved
   - Preserves scroll position on filter change (not on page navigation — that's default browser behaviour)
```

**States:**
- Loading: skeleton grid (12 cards), filter dropdowns disabled with grey indicators
- Empty: "No alumni match your filters." + "Clear all filters" link + illustration (optional)
- Error: "Could not load alumni." + retry button — filters remain visible with previous values
- Edge: single search result shows centered in grid (not stretched to full width)

### 20.3 Alumni Profile (/alumni/[id])

```
APP surface
Layout: Single-column scroll, max-w-[800px] centered
Container: --space-6 padding on all sides

SECTION ORDER (scrolls vertically):

1. PROFILE HEADER
   - Photo: 120px circle (xl avatar), fallback to User icon
   - Name: h1, Inter semibold 600
   - University + Course: h3 style, --color-text-muted
   - Country flag (via country-code-emoji) + country name
   - Verified badge: lucide/badge-check, --color-accent, tooltip "Verified JBCN Alumnus"
   - Response time badge: "Usually responds in 2 hours" — meta style
   - Sticky on scroll: name + verified badge shrink to a 48px bar at top (on scroll past header)
   - Image reveal: scale(1.05→1) + opacity(0→1) on scroll into view (400ms, CSS, one-shot)

2. BIO SECTION (150 words max)
   - H2 "About"
   - Body text at --fs-body, max-w-[65ch]
   - Languages spoken: inline badges (grey style)
   - Education: university name + degree + grad year
   - Experience: company name + role + duration (if provided)
   - "Read more" / "Show less" toggle if bio exceeds 3 lines

3. AVAILABILITY CALENDAR
   - H2 "Available Slots"
   - 7-column grid (Mon-Sun), time slots as rows (8 AM - 8 PM, 1hr intervals)
   - Today's column: subtle blue left-border (2px)
   - Available slots: green tint (--color-success at 10% opacity), clickable
   - Booked slots: grey, line-through, tooltip "Booked by another student"
   - Past slots: dimmed (--color-text-muted at 50% opacity), not clickable
   - "No availability set for this week." if empty — hide section entirely if alumnus marked as unavailable
   - Click available slot → opens booking modal (creates draft, navigates to /book/[draftId])

4. SESSION PRICING
   - H2 "Session Types"
   - 4 pricing cards in responsive grid (2x2 desktop, 1 column mobile)
   - Call 30: ₹499, 30 min, 1:1 video call — lucide/phone icon
   - Call 45: ₹699, 45 min, 1:1 video call — lucide/clock icon
   - Call 60: ₹899, 60 min, 1:1 video call — lucide/clock icon
   - Group 40: ₹249/student, 40 min, up to 6 students — lucide/users icon
   - Each card: --radius-md, 1px border, top border in --color-primary
   - Price prominently in --font-mono, right-aligned
   - Capacity heat bar on Group card (see Section 18.2)
   - "Book" button on each card (amber accent for recommended, primary for others)
   - Card stagger animation on scroll (50ms delay between cards)

5. REVIEWS
   - H2 "Reviews from Students"
   - Sort: most recent first
   - Each review: star rating (filled stars), text (200 char max), first name + grade only
   - "No reviews yet" if empty
   - "Read all N reviews" expandable link (shows max 3 by default)
   - Review card: white bg, 1px border, --radius-md
   - Star rating as lucide/star icons (filled amber, unfilled grey)

6. BOOK NOW BUTTON
   - Desktop: CTA button at bottom of content (not fixed), "Book a Session"
   - Mobile: fixed bottom bar with "Book a Session" button (full-width, 56px height)
   - Bottom bar on mobile: appears on scroll up, hides on scroll down (auto-hide pattern)
   - Onclick: scrolls to Session Pricing section (if not already in view)
```

**Image loading strategy:**
- Profile photo: `fetchpriority="high"`, `loading="eager"` — first image to load
- No other images on this page (bio section has no images)
- Fallback: lucide/User icon in AvatarFallback, centered, grey background

### 20.4 Booking Flow (/book/[draftId])

```
APP surface
Layout: Centered card, max-w-[600px]
Container: --space-8 padding

STEP INDICATOR
   - 3 steps displayed horizontally: "Confirm" → "Payment" → "Confirmation"
   - Active step: filled circle, --color-primary, text bold
   - Completed step: green check icon, --color-success
   - Future step: grey circle, --color-text-muted
   - Connecting line between steps: grey when incomplete, primary when completed
   - Animates: line fill transitions 300ms when step advances

STEP 1 — CONFIRM
   - BookingSummaryCard: alumnus name + photo (small avatar), session type, date/time, price
   - "Session Details" sub-header
   - Session type: Call 60 (1:1), formatted duration
   - Date: formatted date + time (via formatDateTime)
   - Price: formatted via formatPrice, in --font-mono
   - "Total" line at bottom: label + price
   - "Confirm & Proceed to Payment" button: primary, full-width
   - "Go Back" link: navigates to /alumni/[id] (no confirmation dialog — no data loss yet)

STEP 2 — PAYMENT
   - PaymentModal: centered dialog, max-w-[480px]
   - Instruction text: "Pay via UPI. Scan the QR code or enter the UPI ID manually."
   - QR code: 200x200px PNG, centered, border-radius-sm, loading="eager"
   - UPI ID: text, selectable, with copy button (lucide/copy) — "alumnow@jupbank"
   - Text input: "Enter UPI reference number" (shadcn/ui Input, 12-16 chars)
   - Submit button: accent, full-width, "Pay ₹XXX"
   - Auto-verify: in demo, submit triggers 800ms spinner → green check → toast → auto-close
   - Error: "Payment failed. Try again." + retry — input not cleared, user retries same ref
   - Already paid: show "Already confirmed" with green check, disable re-pay

STEP 3 — CONFIRMATION
   - Large green checkmark (lucide/check-circle, 64px, --color-success)
   - H2: "Session Confirmed!"
   - Session details card: alumnus, date/time, session type, price
   - "Link will appear 10 minutes before the session" — Google Meet placeholder
   - "Add to Google Calendar" button: ghost style, opens calendar.google.com with pre-filled params
   - "Go to Dashboard" CTA: primary button → /dashboard
   - "Book Another" secondary link → /browse

NAVIGATION & STATE
   - Browser back during step 2: confirm dialog "Leave booking? Payment won't be processed."
   - Browser back during step 3: no confirmation (booking is confirmed)
   - Expired draft (>15 min idle): redirect to /browse with toast "Session draft expired"
   - All steps persist draft state: refreshing page stays on current step
   - Implementation: draftId in URL, draft data in React Query cache with 5min staleTime
```

### 20.5 Student Dashboard (/dashboard)

```
APP surface
Layout: Tabbed container, max-w-[1000px] centered
Header: "Dashboard" h1

TABS (shadcn/ui Tabs):
   - 4 tabs: Upcoming | Past | Saved | Settings
   - Tab indicator: underline style, --color-accent
   - Tab state in URL: ?tab=upcoming

TAB 1 — UPCOMING
   - List of upcoming session cards
   - Each card: CountdownTimer (large, centered), alumnus avatar + name, session type, date/time
   - "Join" button: appears 10 minutes before session, active until session end time
     - Before 10min: disabled, "Join available 10 min before"
     - Active: accent style, pulse animation
     - After end: hidden (moved to Past tab)
   - "Cancel" button: ghost style, opens confirmation dialog "Are you sure? This cannot be undone"
     - On confirm: optimistic removal, toast "Session cancelled", invalidate cache
   - Empty: "No upcoming sessions. Browse alumni to book a session!" + "Browse" CTA
   - CountdownTimer: shows days/hours/minutes/seconds, updates every second via setInterval
     - < 1hr: shows minutes:seconds format
     - > 7 days: shows date instead of countdown

TAB 2 — PAST
   - List of past session cards (sorted by date, most recent first)
   - Each card: date, alumnus name + photo, session type, duration
   - "Leave a Review" button if no review exists (amber badge "Review pending")
   - "View Review" link if review exists (shows review text in a popover)
   - Empty: "No past sessions yet."

TAB 3 — SAVED
   - Grid of saved alumni (reuses AlumniCard grid variant)
   - Remove from saved: optimistic toggle (heart unfill, toast "Removed", undo for 3s)
   - Empty: "You haven't saved any alumni yet. Start browsing!" + "Browse" CTA

TAB 4 — SETTINGS
   - Edit profile form:
     - Name (text input)
     - Email (text input, email type)
     - Phone (text input, tel type, Indian format)
     - Grade (select: 9, 10, 11, 12)
     - Profile photo upload (file input, accept="image/*", 2MB max, preview)
   - Save button: primary, saves all fields on click, spinner on save
   - Email change: confirmation dialog "We'll send a verification email to the new address"
   - Phone change: no confirmation (used for booking reminders, less sensitive)
   - Error states: inline validation per field, toast for server errors
```

### 20.6 Bookings Page (/bookings)

```
APP surface (alternate navigation for users who prefer list view over dashboard tabs)
Layout: max-w-[1000px] centered
Header: "My Bookings" h1

VIEW TOGGLE: List | Card (default: List on desktop, Card on mobile)
   - List: compact rows, more data per view
   - Card: visual, similar to dashboard upcoming/past cards

STATUS BADGES (per booking):
   - Upcoming: "Upcoming" badge (primary style), blue dot
   - Starting soon (<10 min): "Starting Soon" badge (accent style), pulse dot
   - In progress: "Live" badge (success style), green pulse dot
   - Completed: "Completed" badge (ghost style), no dot
   - Cancelled: "Cancelled" badge (error style), grey

ACTION BUTTONS:
   - Upcoming: "Join" (primary), "Cancel" (ghost)
   - Starting soon: "Join Now" (accent, larger)
   - In progress: "Join" (accent)
   - Completed: "Leave Review" (ghost) or "View Review" (link)
   - Cancelled: "Book Again" (ghost, navigates to alumnus profile)
   - Past due (missed): "Missed" label (error), no actions

FILTERS:
   - Status filter: All | Upcoming | Past | Cancelled
   - Date range: optional, shadcn/ui DatePicker
   - All filters in URL params: ?status=upcoming

EMPTY STATE:
   - "No bookings found." with relevant CTA
   - If filtered: "No bookings match this filter." + "Clear Filter" link
   - If no bookings at all: "Ready to book your first session?" + "Browse Alumni" CTA
```

### 20.7 Admin Panel (/admin/*)

```
APP surface
Layout: Left sidebar nav (220px) + content area

SIDEBAR NAV:
   - Dashboard | Alumni | Bookings | Users | Reviews | Settings
   - Icons: lucide/layout-dashboard, lucide/users, lucide/calendar, lucide/user-cog, lucide/star, lucide/settings
   - Active item: --color-primary background, white text
   - Hover: --color-bg-hover background
   - Mobile: bottom tab bar (5 tabs, icons only, active highlight)
   - Collapsed on tablet: icons only (64px width), labels shown in tooltips

ADMIN DASHBOARD (/admin)
   - 4 stat cards in a row: Total Alumni, Total Bookings, Revenue (INR), Pending Reviews
   - Each: large number (JetBrains Mono, 32px), label (Inter, 14px, muted), icon (lucide) left
   - Number animation: count-up on mount (800ms, CSS only)
   - Mini sparkline: optional, not required for demo

ADMIN ALUMNI (/admin/alumni)
   - Data table (shadcn/ui Table or TanStack Table): Name, University, Course, Status, Actions
   - Search: full-text search across name, university, course
   - Filters: Status (Active | Inactive | All), University (dropdown)
   - Sort: clickable column headers (name, university)
   - Actions per row: Edit (opens modal), Toggle active/inactive (optimistic toggle)
   - Create: "Add Alumni" button → opens form modal (name, email, university, course, photo URL)
   - Soft delete: toggle active status — not permanent delete
   - Bulk actions: select rows → "Activate" / "Deactivate" / "Delete"
   - CSV export: exports current filtered view as CSV

ADMIN BOOKINGS (/admin/bookings)
   - Data table: Alumnus, Student, Session Type, Date, Status, Amount, Actions
   - Filters: Status (All | Upcoming | Completed | Cancelled), Date range
   - Sort: date, amount, status
   - Export: CSV button (exports current filter view, shows "Generating..." progress)
   - No edit (bookings are immutable) — only view details

ADMIN USERS (/admin/users)
   - Data table: Name, Email, Role (Student/Alumnus/Admin), Status, Joined Date
   - Search: name, email
   - Filters: Role (All | Student | Alumnus | Admin), Status (Active | Suspended)
   - Actions: Edit role, Suspend user (with confirmation dialog)

ADMIN REVIEWS (/admin/reviews)
   - Pending review queue: cards (not table) showing review text, rating, student name, alumnus name
   - Approve: green button → review becomes visible on profile
   - Reject: red button → review hidden, student notified
   - Bulk: select all → Approve All / Reject All
   - Filter: Pending | Approved | Rejected
   - Empty: "No reviews pending moderation."

ADMIN SETTINGS (/admin/settings)
   - UPI ID input: text input for payment UPI ID
   - QR image upload: file input, preview, 200x200 max
   - Platform stats editor: 3 number inputs (alumni count, unis, sessions)
   - Save button: primary, spinner on save
   - All settings saved to backend, displayed in landing page StatsBar
```

**Data table pattern (used across all admin tables):**
- TanStack Table with server-side sorting and filtering
- Pagination: 25 per page, page controls at bottom
- Row hover: subtle background tint
- Selected row: highlighted with --color-primary at 5% opacity
- Mobile: horizontal scroll with sticky first column (name/email)
- Empty: illustration + message + "Add First Entry" CTA where applicable

### 20.8 Login Page (/login)

```
APP surface (centered card)
Layout: Centered card, max-w-[400px], min-h-[100dvh] flex center

FORM:
   - Email input (text, email type, shadcn/ui Input)
   - Password input (password type, show/hide toggle via lucide/eye)
   - "Remember me" checkbox
   - "Login" button: primary, full-width
   - "Forgot password?" link (ghost style, below form)
   - Divider: "Or continue with" + social buttons

SOCIAL BUTTONS:
   - Google (lucide/chrome icon): "Continue with Google"
   - Microsoft (lucide/monitor icon): "Continue with Microsoft" (school accounts)
   - Both buttons: outline style, full-width

ERROR HANDLING:
   - Invalid credentials: inline error below password field "Incorrect email or password"
   - Network error: toast "Could not connect. Check your internet."
   - Too many attempts: toast "Too many login attempts. Try again in 15 minutes." + disable form
   - Invalid email format: inline error on email field "Enter a valid email address"

REDIRECT:
   - On success: redirect to intended page (stored in ?redirect=/browse)
   - On success (no redirect): redirect to /browse
   - Already authenticated: redirect to /browse (skip login page entirely)

LINKS:
   - "Don't have an account? Register" → /register
   - Privacy policy link below (small, muted)
```

### 20.9 Register Page (/register)

```
APP surface (centered card)
Layout: Centered card, max-w-[500px], min-h-[100dvh] flex center

FORM:
   - Full name (text input)
   - Email (email input, checks availability via debounced API)
   - Phone (tel input, Indian format)
   - Password (password input, strength indicator via CSS)
   - Confirm password
   - Role selector: "I am a..." (segmented control: Student | Alumnus)
   - If Student: Grade selector (9-12), School name (text input)
   - If Alumnus: JBCN grad year, University (searchable dropdown)
   - Terms checkbox: "I agree to the Terms of Service and Privacy Policy"
   - "Register" button: accent, full-width

PASSWORD STRENGTH INDICATOR:
   - Visual: 4 segments (red → amber → yellow → green), fills as requirements met
   - Requirements: ≥8 chars, 1 uppercase, 1 number, 1 special char
   - Text: "Weak" (red), "Fair" (amber), "Good" (yellow), "Strong" (green)

ERROR HANDLING:
   - Email taken: inline error "This email is already registered. Login instead?" + link
   - Password mismatch: inline error "Passwords do not match"
   - Weak password: inline error in strength indicator
   - Server error: toast "Could not create account. Try again."
   - Network error: toast "Could not connect. Check your internet."

POST-REGISTRATION:
   - Auto-login (no email verification for demo)
   - Redirect to /browse with toast "Welcome to AlumNow!"
   - If Student: onboarding prompt "Find your first mentor!"
   - If Alumnus: onboarding prompt "Complete your profile!"
```

---

## 21. CSS Architecture

### 21.1 File Structure

```
styles/
├── globals.css              # Design tokens (CSS vars), Tailwind directives, global resets
│   └── @import 'tailwindcss/base'
│   └── @import 'tailwindcss/components'
│   └── @import 'tailwindcss/utilities'
│   └── :root { ... } design tokens (Section 1)
│   └── @media (prefers-reduced-motion: reduce) { ... }
│   └── @keyframes definitions (shimmer, pulse-opacity, ring-pulse, spin)
├── shadcn-overrides.css     # Component-specific overrides (Section 16)
│   └── .button, .card, .input, .select-trigger, etc.
├── tailwind.config.ts       # Tailwind extension with custom tokens
│   └── colors mapped to var(--color-*)
│   └── spacing mapped to var(--space-*)
│   └── fontSize mapped to var(--fs-*)
│   └── borderRadius mapped to var(--radius-*)
│   └── fontFamily (Inter, Instrument Serif, JetBrains Mono)
└── print.css                # Print styles for booking receipts
```

### 21.2 Tailwind Config Extension Points

```typescript
// tailwind.config.ts — only extends, never overrides base theme
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        bg: {
          DEFAULT: 'var(--color-bg)',
          card: 'var(--color-bg-card)',
          hover: 'var(--color-bg-hover)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      spacing: {
        '1': 'var(--space-1)', '2': 'var(--space-2)', '3': 'var(--space-3)',
        '4': 'var(--space-4)', '5': 'var(--space-5)', '6': 'var(--space-6)',
        '7': 'var(--space-7)', '8': 'var(--space-8)', '9': 'var(--space-9)', '10': 'var(--space-10)',
      },
      fontSize: {
        'micro': 'var(--fs-micro)',
        'small': 'var(--fs-small)',
        'body': 'var(--fs-body)',
        'base': 'var(--fs-base)',
        'h3': 'var(--fs-h3)',
        'h2': 'var(--fs-h2)',
        'h1': 'var(--fs-h1)',
        'hero': 'var(--fs-hero)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-opacity': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'ring-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '100%': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'pulse-opacity': 'pulse-opacity 2s ease-in-out infinite',
        'ring-pulse': 'ring-pulse 600ms ease-out',
      },
    },
  },
}
```

**Rules:**
- Only use `@theme extend` — never override Tailwind base colours
- Never add utility classes that duplicate existing Tailwind utilities
- All animation `@keyframes` defined in `globals.css`, referenced in Tailwind config

### 21.3 CSS Module vs Tailwind Decision Tree

```
Is the component a shadcn/ui primitive?
  YES → Tailwind (the component already uses Tailwind classes)
  NO  → Is it a one-off layout pattern (landing page section, specific page layout)?
         YES → Tailwind (quick, no abstraction needed)
         NO  → Is it a reusable component with complex pseudo-selector logic?
                YES → CSS Module (e.g., SwipeDeck overlay animations)
                NO  → Is it a micro-interaction with keyframes?
                       YES → CSS Module or global @keyframes in globals.css
                       NO  → Tailwind (default)
```

**General rule:** Tailwind for layout and spacing, CSS Modules for complex animations and pseudo-selector logic. The project uses ~80% Tailwind, ~20% CSS Modules (SwipeDeck, AdminPanel, AvailabilityCalendar).

### 21.4 Global Styles Structure

`app/globals.css` contains exactly these categories:

1. **Tailwind directives** (`@tailwind base`, `components`, `utilities`)
2. **Design tokens** (`:root { ... }` — see Section 1)
3. **Base resets** (body font, text rendering, scroll behavior)
4. **Reduced motion** (`@media (prefers-reduced-motion: reduce)`)
5. **Keyframe animations** (shimmer, pulse, ring-pulse, spin)
6. **Utility classes** (only if they can't be expressed via Tailwind):
   - `.text-balance` — `text-wrap: balance` for headings
   - `.scrollbar-hide` — hides scrollbars but preserves scroll (for horizontal scroll containers)
   - `.focus-ring` — reusable focus indicator pattern

**Order:** Directives → Resets → Tokens → Keyframes → Utilities

### 21.5 Print Styles (Booking Receipts)

```css
/* print.css — loaded only in booking confirmation page */
@media print {
  .navbar, .footer, .sidebar, .no-print {
    display: none !important;
  }
  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
  .receipt {
    border: 1px solid #ccc;
    padding: 20px;
    max-width: 300px;
    margin: 0 auto;
  }
  .receipt h1 {
    font-size: 18pt;
    font-weight: 600;
  }
  .receipt .price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14pt;
  }
}
```

**Print rules:**
- Only booking confirmation page triggers print styles
- Receipt includes: transaction ref, date, alumnus name, session type, amount, UPI ref
- No colours (black on white) — printed receipts must be readable in B&W
- QR code: hidden in print (can't scan from paper)
- No shadows, no border-radius in print

### 21.6 Custom Utility Classes

Only add a custom utility when the pattern appears 3+ times and cannot be expressed in Tailwind alone:

```css
/* globals.css — only these custom utilities */
.text-balance {
  text-wrap: balance;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.focus-ring:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 100;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
}
.skip-link:focus {
  top: 0;
}
```

---

## 22. Error & Edge Case Visual Treatment

Every error and edge case in the app has a defined visual treatment. No state is unhandled.

### 22.1 Network Error (Offline Banner)

```
Trigger: navigator.onLine changes to false, or any API request fails with TypeError (network error)
Visual: Top-of-viewport banner, 40px height, --color-error background, white text
Content: lucide/wifi-off icon + "You're offline. Some features may not work."
Position: Fixed top, below navbar (z-index: 40)
Animation: Slide down from -40px to 0 (200ms, ease-out)
Dismiss: Auto-hides when navigator.onLine returns true (200ms slide-up)
Behaviour: Swipe deck still works with cached cards, booking mutations queued
```

### 22.2 401 Unauthorized

```
Trigger: API response status 401
Visual: Toast (top-right, error style)
Text: "Session expired. Please log in again."
Action: Clear auth state → redirect to /login with ?redirect=current-path
Edge: Silent fetch in background (prefetch) — no toast, just redirect
Edge: Multiple 401s from parallel requests — single redirect, queue cleared
```

### 22.3 403 Forbidden

```
Trigger: API response status 403 (non-admin accessing admin route)
Visual: Toast (top-right, error style)
Text: "Access denied. You don't have permission to view this page."
Action: Redirect to /dashboard (not /browse — preserve user context)
Guard: AdminGuard checks role before rendering admin layout (see Section 4.3)
```

### 22.4 404 Not Found (Custom Page)

```
Route: app/not-found.tsx
Layout: Centered, min-h-[100dvh], flex
Visual:
  - lucide/search-x icon (64px, --color-text-muted)
  - h1: "Page not found"
  - p: "The page you're looking for doesn't exist or has been moved."
  - Two CTAs: "Go Home" (primary button → /) + "Browse Alumni" (ghost button → /browse)
  - No illustration, no animation, no brand mascot
  - Static HTML (no data fetching) — renders instantly
```

### 22.5 500 Error Boundary

```
Component: app/error.tsx (Next.js error boundary, per-page or root)
Visual: Centered, min-h-[60vh], flex
Content:
  - lucide/alert-triangle icon (48px, --color-error)
  - h2: "Something went wrong"
  - p: "An unexpected error occurred. Please try again."
  - "Try Again" button (primary style) → calls reset() to re-render the page
  - "Go Home" link (ghost) → / if reset doesn't fix it
Logging: error logged to console.error in development, to service in production
No recovery: if error boundary itself crashes, fallback to a blank page with just the retry button
```

### 22.6 Rate Limited (429)

```
Trigger: API response status 429
Visual: Toast (bottom-center, warning style)
Content: lucide/clock icon + "Too many requests. Please wait {seconds} seconds."
Countdown: seconds remaining updated every second (setInterval, local timer)
Cooldown: disable the triggering action's button for the duration
Edge: multiple 429s — use the longest remaining cooldown
```

### 22.7 Empty States (Per Component)

Every list/table/grid component has a defined empty state. Generic rules:

| Component | Empty State Visual | CTA |
|-----------|-------------------|-----|
| AlumniGrid | lucide/users icon (48px, muted) + "No alumni match your filters." | "Clear all filters" link |
| SwipeDeck | lucide/eye-off icon + "No more alumni to show." | "Check your saved list" link |
| SearchBar | (no empty state — grid handles it) | — |
| AvailabilityCalendar | "No availability set for this week." | — |
| SessionPricingCard | "No sessions available." | — |
| Booking dashboard (upcoming) | lucide/calendar icon + "No upcoming sessions." | "Browse Alumni" button |
| Booking dashboard (past) | "No past sessions yet." | — |
| Saved tab (dashboard) | lucide/heart icon + "No saved alumni yet." | "Start Browsing" button |
| Admin alumni table | "No alumni registered yet." | "Add Alumni" button |
| Admin bookings table | "No bookings yet." | — |
| Admin reviews table | "No reviews pending moderation." | — |
| TestimonialsSection | "No testimonials yet." | — |
| Review list (profile) | "No reviews yet. Be the first!" | — |
| Admin stats | "No stats yet." | — |

**Empty state rules:**
- Always include a relevant lucide icon (48px, `--color-text-muted`)
- Message must be specific (not generic "Nothing here")
- CTA must provide a clear next action where applicable
- Empty state never shows skeleton — skeletons are loading only

### 22.8 Loading Skeletons (Exact Dimensions)

Every skeleton has specified width + height. No generic skeleton shapes.

| Component | Skeleton Shape | Width | Height | Count |
|-----------|---------------|-------|--------|-------|
| AlumniCard (grid) | Rounded rectangle (image) + 3 text lines | 100% (card width) | 200px (image) + 60px (text) | 12 |
| SwipeCard | Full card shape | 90vw (mobile) | 80dvh | 1 |
| SessionPricingCard | 3 text lines per card | 100% | 140px | 4 |
| Booking card | Image circle (40px) + 2 text lines | 100% | 80px | 3 |
| ReviewCard | Star row + 2 text lines | 100% | 100px | 3 |
| Profile header | Circle (120px) + 2 text lines | 100% | 200px | 1 |
| Admin table row | 6 text lines (columns) | 100% | 48px | 10 |
| Stat card (admin) | Single number line | 200px | 80px | 4 |
| StatsBar (landing) | Single number line | 120px | 80px | 3 |
| Testimonial card | Circle (40px) + 2 text lines | 280px | 120px | 3 |
| HowItWorks step | Icon circle + 2 text lines | 250px | 140px | 3 |
| Form fields (settings) | Input-shaped rectangle | 100% | 40px | 4 |

**Skeleton rules:**
- All skeletons use `class="skeleton"` (defined in Section 16) — never custom shimmer gradients
- Skeletons are `aria-hidden="true"` and `role="presentation"` — not announced by screen readers
- Skeletons match the final component dimensions exactly — no layout shift
- Skeleton shimmer is disabled when `prefers-reduced-motion: reduce`

### 22.9 Form Validation Visual Specs

| State | Visual | Implementation |
|-------|--------|---------------|
| Idle | Input with border `--color-border`, label above | Default shadcn/ui Input |
| Focused | Border `--color-primary`, subtle ring shadow `rgba(27,58,107,0.15)` | CSS `:focus` |
| Typing | Live validation after 300ms debounce | onChange → validate → setError |
| Valid | Green border (`--color-success` at 50% opacity), subtle green check icon | CSS class `.input--valid` |
| Error | Red border (`--color-error`), error text below in `--fs-small`, `--color-error`, `aria-describedby` | CSS class `.input--error` |
| Disabled | Grey bg (`--color-bg-hover`), muted text (`--color-text-muted`), `cursor: not-allowed` | `disabled` attribute |
| Success (form) | Green banner at top "Saved successfully!" + check icon, auto-dismiss 3s | Toast or inline banner |
| Loading (submit) | Button shows spinner, all form fields disabled | `.button--loading` class |

**Validation rules:**
- Error text appears below the input field (not above, not right)
- Multiple errors: first error field receives focus
- Submit button disabled until all fields pass validation
- All errors linked to input via `aria-describedby` — screen reader announces errors
- Inline validation on blur for each field (not just on submit)
- Password field: strength indicator updates on every keystroke (no debounce)
- No error icon inside input — error text + border colour is sufficient
