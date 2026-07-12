# Marketplace UI/UX Design Research — 2026 Comprehensive Analysis

> **Research date:** July 2026
> **Scope:** Award-winning marketplace websites, design pattern analysis, competitive benchmarking
> **Target application:** AlumNow alumni discovery marketplace (/browse — grid/swipe views, filters, search, booking)

---

## Executive Summary

Marketplace design in 2026 has matured significantly beyond standard e-commerce patterns. The most successful marketplaces now operate on a **dual-sided UX model** that simultaneously serves buyers (discovery, trust evaluation, frictionless purchase) and sellers (listing visibility, data access, onboarding simplicity). This research analyzed 15+ award-winning marketplace interfaces across Awwwards, CSS Design Awards, Webby Awards, and UX Design Awards, along with 10+ deep-dive case studies from leading UX research firms (Baymard Institute, LOW/CODE, Kinguin case study).

Three dominant trends emerge: **bento grid layouts** have become the de-facto standard for homepage and feature sections (67% of top SaaS and marketplace products now use them), **AI-enhanced search and filtering** with autocomplete, dynamic filter counts, and personalized sorting is now baseline buyer expectation, and **mobile-first trust architecture** — where reviews, verification badges, and transaction counts are placed above the fold on every listing page — drives measurable conversion gains of 2-15% in A/B tests. The era of "decorative" marketplace design is over; every pixel must serve conversion or trust.

For AlumNow specifically, the research surfaces a critical opportunity: alumni discovery platforms sit at the intersection of **service marketplace UX** (booking, profiles, reviews) and **social discovery UX** (swipe-based browsing, profile cards). The best patterns to adopt come from Airbnb/Sojourn (dual-map + grid exploration), Kinguin (adaptive filtering with context-aware filter sets), and Creative Apes Marketplace (immersive 3D hero with bento grid feature showcases). The current AlumNow browse experience would benefit most from persistent filter state, a sticky search bar, and trust signals at the card level.

---

## Top 10 Design Patterns Observed Across Marketplaces

### 1. Bento Grid Feature Showcases
Bento grids dominate 2026 marketplace landing pages. Apple's product pages popularized the pattern, but Linear, Vercel, and Creative Apes Marketplace have refined it for discovery platforms. The pattern uses a 3-4 column grid with one hero cell (2x2) and 4-7 supporting cells of varying sizes. Cell size communicates importance, not content volume. On mobile, cells reflow to single column with reordered priority.

**Key implementation:**
- 100px base unit + 16px gutters for the grid
- CSS Grid with `grid-template-areas` for layout control
- Cards share consistent border-radius (12-16px), padding (24-32px), and background treatment
- One asset per cell, one sentence max per cell

### 2. Persistent Centered Search Bar
Every high-performing marketplace places search in a persistent, centered position — visible above the fold on all pages. The shadcn/ui Marketplace Navbar is the canonical reference: search dominates the center, category dropdown on the left, secondary actions (profile, install count) on the right. Autocomplete with category + seller suggestions reduces zero-result searches by 30-40% (source: LOW/CODE).

### 3. Dual-View Exploration (Grid + Map/Swipe)
Airbnb's influence is now standard: marketplaces offer at least two browse modes simultaneously. Sojourn's implementation pairs a listing grid beside an interactive MapLibre map with price-pill markers. For AlumNow's context, the grid + swipe pattern mirrors this — the swipe view is the "map" alternative for rapid discovery. Filter state must persist across both views.

### 4. Trust Signals at Card Level
Baymard's research shows that trust signals (verification badges, response rates, transaction counts, star ratings) placed directly on listing cards — not just on detail pages — increase click-through rates by 12-18%. Kinguin's redesign proved that replacing ambiguous icons with systematized text labels improved readability significantly.

### 5. Adaptive Context-Aware Filtering
Kinguin's case study (Łukasz Czapor) demonstrated that filters must adapt to search context. Different product types (e.g., games vs. gift cards) surface completely different filter sets. Filter persistence across pagination and back-navigation is non-negotiable — losing filter state is a leading cause of search abandonment.

### 6. Progressive Disclosure Listing Pages
The modern listing/detail page shows trust signals above the fold, followed by an image-dominant gallery, then key attributes. The primary CTA (book/contact) is sticky on scroll. The Kinguin redesign showed that simplifying the CTA section and adding social proof improved conversion by 2% from that change alone.

### 7. Step-Based Checkout (Not One-Pager)
Kinguin's checkout redesign from single-page to step-based (Cart → Details → Payment → Confirmation) reduced cognitive overload and abandonment. Progress indicators showing "Step 2 of 4" set clear expectations. This pattern is especially important for booking-based marketplaces like AlumNow.

### 8. Mobile-First Top/Bottom Navigation Bars
With 70%+ of marketplace transactions on mobile, navigation must be thumb-friendly. The emerging pattern: a sticky bottom tab bar on mobile (Home, Search, Favorites, Profile) with a floating action button for primary actions. The top bar collapses to a condensed search pill that expands on tap.

### 9. Animated Micro-Interactions on Cards
Creative Apes Marketplace and DeLorean Marketplace demonstrate the winning formula: card hover states with translateY lift (4-8px), increased shadow, and subtle border highlight. Scroll-triggered entrance animations (staggered fade-in from framer-motion) improve perceived performance. However, animations must be performance-budgeted — DeLorean's mouse glitch effect is visually impressive but scored lower on usability.

### 10. Social Proof at Entry
Top marketplaces display transaction counts ("2,500+ bookings this month"), verified alumni/buyer counts, or review highlights on the homepage/browse page. This establishes platform credibility before users interact with any listing. For AlumNow, showing "X alumni available for mentorship" or "Y successful connections" above the browse grid would serve this pattern.

---

## Specific Examples with URLs and Analysis

### 1. Creative Apes Marketplace — Awwwards Nominee (Mar 2026)
**URL:** https://marketplace.creativeapes.design

**What makes it great:**
- Immersive 3D hero section with WebGL shader effects (fluid reveal, prism liquid) that auto-play on scroll
- Bento grid layout for feature components — each component type (gallery, shader, menu) gets its own sized cell
- Magnetic dock menu and 3D cylindrical menu as navigation elements — experimental but memorable
- Framer-based micro-interactions throughout: hover scale, magnetic cursor following, scroll-triggered reveals
- Dark theme with vibrant accent colors (neon green, electric indigo) on void black backgrounds

**Takeaways for AlumNow:** The bento grid layout pattern for feature sections is directly applicable. The 3D cylindrical menu is over-engineered for a discovery platform, but the staggered scroll animations and card hover states are worth adopting.

---

### 2. DeLorean Marketplace — Awwwards Honorable Mention (Jun 2025)
**URL:** https://marketplace.delorean.com

**What makes it great:**
- Minimal black (#151515) + red (#DE1E14) color scheme — bold, automotive-brand-aligned
- Mouse glitch parallax effect on hero — creates a tech-forward, premium feel
- Sales analytics dashboard with real-time data visualization
- Glowing line animations that trace paths on scroll — guides visual attention
- Built on Next.js with heavy use of scroll-triggered 3D transforms

**Takeaways for AlumNow:** The glowing line scroll animation is a nice accent but not essential. The real takeaway is the analytics dashboard for sellers — AlumNow could show alumni "profile view" and "connection request" stats.

---

### 3. GET Furniture Marketplace — Awwwards Honorable Mention (Jun 2023)
**URL:** https://get.ru

**What makes it great:**
- "Interior first" design philosophy — product images dominate, UI recedes
- Minimalist white space with micro-interactions on product hover
- 360° product view on scroll — immersive without being heavy
- Clean single-product-per-row layout with generous padding
- Parallax scrolling sections that tell a story

**Takeaways for AlumNow:** The "profile first" approach mirrors what AlumNow should do. Let alumni profile photos and bios dominate the card, with UI chrome minimized.

---

### 4. Sojourn (Airbnb-Inspired Travel Marketplace) — Square UI Pro
**URL:** https://square-ui-sojourn.vercel.app

**What makes it great:**
- Dual explore mode: listing grid + interactive MapLibre map with price-pill markers
- Search pill with destination suggestions, two-month range calendar, guest steppers
- Airbnb-style filters modal with price histogram (dual-thumb range slider), amenity pills, booking options
- All filter state synced to URL via nuqs — shareable and survives reload
- Sticky booking card on detail pages with fee breakdown
- 42 color themes via CSS variables — demonstrates comprehensive theming

**Takeaways for AlumNow:** This is the single most relevant reference. The search pill pattern, URL-synced filters, sticky booking CTA, and dual explore mode (grid + map → grid + swipe) map directly to AlumNow's use case.

---

### 5. Kinguin Digital Goods Marketplace — Case Study by Łukasz Czapor
**URL:** https://www.lukaszczapor.com/case-studies/kinguin

**What makes it great:**
- Complete redesign from research → wireframes → design system → implementation
- Adaptive filtering: game listings show different filters than gift card listings
- Search Wizard: autocomplete + search history + popular searches + featured products (80%+ of users use search)
- Step-based checkout replacing one-pager — reduced cognitive overload
- Product card redesign: replaced ambiguous icons with systematized text labels
- Multi-level navigation menu exposing full product catalog
- Design System (atomic design methodology) unified the entire marketplace
- A/B tested improvements: social proof in CTA section improved conversion by 2%

**Takeaways for AlumNow:** This is the most actionable case study. The adaptive filtering pattern (different filters for different alumni types — students searching for mentors vs. alumni looking to offer help) and the search wizard are directly applicable.

---

### 6. Kleinanzeigen (Germany's Largest Classifieds) — UX Design Awards 2025
**URL:** https://ux-design-awards.com/winners/2025-2-kleinanzeigen

**What makes it great:**
- Deep user research drove redesign — analyzed hundreds of thousands of user comments
- Fraud reduction features built into UX (buyer protection, trust signals)
- WCAG AA/AAA compliance in both light and dark modes
- Highly accessible and inclusive design serving a wide demographic
- Sustainability-focused messaging integrated into product experience

**Takeaways for AlumNow:** The accessibility compliance and trust architecture are worth studying. AlumNow should ensure WCAG AA at minimum — dark mode support, proper contrast ratios, skip navigation, ARIA labels on profile cards.

---

### 7. Thrive Market — Webby Award Winner, Fast Company Innovation by Design
**URL:** https://www.codeandtheory.com/things-we-make/thrive-market

**What makes it great:**
- Clean, editorial-style product presentation
- Personalization strategy integrated into every screen
- Subscription model UX done right — clear value prop, one-click reorder
- Award-winning visual design aesthetic

**Takeaways for AlumNow:** The personalization pattern — showing alumni based on user's major, graduation year, interests — would significantly improve discovery relevance.

---

### 8. Trendyol Seller Center — iF Design Award 2026
**URL:** https://ifdesign.com/en/winner-ranking/project/trendyol-seller-center/744480

**What makes it great:**
- AI-powered platform for sellers with predictive recommendations ("Ortak" AI assistant)
- Real-time insights, personalized growth strategies
- Dynamic interface adapting to seller behavior
- Proactive design approach — not reactive

**Takeaways for AlumNow:** While this is seller-side, the AI-powered recommendation pattern can apply to alumni matching — "alumni you might want to connect with based on your profile."

---

### 9. B2C Marketplace Storefront — Mercur Open Source
**URL:** https://github.com/socialdigitalcommerce/b2c-marketplace-storefront

**What makes it great:**
- Open source reference implementation for multi-vendor marketplaces
- Clean homepage with category carousels, featured products, and vendor showcases
- Listing page with image gallery, attributes grid, and vendor info sidebar
- Shopping cart with multi-vendor support

**Takeaways for AlumNow:** The vendor (alumni) profile page layout with social proof elements is a useful reference for AlumNow's alumni detail pages.

---

### 10. Godly Goods — Christian Marketplace
**URL:** https://godlygoods.com

**What makes it great:**
- Curated "Featured Brands" and "Featured Seller" sections above the fold
- Mission-driven design that communicates values immediately
- Clean typography with generous white space
- Simple homepage navigational clarity: "Shop" → "Sell" → "About"

**Takeaways for AlumNow:** The curated "Featured Alumni" section pattern — showing hand-picked alumni profiles — would add warmth and community feel to the browse page.

---

## Color & Typography Trends

### Color Palettes (2025-2026)

| Trend | Usage | Example Sites |
|-------|-------|---------------|
| **Dark Mode as Default** | Void black (#0B0B0F) backgrounds with frosted glass panels | Creative Apes, DeLorean, Portal Bento |
| **Neon Accents on Dark** | Phosphor green (#39FF14), electric indigo (#6366F1) on black | Creative Apes Marketplace, Rocket templates |
| **Monochromatic + One Bold Accent** | Single accent color (red, green, indigo) on white/gray | DeLorean (red #DE1E14), GET (green accents) |
| **Warm Neutrals + Earth Tones** | Beige, warm gray, terracotta for service/community marketplaces | Godly Goods, Thrive Market |
| **Glassmorphism Overlays** | 6-12% opacity white with 12px blur on card surfaces | Portal Bento, Creative Apes |

### Typography Trends

- **Headlines:** Oversized (72px+) grotesque sans-serif fonts (DM Sans, Inter, Space Grotesk) with tight tracking
- **Body:** Clean geometric sans-serif at 14-16px for maximum readability
- **Data/Metrics:** Monospace fonts (JetBrains Mono, SF Mono) for numbers, stats, prices
- **Hierarchy:** Size + weight differentiation rather than color-only differentiation (accessibility best practice)
- **Line height:** 1.5-1.6 for body text, 1.1-1.2 for headlines

### Recommended Stack for AlumNow

```
Primary font: Inter or Plus Jakarta Sans (clean, modern, excellent readability)
Monospace: JetBrains Mono (for stats, counts, metrics)
Scale: 14px body → 16px body (large) → 24px H3 → 32px H2 → 48px+ H1
```

---

## Animation & Motion Patterns

### Scroll-Triggered Animations
- **Staggered fade-in cards:** Cards animate in sequence as the user scrolls (100-150ms delay between each)
- **Parallax backgrounds:** Subtle (10-20px) parallax on hero sections
- **Scroll progress indicator:** Thin bar at top of page showing reading position

### Hover/Interaction Micro-Animations
- **Card lift:** translateY(4-8px) + shadow increase + 1-2px border highlight on hover
- **Magnetic cursor:** Cursor-attracting effect on CTAs (DeLorean, Creative Apes)
- **Smooth scale:** 1.02x scale on card hover with 200ms cubic-bezier transition
- **Button ripple:** Material-style ripple on click for primary actions

### Transition Patterns
- **Route transitions:** 200-300ms fade + slight slide between pages
- **Filter/sort transitions:** 200ms opacity crossfade when results update
- **Modal/drawer:** Slide-up from bottom on mobile, scale-in with backdrop blur on desktop

### Implementation Recommendations (Framer Motion)

```tsx
// Card hover animation
<motion.div
  whileHover={{ y: -6, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="rounded-xl bg-white shadow-sm hover:shadow-lg"
>
  {/* Card content */}
</motion.div>

// Staggered entrance for grid items
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  <ProfileCard alumni={alumni} />
</motion.div>

// Filter results transition
<AnimatePresence mode="wait">
  <motion.div
    key={filterKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <ResultsGrid />
  </motion.div>
</AnimatePresence>
```

---

## Mobile Patterns

### Navigation Architecture
- **Bottom tab bar** (4-5 items): Home, Search/Browse, Favorites, Messages, Profile
- **Floating action button** (FAB): Primary action (Book connection, Send message)
- **Top bar**: Collapsed search pill that expands to full search overlay on tap

### Browse/Grid on Mobile
- **Single column card feed** by default (full-width cards with image, name, role, key stats)
- **Option to toggle to 2-column grid** for denser browsing
- **Swipeable cards** for quick accept/reject pattern (AlumNow's existing swipe view)
- **Infinite scroll** with skeleton loaders (not pagination buttons)

### Filter on Mobile
- **Filter button** fixed at bottom of screen (above tab bar) opens bottom sheet
- **Bottom sheet filters** with pill chips, range sliders, and apply/clear buttons
- **Active filter badges** shown as horizontal scrollable chip row above results
- **Filter count badge** on the filter button showing number of active filters

### Detail Page on Mobile
- **Sticky bottom CTA bar** (always visible) with primary action
- **Image-first layout** with horizontally scrollable image gallery
- **Collapsible sections** for longer content (about, reviews, experience)
- **Swipe to go back** gesture support

---

## Actionable Recommendations for AlumNow Marketplace

### Priority: High (Immediate Impact)

#### 1. Persistent Filter State Across Views
Currently, switching between grid and swipe views likely loses filter state. Implement URL-synced filter state (using `nuqs` or `next-usequerystate`):
```tsx
import { useQueryState } from 'nuqs'

const [major, setMajor] = useQueryState('major')
const [year, setYear] = useQueryState('gradYear')
const [industry, setIndustry] = useQueryState('industry')
```

#### 2. Trust Signals at Card Level
Add verification badges, response rates, and "available now" indicators directly on profile cards — not just on the detail page. Use systematized text labels (like Kinguin) rather than ambiguous icons.

```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  {alumni.verified && (
    <span className="flex items-center gap-1 text-emerald-600">
      <VerifiedIcon className="h-3 w-3" /> Verified
    </span>
  )}
  <span>{alumni.responseRate}% response rate</span>
  {alumni.available && (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
      Available this week
    </span>
  )}
</div>
```

#### 3. Sticky Search + Filter Bar
The search bar should be persistent and centered (like the shadcn/ui Marketplace Navbar). Filter pills should show as horizontal scrollable chips above the results.

#### 4. Adaptive Filter Sets
Different alumni types should surface different filters. For example:
- Students browsing → show filters: Major, Grad Year, Industry, Location, Availability
- Alumni browsing → show filters: Industry, Company, Role, Years of Experience, Willing to Mentor

### Priority: Medium (Next Sprint)

#### 5. Bento Grid Hero Section
Replace the current simple hero with a bento grid showcasing featured alumni, stats, and a value proposition:
```
┌──────────────────────┬──────────────┐
│  Large Hero Image /   │   "2,500+   │
│  Featured Alumni Card  │  connections"│
│  (2x2)                │  statistic   │
│                       ├──────────────┤
│                       │  Categories  │
│                       │  as pills    │
├──────────────────────┴──────────────┤
│  "Browse by industry" chip row      │
└─────────────────────────────────────┘
```

#### 6. URL-Synced Filters for Shareable Searches
All filter state (major, industry, graduation year, availability) should be encoded in the URL so users can bookmark and share filtered searches.

#### 7. Animated Card Micro-Interactions
Add subtle hover lift (4px) and smooth entrance animations for the grid cards. Use Framer Motion's `AnimatePresence` for filter result transitions.

#### 8. Alumni Dashboard (Seller-Side UX)
Give alumni profile-view stats: how many times their profile was viewed, how many connection requests received, response rate. Pattern from Kinguin and Trendyol Seller Center.

### Priority: Lower (Future Roadmap)

#### 9. Dual-Explore Mode Enhancement
If AlumNow has grid and swipe views, add a third view — a compact list view (like LinkedIn search results). Let users toggle between them.

#### 10. AI-Powered Matching
Add "Alumni you might want to connect with" section using AI matching based on profile similarity, shared interests, or career trajectory. Pattern from Trendyol Seller Center's recommendation engine.

#### 11. Step-Based Booking Flow
Replace any single-page booking flow with a step wizard:
1. Select date/time
2. Choose meeting type (video, phone, in-person)
3. Confirm details + message
4. Confirmation with calendar add

#### 12. Dark Mode
Implement a full dark mode using CSS variables. Follow Kleinanzeigen's lead — ensure WCAG AA contrast in both modes.

---

## Code Snippets & Techniques

### Bento Grid Layout (CSS Grid)

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
  {/* Hero cell — spans 2x2 */}
  <div className="col-span-1 row-span-1 md:col-span-2 md:row-span-2 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
    <FeaturedAlumniCard alumni={featured} />
  </div>

  {/* Stat cell */}
  <div className="rounded-2xl bg-muted p-6">
    <p className="text-3xl font-bold">2,500+</p>
    <p className="text-sm text-muted-foreground">Connections made</p>
  </div>

  {/* Category pills */}
  <div className="rounded-2xl bg-muted p-6">
    <CategoriesRow categories={categories} />
  </div>

  {/* Full-width bottom row */}
  <div className="md:col-span-3 rounded-2xl bg-muted p-6">
    <IndustryChips />
  </div>
</div>
```

### URL-Synced Filter State with nuqs

```tsx
// hooks/useAlumniFilters.ts
import { useQueryState, useQueryStates } from 'nuqs'
import { parseAsString, parseAsArrayOf } from 'nuqs'

export function useAlumniFilters() {
  const [search, setSearch] = useQueryState('q')
  const [major, setMajor] = useQueryState('major')
  const [industry, setIndustry] = useQueryState('industry')
  const [gradYear, setGradYear] = useQueryState('gradYear')
  const [availability, setAvailability] = useQueryState('available', {
    parse: (v) => v === 'true',
    serialize: (v) => v ? 'true' : 'false',
  })

  return {
    filters: { search, major, industry, gradYear, availability },
    setters: { setSearch, setMajor, setIndustry, setGradYear, setAvailability },
    isFiltered: !!(search || major || industry || gradYear || availability),
    clearAll: () => {
      setSearch(null)
      setMajor(null)
      setIndustry(null)
      setGradYear(null)
      setAvailability(null)
    },
  }
}
```

### Adaptive Filter Component (Kinguin-Inspired)

```tsx
// The filter set adapts based on the user's role
const FILTER_SETS = {
  student: [
    { id: 'major', label: 'Major', type: 'multi-select', options: majors },
    { id: 'industry', label: 'Industry', type: 'multi-select', options: industries },
    { id: 'gradYear', label: 'Graduation Year', type: 'range', min: 1990, max: 2026 },
    { id: 'available', label: 'Available Now', type: 'boolean' },
  ],
  alumni: [
    { id: 'industry', label: 'Industry', type: 'multi-select', options: industries },
    { id: 'company', label: 'Company', type: 'autocomplete', options: companies },
    { id: 'role', label: 'Role', type: 'multi-select', options: roles },
    { id: 'mentoring', label: 'Willing to Mentor', type: 'boolean' },
  ],
  admin: [
    { id: 'verification', label: 'Verification Status', type: 'multi-select', options: ['verified', 'pending', 'unverified'] },
    { id: 'lastActive', label: 'Last Active', type: 'date-range' },
    { id: 'connectionCount', label: 'Connections', type: 'range', min: 0, max: 1000 },
  ],
}

export function AlumniFilters({ userType }: { userType: 'student' | 'alumni' | 'admin' }) {
  const activeFilters = FILTER_SETS[userType]

  return (
    <div className="space-y-6">
      {activeFilters.map((filter) => (
        <FilterSection key={filter.id} filter={filter} />
      ))}
    </div>
  )
}
```

### Sticky Book/Connect CTA (Mobile)

```tsx
// Fixed to bottom of viewport on mobile, side panel on desktop
export function BookingCTA({ alumni }) {
  return (
    <>
      {/* Mobile: fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">${alumni.rate}</p>
            <p className="text-xs text-muted-foreground">per session</p>
          </div>
          <Button size="lg" className="rounded-full">
            Book a Session
          </Button>
        </div>
      </div>

      {/* Desktop: sticky sidebar card */}
      <div className="sticky top-24 hidden md:block">
        <Card className="rounded-xl p-6 shadow-lg">
          <p className="text-2xl font-bold">${alumni.rate}</p>
          <p className="mb-4 text-sm text-muted-foreground">per session</p>
          <Button className="w-full rounded-full" size="lg">
            Book a Session
          </Button>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldIcon className="h-3 w-3" />
            Secure booking. Cancel anytime.
          </div>
        </Card>
      </div>
    </>
  )
}
```

### Filter Pills with Active State (Horizontal Scroll)

```tsx
export function ActiveFilterPills() {
  const { filters, setters } = useAlumniFilters()

  const activeFilters = Object.entries(filters).filter(([_, value]) => value != null && value !== '')

  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm whitespace-nowrap"
        >
          <span className="font-medium capitalize">{key}:</span>
          <span>{String(value)}</span>
          <button
            onClick={() => setters[`set${capitalize(key)}`](null)}
            className="ml-1 text-primary hover:text-primary/80"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={() => clearAll()}
        className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
      >
        Clear all
      </button>
    </div>
  )
}
```

### Profile Card with Trust Signals

```tsx
export function AlumniProfileCard({ alumni }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
      {/* Status badge */}
      {alumni.availableNow && (
        <span className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-medium text-white">
          Available
        </span>
      )}

      {/* Avatar + Name */}
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-border">
          <AvatarImage src={alumni.avatar} />
          <AvatarFallback>{alumni.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">{alumni.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{alumni.role} @ {alumni.company}</p>
        </div>
      </div>

      {/* Key stats row */}
      <div className="mt-4 flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1 text-emerald-600">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified
        </span>
        <span className="text-muted-foreground">
          {alumni.responseRate}% response
        </span>
        <span className="text-muted-foreground">
          {alumni.connections}+ connections
        </span>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {alumni.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {tag}
          </span>
        ))}
        {alumni.tags.length > 3 && (
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            +{alumni.tags.length - 3}
          </span>
        )}
      </div>

      {/* CTA */}
      <Button className="mt-4 w-full rounded-full" variant="outline">
        View Profile
      </Button>
    </div>
  )
}
```

---

## Sources & References

1. **Awwwards Marketplace Category** — https://www.awwwards.com/websites/e-commerce/
2. **Creative Apes Marketplace** — https://www.awwwards.com/sites/creative-apes-marketplace
3. **DeLorean Marketplace** — https://www.awwwards.com/sites/delorean-marketplace
4. **GET Furniture Marketplace** — https://www.awwwards.com/sites/get-a-furniture-marketplace
5. **Kinguin Case Study** (Łukasz Czapor) — https://www.lukaszczapor.com/case-studies/kinguin
6. **Sojourn Travel Marketplace** — https://pro.lndevui.com/templates/sojourn
7. **Kleinanzeigen UX Design Award** — https://ux-design-awards.com/winners/2025-2-kleinanzeigen
8. **Thrive Market (Code and Theory)** — https://www.codeandtheory.com/things-we-make/thrive-market
9. **Trendyol Seller Center (iF Design)** — https://ifdesign.com/en/winner-ranking/project/trendyol-seller-center/744480
10. **LOW/CODE Marketplace UX Guide** — https://www.lowcode.agency/blog/marketplace-ui-ux-design-best-practices-full-guide
11. **Baymard Marketplace UX Benchmark** — https://baymard.com/ux-benchmark/collections/marketplace
12. **shadcn/ui Marketplace Navbar** — https://www.shadcn.io/blocks/navbar-marketplace
13. **Bento Grid Design Guide (SaaSFrame)** — https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide
14. **Mercur B2C Marketplace Storefront** — https://github.com/socialdigitalcommerce/b2c-marketplace-storefront
15. **Godly Goods Marketplace** — https://godlygoods.com
