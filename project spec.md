# AlumNow — Engineering Project Specification

**Purpose of this document:** This is the build spec for engineers/agents implementing AlumNow. It expands the design brief into architecture, data models, API contracts, and per-phase implementation instructions. Nothing in scope has been cut. Read this fully before starting; phases reference each other.

---

## Stack & Architecture

### High-level architecture

```
┌──────────────────────────────────────────────────────┐
│                    Next.js App (monolith)             │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │  Student  │  │  Alumni    │  │  Admin            │ │
│  │  Routes   │  │  Routes    │  │  (/admin hidden)  │ │
│  └──────────┘  └────────────┘  └──────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │        API Routes / Server Actions (Next.js)     │ │
│  │  Auth │ Alumni │ Bookings │ Payments │ Admin     │ │
│  └──────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │        Prisma (SQLite via better-sqlite3)        │ │
│  │  User, Booking, Payment, Review, AlumniProfile   │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

External integrations:
- Google Meet / Calendar API (link generation, "Add to Calendar")
- QS Rankings: static lookup JSON file (manual annual update)
- UPI: static QR image + text input that always verifies (demo)
```

### Stack

- **Frontend:** Next.js 14+ (App Router) + TailwindCSS + shadcn/ui
- **Mobile swipe interaction:** custom `framer-motion` drag-gesture implementation — build custom because off-the-shelf libraries don't handle the "star/save" state + filter-aware deck well.
- **Backend:** Next.js API Routes / Server Actions + Prisma ORM
- **Database:** SQLite via `@prisma/adapter-better-sqlite3` (demo). For production: change the Prisma provider line to `postgresql` and swap to Neon/Supabase — the schema is identical.
- **Auth:** NextAuth.js v5 (credentials provider — bcrypt-ts hashing, rate limiting, refresh token rotation, middleware protection)
- **File storage:** S3-compatible bucket (profile photos, founder headshots, illustrations). For demo: local `/public/uploads/` with a note to migrate.
- **Email:** `lib/email.ts` — logs to console in a formatted box with timestamp, recipient, subject, body (feels real, sends nothing)
- **Payments:** Fake UPI — static QR image + text input with realistic validation/spinner/animation
- **Hosting:** Local development (`npm run dev`) or VM. SQLite is incompatible with Vercel serverless (no persistent filesystem) — for production deployment, switch to Neon (Postgres) or Turso (edge SQLite).

### Global design tokens (reference only — see `alumnow-frontend-skill.md` for full token set)

```css
--color-primary: #1B3A6B;   /* Deep Indigo Blue */
--color-accent:  #F5A623;   /* Warm Amber */
--color-bg:      #F8F9FB;   /* Off-White */
--color-text:    #2C3E50;   /* Charcoal */
--font-family: 'Inter', 'DM Sans', sans-serif;
```

No other colours or font families appear anywhere in the codebase — enforce this in a lint rule or design-token file, not just by convention. The full token set (extended palette, typography scale, spacing, radii, shadows, motion tokens) is defined in `alumnow-frontend-skill.md` — do not duplicate it here.

### Demo deployment note

SQLite stores data in a single file (`prisma/dev.db`). This means:

- Npx prisma migrate dev + npm run dev is all you need — zero external services
- Back up the `.db` file to snapshot demo state
- Does not work on Vercel serverless (no writable filesystem across function instances)
- For production: change `datasource db { provider = "sqlite" }` to `provider = "postgresql"`, set `DATABASE_URL` to a Neon/Supabase connection string, and deploy on Vercel with `@prisma/adapter-pg`

---

## Data Model (Prisma Schema Reference)

This is the full schema as it would appear in `prisma/schema.prisma`. SQLite-compatible types used throughout.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model User {
  id               String    @id @default(cuid())
  role             String    @default("student") // "student" | "alumnus" | "admin"
  email            String    @unique
  passwordHash     String?
  phone            String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  emailVerifiedAt  DateTime?
  googleOauthId    String?   @unique

  studentProfile   StudentProfile?
  alumniProfile    AlumniProfile?
  adminUser        AdminUser?
  bookingsAsStudent Booking[] @relation("StudentBookings")
  bookingsAsAlumni  Booking[] @relation("AlumniBookings")
  paymentsVerified Payment[] @relation("VerifiedBy")
  savedAlumni      SavedAlumni[]
  notificationLogs NotificationLog[]

  accounts Account[]
  sessions Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refreshToken      String?
  accessToken       String?
  expiresAt         Int?
  tokenType         String?
  scope             String?
  idToken           String?
  sessionState      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model StudentProfile {
  id           String  @id @default(cuid())
  userId       String  @unique
  fullName     String
  dateOfBirth  DateTime?
  currentGrade String  @default("AS") // "AS" | "A2" | "Other"
  school       String  @default("JBCN International School Borivali")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model AlumniProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  fullName              String
  profilePhotoUrl       String?
  universityName        String
  course                String
  country               String
  graduationYearJbcn    Int
  currentStudyLevel     String   @default("undergraduate") // "undergraduate" | "postgraduate"
  qsRankingTier         String   @default("unranked") // "top50" | "top100" | "top200" | "unranked"
  bio                   String?
  languages             String   @default("[]") // JSON array stored as string (SQLite)
  linkedinUrl           String?
  verificationStatus    String   @default("pending") // "pending" | "approved" | "rejected"
  avgResponseTimeHours  Float?
  isVerifiedJbcnAlumnus Boolean  @default(false)
  ratingAvg             Float?
  ratingCount           Int      @default(0)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user           User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  availability   AlumniAvailability[]
  sessionTypes   SessionTypeOffering[]
  bookings       Booking[]             @relation("AlumniBookings")
  groupSessions  GroupSession[]
  savedBy        SavedAlumni[]
  reviews        Review[]              @relation("AlumnusReviews")
}

model AlumniAvailability {
  id            String   @id @default(cuid())
  alumniId      String
  dayOfWeek     Int?     // 0-6 (Sun-Sat), null if specificDate is set
  specificDate  DateTime?
  startTime     String   // "09:00" (HH:mm format)
  endTime       String   // "17:00"
  isRecurring   Boolean  @default(true)

  alumni AlumniProfile @relation(fields: [alumniId], references: [id], onDelete: Cascade)
}

model SessionTypeOffering {
  id                  String  @id @default(cuid())
  alumniId            String
  type                String  // "call_30" | "call_45" | "call_60" | "group_40"
  pricePaise          Int     // stored as integer paise (₹1 = 100 paise)
  maxParticipants     Int     @default(1)
  descriptionOneLiner String?

  alumni        AlumniProfile @relation(fields: [alumniId], references: [id], onDelete: Cascade)
  bookings      Booking[]
  groupSessions GroupSession[]
}

model Booking {
  id                  String   @id @default(cuid())
  studentId           String
  alumniId            String
  sessionTypeOfferingId String
  status              String   @default("pending_payment")
  // "pending_payment" | "payment_submitted" | "confirmed" | "completed" | "cancelled" | "no_show"
  scheduledStartAt    DateTime
  scheduledEndAt      DateTime
  meetLink            String?
  groupSessionId      String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  student           User              @relation("StudentBookings", fields: [studentId], references: [id])
  alumni            AlumniProfile     @relation("AlumniBookings", fields: [alumniId], references: [id])
  sessionTypeOffering SessionTypeOffering @relation(fields: [sessionTypeOfferingId], references: [id])
  groupSession      GroupSession?     @relation(fields: [groupSessionId], references: [id])
  payment           Payment?
  review            Review?
}

model GroupSession {
  id                    String   @id @default(cuid())
  alumniId              String
  sessionTypeOfferingId String
  scheduledStartAt      DateTime
  maxParticipants       Int      @default(6)
  currentParticipants   Int      @default(0)
  status                String   @default("open") // "open" | "full" | "completed" | "cancelled"

  alumni              AlumniProfile     @relation(fields: [alumniId], references: [id])
  sessionTypeOffering SessionTypeOffering @relation(fields: [sessionTypeOfferingId], references: [id])
  bookings            Booking[]
}

model Payment {
  id                 String    @id @default(cuid())
  bookingId          String    @unique
  amountPaise        Int
  upiTransactionRef  String?
  status             String    @default("awaiting_ref") // "awaiting_ref" | "submitted" | "verified" | "rejected"
  verifiedByAdminId  String?
  verifiedAt         DateTime?
  createdAt          DateTime  @default(now())

  booking    Booking @relation(fields: [bookingId], references: [id])
  verifiedBy User?   @relation("VerifiedBy", fields: [verifiedByAdminId], references: [id])
}

model Review {
  id                String   @id @default(cuid())
  bookingId         String   @unique
  reviewerType      String   // "student" | "alumnus"
  rating            Int      // 1-5
  text              String?
  moderationStatus  String   @default("pending") // "pending" | "approved" | "rejected"
  createdAt         DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id])
}

model SavedAlumni {
  studentId String
  alumniId  String
  createdAt DateTime @default(now())

  student StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  alumni  AlumniProfile  @relation(fields: [alumniId], references: [id], onDelete: Cascade)

  @@id([studentId, alumniId])
}

model PlatformStat {
  id              String   @id @default(cuid())
  key             String   @unique // "alumni_count" | "universities_count" | "sessions_completed"
  value           Int
  updatedAt       DateTime @updatedAt
  updatedByAdminId String?
}

model PlatformSetting {
  id    String @id @default(cuid())
  key   String @unique // "upi_id" | "upi_qr_image_url"
  value String
}

model NotificationLog {
  id        String   @id @default(cuid())
  userId    String
  eventType String   // "booking_confirmed" | "payment_verified" | "signup_verification"
  sentAt    DateTime @default(now())
  status    String   @default("logged")

  user User @relation(fields: [userId], references: [id])
}

model AdminUser {
  id          String @id @default(cuid())
  userId      String @unique
  permissions String @default("full_access")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Money handling:** always store as integer paise (₹1 = 100 paise). Never use float for price fields — this is a payment system, correctness here is non-negotiable even at small scale.

**Timezones:** store all timestamps in UTC in the DB; render in IST on the frontend. Do not store naive local time.

**SQLite note:** SQLite does not support `Json` or array column types natively. Store `languages` as a JSON string and parse on read. For production PostgreSQL, this becomes `String[]` or `Json`.

---

## Lib Directory Structure

```
src/lib/
├── prisma.ts              # Prisma client singleton with better-sqlite3 adapter
├── auth.ts                # NextAuth v5 config (credentials + Google OAuth + Prisma adapter)
├── auth.config.ts         # Auth config separate for middleware (edge-compatible)
├── email.ts               # Formatted email logger — logs to console in a box
├── utils.ts               # cn(), formatPrice(), formatDate(), formatPhone(), etc.
├── rate-limit.ts          # In-memory rate limiter for auth endpoints
├── validation.ts          # Zod schemas for all API inputs
├── qs-rankings.ts         # Static QS rankings lookup (imports qs_rankings.json)
└── hooks/
    ├── useImagePreloader.ts  # Image preloading for swipe deck
    ├── useReducedMotion.ts   # Reduced motion detection
    └── useDebounce.ts        # Debounced value hook
```

---

## Phases

---

### Phase 1 — Foundation (Database + Auth + Layout)

**Goal:** Skeleton app with database, auth, shared UI, and routing. Everything compiles and renders.

**Complexity:** Medium

**Dependencies:** None

**Files to create:**

```
prisma/
├── schema.prisma              # Full data model (all models above)
├── seed.ts                    # Seed script — see seeding detail below
└── qs_rankings.json           # Static QS tier lookup

prisma.config.ts               # Prisma 7 config (datasource URL)

src/
├── lib/
│   ├── prisma.ts              # Prisma client singleton with PrismaBetterSqlite3 adapter
│   ├── auth.ts                # NextAuth v5 config (credentials + Google OAuth + Prisma adapter)
│   ├── auth.config.ts         # Edge-compatible auth config for middleware
│   ├── email.ts               # Formatted email logger — see detail below
│   ├── utils.ts               # cn(), formatPrice(paise: number): string, formatDate(), formatPhone()
│   ├── rate-limit.ts          # In-memory Map-based rate limiter (100 req/min per IP)
│   └── validation.ts          # Zod schemas: signupSchema, loginSchema, bookingSchema, reviewSchema
├── middleware.ts               # NextAuth middleware — protect /admin, /bookings, /dashboard, /profile
├── types/
│   └── index.ts               # Shared TypeScript types: Role, BookingStatus, VerificationStatus, etc.
├── actions/
│   └── auth.actions.ts        # signup, login, logout, getSession server actions
├── components/
│   ├── ui/                    # shadcn/ui primitives (button, card, input, dialog, select, badge, avatar, toast, skeleton)
│   ├── Navbar.tsx             # Logo + nav links + user menu / login button (N1b canonical SaaS)
│   ├── Footer.tsx             # Links, copyright, social (Ft3: 4-col)
│   ├── AuthGuard.tsx          # Redirects to /login if unauthenticated
│   └── AdminGuard.tsx         # Redirects if role !== ADMIN
└── app/
    ├── layout.tsx             # Root layout: Navbar + Footer + Toaster + SessionProvider
    ├── page.tsx               # Landing page placeholder (hero skeleton)
    ├── login/page.tsx         # Login form: email + password + Google OAuth button
    ├── register/page.tsx      # Signup form: full name, email, phone, DOB, grade, school, password
    └── admin/
        ├── layout.tsx         # Admin sidebar + role check
        └── page.tsx           # Admin dashboard placeholder (4 stat cards)
```

**Key files detail:**

**`lib/email.ts`** — Formatted email logger. Instead of `console.log("Email sent")`, this module logs in a visually distinct box with timestamp, recipient, subject, and body. Example output:

```
┌─────────────────────────────────────────────┐
│  📧 EMAIL                                  │
│  To:       student@example.com             │
│  Subject:  Booking Confirmed — Session with│
│            Priya Sharma                    │
│  Body:     Your session is confirmed for   │
│            July 15, 2026 at 4:00 PM IST.   │
│            Join link will appear 10 min    │
│            before the session.             │
│  Timestamp: 2026-07-11T14:30:00.000Z       │
└─────────────────────────────────────────────┘
```

Interface: `sendEmail(params: { to: string; subject: string; body: string; eventType: string }): Promise<void>` — also writes a `NotificationLog` row to the database.

**`lib/prisma.ts`** — Singleton pattern with Prisma 7 driver adapter:

```typescript
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

**`lib/auth.ts`** — NextAuth v5 with Credentials + Google OAuth providers, Prisma adapter, bcrypt-ts for password hashing.

**`lib/rate-limit.ts`** — Simple in-memory `Map<string, { count: number; resetAt: number }>` rate limiter. 5 attempts per IP per 15 min on login, 3 on signup.

**`lib/validation.ts`** — Zod schemas for every API input. Includes password rules (min 8 chars, at least 1 number), email format, phone (+91 format), paise amount range, rating (1-5), review length (max 200 chars), bio length (max 150 words).

**Seed data detail (`prisma/seed.ts`):**

Creates realistic Indian-named alumni with diverse universities:

| Email | Full Name | University | Course | Country | Grad Year | QS Tier |
|---|---|---|---|---|---|---|
| admin@alumnow.com | — | — | — | — | — | — |
| student1@alumnow.com | Aarav Patel | — | — | — | — | — |
| alumni1@alumnow.com | Priya Sharma | IIT Bombay | B.Tech Computer Science | India | 2022 | top50 |
| alumni2@alumnow.com | Arjun Mehta | Delhi University | B.A. Economics | India | 2021 | top200 |
| alumni3@alumnow.com | Ishita Reddy | BITS Pilani | B.E. Mechanical Engineering | India | 2023 | top100 |
| alumni4@alumnow.com | Vikram Singh | University of Cambridge | M.A. Law | United Kingdom | 2020 | top10 |
| alumni5@alumnow.com | Ananya Gupta | NYU Stern | B.Sc. Business | United States | 2022 | top50 |
| alumni6@alumnow.com | Rohit Joshi | IIT Delhi | B.Tech Electrical Engineering | India | 2021 | top50 |
| alumni7@alumnow.com | Sneha Kapoor | University of Melbourne | B.A. Psychology | Australia | 2023 | top50 |
| alumni8@alumnow.com | Karan Verma | NUS Singapore | B.E. Civil Engineering | Singapore | 2022 | top50 |
| alumni9@alumnow.com | Divya Nair | UCL London | M.Sc. Architecture | United Kingdom | 2021 | top20 |
| alumni10@alumnow.com | Ravi Deshmukh | University of Toronto | B.Sc. Computer Science | Canada | 2023 | top50 |

All passwords: `password123`. Each alumni gets `AlumniProfile` with realistic bios (40-80 words), 2-3 languages, a `universityName` that maps to a QS tier in `qs_rankings.json`, `verificationStatus=approved`, `isVerifiedJbcnAlumnus=true`. Each gets 3-5 `AlumniAvailability` slots (recurring weekly), and 3 `SessionTypeOffering` entries (call_30 at ₹29900 paise, call_60 at ₹49900 paise, group_40 at ₹99900 paise). `PlatformStat` seeded with `alumni_count=10`, `universities_count=10`, `sessions_completed=47`.

**What works after Phase 1:**
- User can register / login / logout
- Session persists via NextAuth JWT
- Admin account seeded: `admin@alumnow.com` / `password123`
- Student account seeded: `student1@alumnow.com` / `password123`
- 10 alumni accounts seeded with realistic profiles
- Navbar shows user name + logout when authenticated
- Landing page renders minimal hero + placeholder sections
- `/admin` routes protected by AdminGuard + middleware
- Rate limiting on auth endpoints
- Email logs formatted output to console
- Prisma migrations run: `npx prisma migrate dev`

---

### Phase 2 — Landing Page + Auth Polish + Alumni Self-Apply

**Goal:** Complete auth experience (forgot/reset password, auto-verify animation, Google OAuth), build the full landing page, and add a demo alumni self-apply flow.

**Complexity:** Medium

**Dependencies:** Phase 1

**Files to create:**

```
src/
├── actions/
│   ├── auth.actions.ts        # (extend) forgotPassword, resetPassword
│   └── alumni.actions.ts      # (new) applyAsAlumni
├── app/
│   ├── page.tsx               # (replace) Full landing page
│   ├── _components/
│   │   ├── PublicNav.tsx      # Landing-specific fixed nav with scroll spy
│   │   ├── HeroSection.tsx    # Headline, subtext, CTAs, inline SVG illustration
│   │   ├── HowItWorksCard.tsx # Single step card (1 of 3)
│   │   ├── HowItWorksSection.tsx # 3x HowItWorksCard in a row
│   │   ├── StatsBar.tsx       # Fetch GET /api/public/stats, animated count-up
│   │   ├── TestimonialCard.tsx # Config-driven testimonial card
│   │   ├── TestimonialsSection.tsx # 3x TestimonialCard
│   │   └── MarkdownContent.tsx # react-markdown renderer
│   ├── about/page.tsx         # About Us + Founders Note (markdown-rendered)
│   ├── privacy/page.tsx       # Placeholder privacy page
│   ├── terms/page.tsx         # Placeholder terms page
│   ├── apply/page.tsx         # Alumni self-apply form with auto-approve animation
│   ├── alumni/dashboard/page.tsx # Post-apply placeholder dashboard
│   └── api/public/stats/route.ts # GET public stats endpoint
├── content/
│   ├── about.md               # About Us markdown
│   └── founders.md            # Founder note markdown
├── data/
│   └── testimonials.json      # 3 placeholder testimonials
└── middleware.ts              # (extend) Add /apply and /alumni/* to auth-protected routes
```

**Auto-verify flow detail (student signup):**
On signup, the UI shows a realistic loading sequence:
1. Form submission button changes to "Creating your account..." spinner (800ms)
2. Transition to "Verifying your email..." with a pulsing amber dot animation (1.2s)
3. Green checkmark appears with "Email verified!" text (300ms)
4. "Redirecting to Browse..." (400ms)
5. Pushes to `/browse`

The full sequence takes ~2.7s — feels like real verification is happening. For production, this is replaced with a "Check your email" screen and an actual verification link.

**Alumni self-apply flow detail (new):**
A demo-only feature. Alumni apply via `/apply` with a form (name, email, phone, password, university, course, grad year, country, bio, languages). On submit:
1. Creates User + AlumniProfile in a transaction with `verificationStatus: "approved"` (auto-approve for demo)
2. Creates 4 default session offerings and 5 default availability slots
3. Auto-approval animation (3.0s): "Creating your profile..." (800ms) -> "Verifying your JBCN alumni status..." (1.2s) -> green checkmark + "Profile approved!" (600ms) -> redirect to `/alumni/dashboard`
4. Profile photo set to `https://picsum.photos/seed/{name}/400/400`
5. Console email logs welcome notification

Navigation links to `/apply` appear on the landing page ("Are you an alumnus? Apply to mentor") and login page.

**What works after Phase 2:**
- Complete auth: signup, login, logout, forgot password, reset password, Google OAuth
- Auto-verify animation on signup (2.7s feel-real sequence)
- Alumni self-apply with auto-approval animation (3.0s)
- New alumni appear in browse immediately with pre-configured pricing + availability
- Landing page: Hero -> How It Works -> Stats -> Testimonials -> Footer
- Stats fetched from `PlatformStat` table (cached 5 min, admin-editable)
- Testimonials driven by `data/testimonials.json` config array
- About page renders markdown from `content/about.md` + `content/founders.md`
- Privacy & Terms placeholder pages
- PublicNav with scroll spy, mobile hamburger, scroll-state styling
- StatsBar with skeleton loading, animated counters, and fallback on API error
- Mobile-responsive layout pass for all landing sections
- All form states: loading, error, validation, success animations

---

### Phase 3 — Browse & Discovery (Alumni Cards + Filters + Swipe)

**Goal:** Core product page — browse alumni with filters, desktop grid, mobile swipe deck, save/skip.

**Complexity:** Hard (highest-risk component)

**Dependencies:** Phase 2

**Files to create:**

```
src/
├── actions/
│   ├── alumni.actions.ts      # listAlumni (filters + pagination), getAlumniById,
│   │                          #   getFilterOptions, saveAlumni, unsaveAlumni
│   └── student.actions.ts     # getSavedAlumni
├── components/
│   ├── AlumniCard.tsx         # Card with variant prop: "grid" | "swipe"
│   ├── AlumniGrid.tsx         # Responsive grid 1->2->3->4 cols, infinite scroll
│   ├── SwipeDeck.tsx          # Framer Motion drag="x" deck, AnimatePresence
│   ├── FilterPanel.tsx        # University, country, course, grad year, QS tier,
│   │                          #   availability, session type — collapsible drawer on mobile
│   ├── SearchBar.tsx          # Debounced 300ms input, placeholder: "Search universities or courses..."
│   ├── SavedTab.tsx           # Toggle between Browse / Saved with count badge
│   └── CountryFlag.tsx        # Flag emoji component from country code
├── lib/
│   └── hooks/
│       ├── useImagePreloader.ts  # Preloads next N card images
│       └── useDebounce.ts        # Generic debounced value hook
└── app/
    └── browse/
        └── page.tsx           # Browse page: SearchBar + FilterPanel + SavedTab + AlumniGrid/SwipeDeck
```

**Swipe deck detail (highest-risk UI):**
- Single card visible at a time, `position: absolute`, stacked DOM
- `framer-motion`: `drag="x"`, `onDragEnd` with velocity + offset threshold
- Swipe right (positive x > 100px OR velocity > 500px/s) -> saves to SavedAlumni, card exits right
- Swipe left (negative x < -100px OR velocity < -500px/s) -> skip (client-side only, no persistence)
- Undo button appears for 3s after swipe, then fades — restores the last card
- Keyboard accessibility: ArrowLeft/ArrowRight + visible Star/Skip buttons
- Cards pre-loaded (current + next 2 buffered), images preloaded via `useImagePreloader`
- See `alumnow-frontend-skill.md` for full implementation detail (Section 5)

**What works after Phase 3:**
- GET `/api/alumni?filters...` returns paginated approved alumni
- Desktop: 3-4 column responsive grid with infinite scroll
- Mobile: full-bleed swipe deck with Framer Motion drag
- Swipe right = save (optimistic UI), swipe left = skip (session-only)
- Undo last swipe (3s window)
- Filters: university (searchable), country (with flags), course, study level, grad year, QS tier, availability, session type
- Filters combine with AND logic, debounced 300ms, persisted in URL params
- Search bar live-filters in addition to active filters
- Saved tab shows starred alumni, toggle between Browse/Saved
- Empty states: "No alumni match your filters" + clear all link
- 12 skeleton cards during loading

---

### Phase 4 — Alumni Profiles (Profile Page + Availability + Reviews)

**Goal:** Individual alumni profile page with availability calendar, session pricing, reviews.

**Complexity:** Medium

**Dependencies:** Phase 3

**Files to create:**

```
src/
├── actions/
│   ├── availability.actions.ts # getAvailability, getBookedSlots
│   └── review.actions.ts      # getReviews (approved only, paginated)
├── components/
│   ├── ProfileHeader.tsx      # Photo, name, university, course, badges
│   ├── BioSection.tsx         # Bio text (max 150 words), languages, response time badge
│   ├── AvailabilityCalendar.tsx # Weekly 7-col grid, green = available, grey = booked, dimmed = past
│   ├── SessionPricingCard.tsx # 4 cards: call_30/call_45/call_60/group_40 with prices
│   ├── ReviewList.tsx         # Approved reviews, sorted by recent
│   ├── ReviewCard.tsx         # Stars + text (200 chars max) + first name + grade
│   ├── VerifiedBadge.tsx      # Blue verified check badge
│   └── ResponseTimeBadge.tsx  # "Responds within Xh" badge
├── lib/
│   └── hooks/
│       └── useAvailability.ts # Merges availability + booked slots, computes open slots
└── app/
    └── alumni/
        └── [id]/
            └── page.tsx       # Full alumni profile page
```

**Availability calendar detail:**
- 7-column grid (Mon-Sun), time slots as rows (30 min intervals)
- Queries `AlumniAvailability` (both recurring + one-off slots)
- Subtracts existing `Booking` records with `status != cancelled` to compute open slots
- Available: green tint, clickable -> creates booking draft (`POST /api/bookings/draft`)
- Booked: grey, strikethrough, tooltip "Booked"
- Past: dimmed, unclickable
- Today column: subtle blue left-border indicator
- Empty state: "No availability set" (hides calendar section)

**SessionPricingCard detail:**
- Renders each `SessionTypeOffering` as a selectable card
- Selected card highlighted in `--color-primary`
- Group session card shows live capacity: "3 of 6 spots filled" (computed at render time)
- Price formatted as ₹299, ₹499, ₹999 (converted from paise)

**What works after Phase 4:**
- Full alumni profile: photo, university, course, bio, languages, badges
- Availability calendar with real open/blocked slot computation
- Session type cards with pricing (30/45/60 min 1:1, group 40 min)
- Group session live capacity display
- Reviews section (approved only, first name + grade only, most recent first)
- Verified badge + response time badge
- "Book Now" button creates booking draft and routes to booking flow

---

### Phase 5 — Booking & Payment (Complete Booking Flow + Student Dashboard)

**Goal:** End-to-end booking flow with fake but realistic payment, student dashboard.

**Complexity:** Medium

**Dependencies:** Phase 4

**Files to create:**

```
src/
├── actions/
│   ├── booking.actions.ts     # createBookingDraft, confirmBooking, getMyBookings,
│   │                          #   cancelBooking, getBookingById
│   └── payment.actions.ts     # submitPaymentRef (always auto-verifies in demo)
├── components/
│   ├── BookingSummaryCard.tsx # Session details: alumnus name, date, time, price
│   ├── PaymentModal.tsx       # Fake UPI flow — see detail below
│   ├── ConfirmationScreen.tsx # Green check, session details, Meet link, Add to Calendar
│   ├── CountdownTimer.tsx     # Client-side countdown to session start
│   └── ReviewForm.tsx         # 1-5 star rating + text (max 200 chars)
└── app/
    ├── book/[draftId]/
    │   └── page.tsx           # 3-step wizard: confirm -> payment -> confirmation
    ├── bookings/
    │   └── page.tsx           # Student bookings: upcoming + past tabs
    └── dashboard/
        └── page.tsx           # Student dashboard: upcoming, past, saved, settings tabs
```

**PaymentModal detail (fake UPI, must feel real):**

The fake payment flow is deliberately designed to feel like a real UPI transaction:

1. **Static QR code:** A 200x200px PNG image is displayed, styled as a realistic UPI QR. For demo, use a generated placeholder QR that contains the text `alumnow@upi` encoded. The image is stored as a static asset at `/public/images/upi-qr-demo.png` with a note to replace with admin-uploaded version later. The QR is displayed inside a card with rounded corners and a subtle shadow, mimicking PhonePe/Google Pay styling.

2. **UPI ID:** Displayed prominently below the QR: `alumnow@upi` in a selectable, copyable `<code>` block with a "Copy" button that shows "Copied!" feedback.

3. **UPI reference input:** A text input labeled "Enter UPI transaction reference" with:
   - Placeholder: "e.g. UPI-XXXXXXXX" (alphanumeric, 8-16 chars)
   - Client-side validation: min 8 chars, alphanumeric only, regex `/^[A-Za-z0-9]{8,}$/`
   - Error message if validation fails (shown inline in red)
   - Submit button: amber (`--color-accent`), full-width, disabled until input is valid

4. **Verification animation (1.5s total):**
   - t=0ms: Button changes to spinner + "Verifying payment..."
   - t=800ms: Spinner text changes to "Confirming with UPI network..."
   - t=1500ms: Spinner disappears, green checkmark icon animates in (scale 0->1, 200ms)
   - t=1700ms: Toast appears "Payment verified!" (auto-dismiss 4s)
   - t=2000ms: Modal closes, transitions to confirmation screen

5. **Always succeeds in demo.** For production, `Payment.status` would update to `submitted` and require admin approval. The demo skips the admin check entirely — `Payment.status` goes directly to `verified`, `Booking.status` to `confirmed`.

**ConfirmationScreen detail:**
- Large green checkmark with "Session Confirmed!" text
- Session details card: alumnus name + photo, date, time, duration, amount
- Google Meet link: placeholder text "Link will appear 10 minutes before session" (if no `meetLink` set yet)
- "Add to Google Calendar" button: uses `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...` template URL (no OAuth needed)
- "Go to Dashboard" CTA button

**Dashboard tabs:**
- **Upcoming:** Cards with countdown timer, alumnus name/photo, join button (active 10 min before -> end), cancel button
- **Past:** Past session cards with "Leave a Review" button (only if no review exists yet)
- **Saved:** Grid of SavedAlumni cards, remove from saved (optimistic)
- **Settings:** Edit name, email, phone, grade, profile photo upload

**What works after Phase 5:**
- Booking draft created on slot select
- 3-step booking wizard: confirm -> payment -> confirmation
- Realistic UPI payment with QR, UPI ID, validation, verification animation (1.5s)
- Instant confirmation with Add to Calendar
- Student dashboard: upcoming (with countdown + join), past (with review CTA), saved, settings
- Booking cancellation
- Review form (1-5 stars, max 200 chars)
- Receipts viewable as printable page

---

### Phase 6 — Admin Panel (Full CRUD)

**Goal:** Complete admin panel for managing alumni, bookings, payments, reviews, settings.

**Complexity:** Medium

**Dependencies:** Phase 5

**Files to create:**

```
src/
├── actions/
│   └── admin.actions.ts      # getAllBookings, getAllUsers, updateAlumniProfile,
│                              #   updatePlatformStat, updateUpiSettings,
│                              #   moderateReview, getPendingReviews, exportCsv
├── components/
│   ├── AdminAlumniTable.tsx    # All alumni: search, inline edit, soft-delete toggle, create
│   ├── AdminAlumniForm.tsx     # Create/edit alumni form
│   ├── AdminBookingsTable.tsx  # All bookings: filter by status/date, paginated
│   ├── AdminUsersTable.tsx     # All users list
│   ├── AdminPlatformSettings.tsx # UPI ID, QR upload, stats editor
│   ├── AdminReviewModeration.tsx # Pending reviews with approve/reject
│   ├── AdminCsvExportButton.tsx # Export bookings CSV
│   └── AdminStatCard.tsx       # Stat card (total alumni, bookings, revenue, pending reviews)
└── app/
    └── admin/
        ├── dashboard/page.tsx     # 4 stat cards
        ├── alumni/page.tsx        # Alumni CRUD table
        ├── bookings/page.tsx      # All bookings (filterable, exportable)
        ├── users/page.tsx         # User management
        ├── settings/page.tsx      # UPI + platform stats + QR upload
        └── reviews/page.tsx       # Review moderation (approve/reject)
```

**What works after Phase 6:**
- Admin dashboard with 4 stat cards (total alumni, total bookings, revenue, pending reviews)
- View/edit/soft-delete/create all alumni profiles
- View all bookings with status/date range filters
- CSV export of bookings data
- Edit UPI ID + upload QR image (via `PlatformSetting` table)
- Edit platform stats (alumni_count, universities_count, sessions_completed)
- Moderate reviews (approve/reject, filter by pending)
- All tables paginated and sortable

---

### Phase 7 — Alumni Account (Profile Edit + Availability + Pricing)

**Goal:** Alumni can log in, edit their profile, set availability, and manage pricing.

**Complexity:** Easy

**Dependencies:** Phase 4

**Files to create:**

```
src/
├── actions/
│   ├── alumni-profile.actions.ts # updateProfile, updateAvailability, updateSessionPricing
│   └── availability.actions.ts   # setRecurringSlots, setOneOffSlots, deleteSlot
├── components/
│   ├── AvailabilityEditor.tsx    # Set recurring weekly availability + one-off slots
│   ├── PricingEditor.tsx         # Set per-session-type prices
│   └── ProfileEditor.tsx         # Edit bio, photo, linkedin, languages
└── app/
    └── alumni/
        ├── dashboard/page.tsx         # Alumni dashboard: upcoming sessions
        ├── profile/page.tsx           # Profile view (read-only)
        ├── profile/edit/page.tsx      # Edit profile form
        ├── profile/availability/page.tsx # Manage availability calendar
        └── profile/pricing/page.tsx   # Manage session pricing
```

**What works after Phase 7:**
- Alumni can log in and view their dashboard (upcoming bookings)
- Edit profile: photo (upload to `/public/uploads/`), bio, languages, LinkedIn URL
- Set recurring weekly availability + one-off slots
- Set pricing per session type (30/45/60 min 1:1, group)
- View their upcoming bookings with student details
- Cannot self-verify (verification is admin-only)

---

## Demo Notes (All Faked Things and How They're Maxed)

### Payments (fake UPI)
- QR code: Realistic-looking PNG placed at `/public/images/upi-qr-demo.png`, rendered inside a card mimicking PhonePe/Google Pay styling
- UPI ID: `alumnow@upi` — displayed in a selectable `<code>` block with a copy button
- Input validation: min 8 alphanumeric chars, regex `/^[A-Za-z0-9]{8,}$/`, inline error styling
- Verification animation: 1.5s total with spinner, two status messages ("Verifying payment..." -> "Confirming with UPI network..."), then green check (scale 0->1 spring)
- Always succeeds — `Payment.status` goes directly to `verified`, `Booking.status` to `confirmed`
- For production: replace with actual UPI gateway, require admin manual verification

### Emails (fake, but formatted)
- `lib/email.ts` logs to console in a boxed format with timestamp, recipient, subject, body
- Also writes a `NotificationLog` row to the database
- Events logged: signup verification, booking confirmed, payment verified
- For production: swap `lib/email.ts` to use SendGrid/Postmark + BullMQ for async sending

### Auth auto-verify
- On signup, a 2.7s realistic loading sequence plays: "Creating account..." (800ms) -> "Verifying email..." (1.2s with pulsing amber dot) -> green check (300ms) -> "Redirecting..." (400ms)
- `User.emailVerifiedAt` is set to `now()` on signup — no actual verification needed
- For production: set `emailVerifiedAt = null`, send real verification email

### Seed data
- 10 alumni with realistic Indian names (Priya Sharma, Arjun Mehta, Ishita Reddy, etc.)
- Universities: IIT Bombay, Delhi University, BITS Pilani, Cambridge, NYU Stern, IIT Delhi, University of Melbourne, NUS Singapore, UCL London, University of Toronto
- Each has a realistic bio (40-80 words), 2-3 languages, multiple availability slots
- Prices in paise: ₹299 (30 min), ₹499 (60 min), ₹999 (group)
- All passwords: `password123`
- `PlatformStat` seeded: 10 alumni, 10 universities, 47 sessions completed

### Google Meet links
- Placeholder text: "Link will appear 10 minutes before session"
- Admins can fill in the `meetLink` field on a `Booking` via the admin panel
- For production: auto-generate Meet links via Google Calendar API

### Add to Calendar
- Uses Google Calendar template URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...`
- No OAuth required — works as a link

### QS Rankings
- Static `prisma/qs_rankings.json` file, imported at seed time and at profile approval
- Updated manually once per year by running an import script against the published QS list
- Not live data — QS doesn't offer a usable free API

### File storage
- Demo: local `/public/uploads/` directory for profile photos
- For production: S3-compatible bucket (AWS S3, Cloudflare R2, etc.)
- Profile photos for seeded alumni: use `https://picsum.photos/seed/{name}/400/400`

### Skipped for demo (documented for production)
- Real email system (SendGrid/Postmark + BullMQ)
- SEO / sitemap / meta tags
- Concurrency-safe booking locking (`SELECT ... FOR UPDATE`)
- Minor-safety data layer (student DOB/phone exposure prevention)
- Refresh token rotation
- CSRF tokens
- Row-level concurrency locking for group sessions

### Running the demo

```bash
git clone <repo>
cd alumnow
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

That's it — zero external services. The app runs on `http://localhost:3000`.

### Production migration checklist
- [ ] Change `datasource db { provider = "sqlite" }` to `provider = "postgresql"` in `prisma/schema.prisma`
- [ ] Set `DATABASE_URL` to Neon/Supabase connection string
- [ ] Install `@prisma/adapter-pg` and update `lib/prisma.ts` to use `PrismaPg`
- [ ] Replace `lib/email.ts` with real email provider (SendGrid/Postmark)
- [ ] Replace `lib/rate-limit.ts` with Redis-backed rate limiter (Upstash)
- [ ] Add actual UPI payment gateway integration
- [ ] Deploy on Vercel with `@vercel/postgres` or Neon integration

---

## Pre-Launch Checklist (demo)

- [x] Static UPI QR image + editable UPI ID in admin panel
- [x] Final logo asset (static SVG in `/public/`)
- [x] 10 fake alumni profiles seeded via `prisma/seed.ts` with realistic Indian names
- [x] Auto-verify animation on signup (2.7s feel-real sequence)
- [x] Formatted email logging (boxed console output with timestamps)
- [ ] About Us / Founders copy, written by the team
- [ ] Terms of Use + Privacy Policy document (must exist before production — hard legal gate)
- [ ] Student minor-safety review (data exposure, consent)
# Phase 2 Delivery Checklist — AlumNow

> Updated during implementation. This checklist is the acceptance record for the Phase 2 section below.

- [x] Full landing page: public navigation, split hero, inline illustration, How It Works, live stats, testimonials, CTA, and footer
- [x] Public stats API with database-backed values and five-minute caching headers
- [x] Stats loading skeleton, animated count-up, zero-state, fallback/error state, and reduced-motion behavior
- [x] Config-driven testimonials with mobile horizontal scrolling and desktop presentation
- [x] Forgot-password request flow with rate limiting, reset token storage, formatted email logging, and safe response messaging
- [x] Reset-password flow with token expiry, password validation, confirmation matching, and token invalidation
- [x] Signup auto-verification sequence: account creation, email verification, success check, and redirect
- [x] Google OAuth provider and intended-route login redirects
- [x] Alumni self-apply form with validation, transaction creation, auto-approval, pricing, availability, photo seed, and welcome email log
- [x] Alumni application animation sequence and protected alumni dashboard
- [x] Markdown-rendered About and Founder content
- [x] Privacy and Terms pages
- [x] Mobile navigation, responsive layouts, accessibility labels, keyboard paths, empty/error/loading states, and reduced-motion CSS
- [x] Phase 2 dependency installation, Prisma migration, seed verification, production build, and HTTP smoke tests
