# AlumNow — Phase 1: Foundation

**Goal:** Project scaffold, database schema, authentication, shared UI primitives, seed data, and utility infrastructure. Everything needed for all subsequent phases.

**Complexity:** Medium
**Estimated files:** ~35 across 10 directories
**Dependencies:** None (this is the starting phase)
**Time estimate:** 4-6 hours for an experienced developer

---

## 0. Prerequisites & Initial Setup

### 0.1 Create the Next.js project

```bash
npx create-next-app@latest alumnow \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd alumnow
```

### 0.2 Install dependencies

```bash
# Core
npm install next-auth@beta @prisma/client @prisma/adapter-better-sqlite3
npm install @auth/prisma-adapter bcrypt-ts zod

# UI
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-avatar
npm install @radix-ui/react-label @radix-ui/react-separator
npm install @radix-ui/react-slot @radix-ui/react-checkbox
npm install lucide-react tailwind-merge clsx class-variance-authority

# Dev
npm install -D prisma @types/better-sqlite3
npm install -D tailwindcss-animate
```

### 0.3 Initialize Prisma

```bash
npx prisma init --datasource-provider sqlite
```

### 0.4 Configure TypeScript strict mode

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 1. Database Schema (`prisma/schema.prisma`)

### 1.1 Full schema

The complete Prisma schema with SQLite-compatible types. All money stored as integer paise (₹1 = 100 paise). All timestamps in UTC. JSON arrays stored as strings (SQLite limitation).

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}

// ── Auth models (NextAuth.js v5 required) ──

model User {
  id              String    @id @default(cuid())
  role            String    @default("student") // "student" | "alumnus" | "admin"
  email           String    @unique
  passwordHash    String?
  phone           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  emailVerifiedAt DateTime?
  googleOauthId   String?   @unique

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

// ── Domain models ──

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
  languages             String   @default("[]") // JSON array as string (SQLite)
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
  id                String  @id @default(cuid())
  alumniId          String
  type              String  // "call_30" | "call_45" | "call_60" | "group_40"
  pricePaise        Int     // stored as integer paise
  maxParticipants   Int     @default(1) // 4-6 for group sessions
  descriptionOneLiner String?

  alumni       AlumniProfile @relation(fields: [alumniId], references: [id], onDelete: Cascade)
  bookings     Booking[]
  groupSessions GroupSession[]
}

model Booking {
  id                    String   @id @default(cuid())
  studentId             String
  alumniId              String
  sessionTypeOfferingId String
  status                String   @default("pending_payment")
  // "pending_payment" | "payment_submitted" | "confirmed" | "completed" | "cancelled" | "no_show"
  scheduledStartAt      DateTime
  scheduledEndAt        DateTime
  meetLink              String?
  groupSessionId        String?
  reminder24hSentAt     DateTime?
  reminder1hSentAt      DateTime?
  reviewPromptSentAt    DateTime?
  createdAt             DateTime @default(now())

  student User  @relation("StudentBookings", fields: [studentId], references: [id])
  alumni  User  @relation("AlumniBookings", fields: [alumniId], references: [id])
  sessionType SessionTypeOffering @relation(fields: [sessionTypeOfferingId], references: [id])
  payment Payment?
  groupSession GroupSession? @relation(fields: [groupSessionId], references: [id])
}

model GroupSession {
  id                String   @id @default(cuid())
  alumniId          String
  sessionTypeOfferingId String
  scheduledStartAt  DateTime
  maxParticipants   Int      @default(6)
  currentParticipants Int    @default(0)
  status            String   @default("open") // "open" | "full" | "completed" | "cancelled"

  alumni     AlumniProfile     @relation(fields: [alumniId], references: [id])
  sessionType SessionTypeOffering @relation(fields: [sessionTypeOfferingId], references: [id])
  bookings   Booking[]
}

model Payment {
  id                 String   @id @default(cuid())
  bookingId          String   @unique
  amountPaise        Int
  upiTransactionRef  String?
  status             String   @default("awaiting_ref")
  // "awaiting_ref" | "submitted" | "verified" | "rejected"
  verifiedByAdminId  String?
  verifiedAt         DateTime?

  booking Booking @relation(fields: [bookingId], references: [id])
  verifiedBy User? @relation("VerifiedBy", fields: [verifiedByAdminId], references: [id])
}

model Review {
  id               String   @id @default(cuid())
  bookingId        String   @unique
  reviewerType     String   // "student" | "alumnus"
  rating           Int      // 1-5
  text             String?
  moderationStatus String   @default("pending") // "pending" | "approved" | "rejected"
  createdAt        DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id])
}

model SavedAlumni {
  studentId String
  alumniId  String
  createdAt DateTime @default(now())

  student User @relation(fields: [studentId], references: [id], onDelete: Cascade)
  alumni  AlumniProfile @relation(fields: [alumniId], references: [id], onDelete: Cascade)

  @@id([studentId, alumniId])
}

model PlatformStat {
  key        String   @id // "alumni_count" | "universities_count" | "sessions_completed"
  value      Int
  updatedAt  DateTime @updatedAt
  updatedByAdminId String?
}

model PlatformSetting {
  key        String @id // "upi_id" | "upi_qr_image_url"
  value      String
  updatedAt  DateTime @updatedAt
}

model AdminUser {
  userId      String @id
  permissions String @default("all") // future: granular permissions

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model NotificationLog {
  id        String   @id @default(cuid())
  userId    String
  eventType String   // "signup_verification" | "booking_confirmed" | "payment_verified"
  sentAt    DateTime @default(now())
  status    String   @default("logged") // "logged" (console) | "sent" (production)

  user User @relation(fields: [userId], references: [id])
}
```

### 1.2 Schema design decisions

- **`role` as string, not enum**: SQLite doesn't support enums. Using string with documented allowed values. Validation at the application layer (Zod).
- **`languages` as JSON string**: SQLite doesn't have a native array type. Store as `["English","Hindi"]`, parse with `JSON.parse()` when reading.
- **Money as integer paise**: ₹299 = `29900` paise. Never use floats for money.
- **`emailVerifiedAt` nullable**: `null` = not verified, `DateTime` = verified timestamp. Demo auto-verifies on signup.
- **Cascade deletes**: Deleting a `User` cascades to all related records. Admin accounts are never deleted (deactivated instead).
- **`NotificationLog`**: Audit trail for all sent notifications. In demo, every `console.log` writes a row here.

---

## 2. Library Modules (`src/lib/`)

Every shared utility module with its full interface specification.

### 2.1 `src/lib/prisma.ts` — Prisma client singleton

```typescript
import Database from "better-sqlite3"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
  const nativeDb = new Database(connectionString.replace("file:", ""))
  const adapter = new PrismaBetterSqlite3(nativeDb)

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

**Key points:**
- Singleton pattern prevents multiple instances during hot reload
- `DATABASE_URL` env var or default to `file:./prisma/dev.db`
- Uses `@prisma/adapter-better-sqlite3` for synchronous SQLite access
- The `generated/prisma/client` path matches the `output` in `schema.prisma`

### 2.2 `src/lib/auth.ts` — NextAuth v5 configuration

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcrypt-ts"
import { prisma } from "./prisma"
import { rateLimit } from "./rate-limit"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Rate limit check
        const ip = req?.headers?.get("x-forwarded-for") ?? "unknown"
        const allowed = rateLimit(`login:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 })
        if (!allowed) throw new Error("Too many login attempts. Try again in 15 minutes.")

        // Validate input
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)
        if (!parsed.success) throw new Error("Invalid email or password format.")

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.passwordHash) throw new Error("Invalid email or password.")

        // Verify password
        const valid = await compare(parsed.data.password, user.passwordHash)
        if (!valid) throw new Error("Invalid email or password.")

        return {
          id: user.id,
          email: user.email,
          name: user.role,
          role: user.role,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? "student"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})
```

**Key points:**
- `PrismaAdapter` connects NextAuth to our User/Account/Session models
- JWT strategy (not database sessions — simpler for demo)
- Credentials provider with bcrypt password verification
- Google OAuth provider (configured via env vars)
- Rate limiting on login attempts (5 per 15 min per IP)
- Email/password validated with Zod before DB query
- Token callbacks propagate `role` and `id` to session

### 2.3 `src/lib/auth.config.ts` — NextAuth edge-compatible config

NextAuth v5 requires a separate config file for middleware:

```typescript
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnBookings = nextUrl.pathname.startsWith("/bookings")
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnProfile = nextUrl.pathname.startsWith("/profile")
      const isOnBrowse = nextUrl.pathname.startsWith("/browse")

      // Admin routes require admin role
      if (isOnAdmin && role !== "admin") {
        return Response.redirect(new URL("/login", nextUrl))
      }

      // Protected routes require auth
      if ((isOnBookings || isOnDashboard || isOnProfile) && !isLoggedIn) {
        return false
      }

      // Browse requires auth (core feature)
      if (isOnBrowse && !isLoggedIn) {
        return false
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
```

### 2.4 `src/middleware.ts` — Next.js middleware

```typescript
import NextAuth from "next-auth"
import { authConfig } from "./lib/auth.config"

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images/|uploads/).*)",
  ],
}
```

**Protected routes:**
- `/admin/*` → requires `role === "admin"` (redirects to `/login`)
- `/browse`, `/bookings`, `/dashboard`, `/profile/*` → requires authentication (redirects to `/login`)
- `/login`, `/register`, `/`, `/about`, `/privacy`, `/terms` → public

### 2.5 `src/lib/rate-limit.ts` — In-memory rate limiter

```typescript
interface RateLimitOptions {
  max: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
}, 60_000)

export function rateLimit(key: string, options: RateLimitOptions): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return true
  }

  if (entry.count >= options.max) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitRemaining(key: string): number {
  const entry = store.get(key)
  if (!entry || entry.resetAt <= Date.now()) return 0
  return entry.resetAt - Date.now()
}
```

**Rate limit rules:**
| Endpoint | Max | Window |
|----------|-----|--------|
| Login | 5 attempts | 15 minutes |
| Signup | 3 attempts | 15 minutes |
| Forgot password | 2 attempts | 15 minutes |
| API general | 100 requests | 1 minute |

### 2.6 `src/lib/validation.ts` — Zod validation schemas

Every API input validated through these schemas:

```typescript
import { z } from "zod"

// ── Auth ──

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+91[0-9]{10}$/, "Phone must be +91 followed by 10 digits"),
  dateOfBirth: z.string().optional(),
  currentGrade: z.enum(["AS", "A2", "Other"]),
  school: z.string().min(1).default("JBCN International School Borivali"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
  confirmPassword: z.string(),
  tosAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the Terms of Service" }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[0-9]/, "Must contain at least 1 number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// ── Profile ──

export const alumniProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  universityName: z.string().min(2).max(200),
  course: z.string().min(2).max(200),
  country: z.string().min(2).max(100),
  graduationYearJbcn: z.number().int().min(1990).max(2030),
  currentStudyLevel: z.enum(["undergraduate", "postgraduate"]),
  bio: z.string().max(750, "Bio must be under 150 words").optional(),
  languages: z.array(z.string()).max(10).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
})

export const studentProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  dateOfBirth: z.string().optional(),
  currentGrade: z.enum(["AS", "A2", "Other"]),
  school: z.string().min(1).max(200),
})

// ── Session & Booking ──

export const sessionTypeSchema = z.object({
  type: z.enum(["call_30", "call_45", "call_60", "group_40"]),
  pricePaise: z.number().int().min(0).max(100000),
  maxParticipants: z.number().int().min(1).max(10).default(1),
})

export const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  specificDate: z.string().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be HH:mm format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be HH:mm format"),
  isRecurring: z.boolean().default(true),
})

export const bookingDraftSchema = z.object({
  alumniId: z.string().cuid(),
  sessionTypeOfferingId: z.string().cuid(),
  scheduledStartAt: z.string().datetime(),
  scheduledEndAt: z.string().datetime(),
})

export const paymentRefSchema = z.object({
  upiTransactionRef: z.string().regex(/^[A-Za-z0-9]{8,}$/, "Reference must be 8+ alphanumeric characters"),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(200, "Review must be under 200 characters").optional(),
})
```

### 2.7 `src/lib/email.ts` — Formatted email logger

```typescript
import { prisma } from "./prisma"

interface EmailParams {
  to: string
  subject: string
  body: string
  eventType: string
}

interface FormattedEmailLog {
  to: string
  subject: string
  body: string
  eventType: string
  timestamp: string
  userId?: string
}

export async function sendEmail(params: EmailParams, userId?: string): Promise<void> {
  const timestamp = new Date().toISOString()

  // Log to console in formatted box
  const line = "─".repeat(Math.max(params.subject.length + 4, 50))
  console.log(`
┌${line}┐
│  EMAIL
│  To:       ${params.to}
│  Subject:  ${params.subject}
│  Body:     ${params.body.replace(/\n/g, "\n│           ")}
│  Timestamp: ${timestamp}
└${line}┘`)

  // Persist to database
  await prisma.notificationLog.create({
    data: {
      userId: userId ?? "",
      eventType: params.eventType,
      status: "logged",
    },
  })
}

// Convenience methods for each email type
export const emailTemplates = {
  signupVerification: (email: string, name: string) => ({
    to: email,
    subject: "Welcome to AlumNow! Verify your email",
    body: `Hi ${name},\n\nWelcome to AlumNow! Your account has been created successfully.\n\nIn production, you'd receive a verification link here. For this demo, you're auto-verified.\n\nStart browsing alumni at /browse`,
    eventType: "signup_verification" as const,
  }),

  bookingConfirmed: (email: string, alumnusName: string, date: string, time: string) => ({
    to: email,
    subject: `Session Confirmed — ${alumnusName}`,
    body: `Your session with ${alumnusName} on ${date} at ${time} IST is confirmed.\n\nJoin link will appear 10 minutes before the session.\n\nView your bookings at /bookings`,
    eventType: "booking_confirmed" as const,
  }),

  paymentVerified: (email: string, amount: string) => ({
    to: email,
    subject: "Payment Verified — AlumNow",
    body: `Your payment of ${amount} has been verified.\n\nYour session is confirmed. You can access it from your dashboard.\n\nThank you for using AlumNow!`,
    eventType: "payment_verified" as const,
  }),
}
```

### 2.8 `src/lib/utils.ts` — Shared utilities

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price from paise to ₹ string */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

/** Format date to readable Indian format */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/** Format time to 12-hour format */
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

/** Format date for Google Calendar template URL */
export function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split("."[0]) + "Z"
}

/** Abbreviate name for display (first name only) */
export function formatFirstName(fullName: string): string {
  return fullName.split(" ")[0] ?? fullName
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

/** Get absolute URL for redirects/links */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
}
```

### 2.9 `src/types/index.ts` — Shared TypeScript types

```typescript
import type { User as DbUser } from "../generated/prisma/client"

// ── Auth ──

export type UserRole = "student" | "alumnus" | "admin"

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  name?: string
  image?: string
}

// ── Alumni ──

export interface AlumniCardData {
  id: string
  fullName: string
  profilePhotoUrl: string | null
  universityName: string
  course: string
  country: string
  graduationYearJbcn: number
  qsRankingTier: string
  bio: string | null
  languages: string[]
  verificationStatus: string
  isVerifiedJbcnAlumnus: boolean
  ratingAvg: number | null
  ratingCount: number
  avgResponseTimeHours: number | null
  sessionTypes: SessionTypeData[]
  isSaved: boolean
}

export interface SessionTypeData {
  id: string
  type: "call_30" | "call_45" | "call_60" | "group_40"
  pricePaise: number
  maxParticipants: number
  descriptionOneLiner: string | null
}

export interface AvailabilitySlot {
  id: string
  dayOfWeek: number | null
  specificDate: string | null
  startTime: string
  endTime: string
  isRecurring: boolean
}

// ── Booking ──

export type BookingStatus = "pending_payment" | "payment_submitted" | "confirmed" | "completed" | "cancelled" | "no_show"

export interface BookingData {
  id: string
  alumnusName: string
  alumnusPhoto: string | null
  sessionType: string
  scheduledStartAt: string
  scheduledEndAt: string
  status: BookingStatus
  meetLink: string | null
  amountPaise: number
  canJoin: boolean
  canReview: boolean
}

// ── Payment ──

export type PaymentStatus = "awaiting_ref" | "submitted" | "verified" | "rejected"

// ── Review ──

export interface ReviewData {
  id: string
  rating: number
  text: string | null
  reviewerName: string
  createdAt: string
}

// ── Admin ──

export interface AdminStats {
  totalAlumni: number
  totalBookings: number
  totalRevenuePaise: number
  pendingReviews: number
}

// ── Filter ──

export interface AlumniFilters {
  university?: string
  country?: string
  course?: string
  studyLevel?: string
  gradYearMin?: number
  gradYearMax?: number
  qsTiers?: string[]
  availability?: "this_week" | "this_month" | "any"
  sessionType?: "1:1" | "group" | "both"
  search?: string
  page?: number
  pageSize?: number
}

// ── API Response ──

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

---

## 3. Shared UI Components (`src/components/ui/`)

All shadcn/ui primitives customised to AlumNow's design tokens. Run `npx shadcn@latest init` then customise each.

### 3.1 shadcn/ui init configuration

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### 3.2 `src/app/globals.css` — Global styles with design tokens

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand palette */
    --color-primary: #1B3A6B;
    --color-accent: #F5A623;
    --color-bg: #F8F9FB;
    --color-text: #2C3E50;

    /* Extended palette */
    --primary: 221 55% 27%;
    --primary-foreground: 210 40% 98%;
    --accent: 38 90% 55%;
    --accent-foreground: 221 55% 27%;
    --background: 220 20% 98%;
    --foreground: 210 15% 25%;
    --card: 0 0% 100%;
    --card-foreground: 210 15% 25%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 15% 25%;
    --secondary: 220 14% 90%;
    --secondary-foreground: 221 55% 27%;
    --muted: 220 14% 90%;
    --muted-foreground: 210 10% 50%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 10% 85%;
    --input: 214 10% 85%;
    --ring: 221 55% 27%;
    --radius: 0.625rem;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(27, 58, 107, 0.08);
    --shadow-md: 0 4px 12px rgba(27, 58, 107, 0.1);
    --shadow-lg: 0 8px 24px rgba(27, 58, 107, 0.12);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
}
```

### 3.3 `tailwind.config.ts` — Tailwind configuration

```typescript
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B3A6B",
          light: "#2B5A9B",
          dark: "#0F2240",
          50: "#EBF0F7",
          100: "#D6E0EF",
          200: "#ADC1DF",
          300: "#85A2CF",
          400: "#5C83BF",
          500: "#1B3A6B",
          600: "#162E56",
          700: "#102341",
          800: "#0B172B",
          900: "#050C16",
        },
        accent: {
          DEFAULT: "#F5A623",
          light: "#FFC55C",
          dark: "#D4880F",
          50: "#FEF5E6",
          100: "#FDEBCC",
          200: "#FBD799",
          300: "#F9C366",
          400: "#F7AF33",
          500: "#F5A623",
          600: "#D4880F",
          700: "#A66A0C",
          800: "#784C08",
          900: "#4A2E05",
        },
        background: "#F8F9FB",
        foreground: "#2C3E50",
        border: "#E2E5EA",
        input: "#E2E5EA",
        ring: "#1B3A6B",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(27, 58, 107, 0.08)",
        md: "0 4px 12px rgba(27, 58, 107, 0.1)",
        lg: "0 8px 24px rgba(27, 58, 107, 0.12)",
        xl: "0 16px 48px rgba(27, 58, 107, 0.15)",
      },
      keyframes: {
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "check-draw": {
          "0%": { strokeDashoffset: "50" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "shimmer": "shimmer 1.5s infinite",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        "check-draw": "check-draw 0.4s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [animate],
}

export default config
```

### 3.4 Customised shadcn/ui components

Install each with `npx shadcn@latest add button card input select badge dialog avatar toast skeleton separator label checkbox`. Then customise to match AlumNow's tokens.

**Key customisations:**
- **Button**: `--radius-md` (10px), amber primary variant, indigo secondary
- **Card**: white bg, 1px `--color-border` border, `--radius-md`, `--shadow-sm`
- **Input**: `--radius-sm` (6px), focus ring in `--color-primary`
- **Badge**: `--radius-full` (pill), amber for "verified", green for "approved", grey for "pending"
- **Avatar**: `--radius-full` round, initials fallback using first 2 chars of name
- **Dialog**: centered, `max-w-md`, overlay at 50% black, `--radius-lg` content
- **Toast**: top-right, 4s auto-dismiss, amber accent for info, green for success, red for error
- **Skeleton**: fixed aspect-ratio shimmer using `animate-shimmer`
- **Select**: styled trigger with chevron, scrollable content, searchable

---

## 4. Layout Components (`src/components/`)

### 4.1 `src/components/Navbar.tsx`

```
Renders: Logo (link to /) | Nav links (Browse, Dashboard, About)
         | User menu (name + dropdown: Profile, Bookings, Settings, Logout)
         | or Login/Signup buttons when unauthenticated

States:
- Loading: skeleton logo + 2 skeleton nav links + skeleton button
- Authenticated (student): Browse, Dashboard, user menu
- Authenticated (alumnus): Browse, Profile, user menu
- Authenticated (admin): Browse, Admin link, user menu
- Unauthenticated: Login + Sign Up buttons
- Mobile: hamburger menu with slide-over drawer

Design:
- Sticky top, bg-white/90 backdrop-blur-sm, bottom border
- 64px height, max-w-[1400px] mx-auto px-4
- Uses lucide-react icons (Menu, User, LogOut, etc.)
- No emojis anywhere
```

### 4.2 `src/components/Footer.tsx`

```
Renders: 4-column link grid | Social icons | Copyright line

Columns:
1. Product — Browse, About, Privacy, Terms
2. Support — Contact, FAQ (placeholder)
3. Connect — Social icons (X, Instagram, LinkedIn, YouTube)
4. Legal — Privacy Policy, Terms of Use, Cookie Policy

Design:
- bg-primary (#1B3A6B), white text
- max-w-[1400px] mx-auto px-4 py-12
- Links in text-muted (--color-text-muted), hover to white
- Copyright line: "© 2026 AlumNow. All rights reserved."
```

### 4.3 `src/components/AuthGuard.tsx`

```
Client component. Wraps protected content.
- Uses useSession() from next-auth
- If loading: show centered spinner (60x60px)
- If unauthenticated: redirect to /login with callbackUrl
- If authenticated: render children
```

### 4.4 `src/components/AdminGuard.tsx`

```
Client component. Wraps admin-only content.
- Uses useSession() from next-auth
- If loading: show centered spinner
- If unauthenticated: redirect to /login
- If role !== "admin": show 403 message "Access denied" + "Go home" link
- If role === "admin": render children
```

---

## 5. App Layout & Pages

### 5.1 `src/app/layout.tsx` — Root layout

```typescript
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "./SessionProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlumNow — Talk to JBCN Alumni",
  description: "Book video-call sessions with verified JBCN alumni for personalised guidance.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex min-h-[100dvh] flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
```

### 5.2 `src/app/SessionProvider.tsx` — Client session wrapper

```typescript
"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
```

### 5.3 `src/app/page.tsx` — Landing page (placeholder for Phase 2)

```typescript
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center text-primary max-w-3xl">
        Talk to JBCN Alumni Who&apos;ve Been Where You Want to Go
      </h1>
      <p className="mt-6 text-lg text-muted-foreground text-center max-w-2xl">
        Book one-on-one video calls with verified alumni from top universities worldwide.
        Get personalised guidance on applications, careers, and life beyond school.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-semibold text-primary hover:bg-accent/90 transition-colors"
        >
          Find Your Mentor
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md border border-border bg-white px-8 py-3 text-base font-semibold text-primary hover:bg-muted transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
```

### 5.4 `src/app/login/page.tsx` — Login page

```
Renders: Centered card with:
- Logo + "Welcome back" heading
- Email input + Password input
- "Sign In" button (amber, full-width)
- "Forgot password?" link below
- Divider: "or continue with"
- Google OAuth button
- "Don't have an account? Sign up" link

States:
- Default: empty form
- Validation error: inline red text below fields
- Submitting: button shows spinner + "Signing in..."
- Success: redirects to /browse (students) or / (alumni/admin)
- Error: toast with error message
- Rate limited: "Too many attempts. Try again in X minutes."
```

### 5.5 `src/app/register/page.tsx` — Signup page

```
Renders: Centered card with:
- Logo + "Create your account" heading
- Fields: Full Name, Email, Phone (+91 XXXXX XXXXX), Date of Birth, Grade (AS/A2/Other),
  School (prefilled JBCN), Password, Confirm Password
- Terms checkbox: "I accept the Terms of Service and Privacy Policy"
- "Create Account" button (amber, full-width, disabled until ToS checked)
- "Already have an account? Sign in" link

States:
- Default: empty form, ToS unchecked disables submit
- Validation error: inline red text
- Submitting: "Creating your account..." spinner (800ms)
- Auto-verify sequence (2.7s — see detail below)
- Success: redirects to /browse
- Error: toast, form stays populated
- Duplicate email: "An account with this email already exists"

Auto-verify animation sequence:
1. t=0ms: "Creating your account..." spinner
2. t=800ms: Text changes to "Verifying your email..." + pulsing amber dot
3. t=2000ms: Green checkmark appears (scale 0→1, 300ms)
4. t=2300ms: "Email verified!" appears below check
5. t=2700ms: Redirects to /browse
```

### 5.6 `src/app/admin/layout.tsx` — Admin layout

```
Renders: Admin sidebar + content area

Sidebar links:
- Dashboard (/admin)
- Alumni (/admin/alumni)
- Bookings (/admin/bookings)
- Users (/admin/users)
- Reviews (/admin/reviews)
- Settings (/admin/settings)

Design:
- Sidebar: 280px, bg-primary (#1B3A6B), white text
- Active link: bg-primary-light with left amber border
- Content: flex-1, p-8
- Mobile: sidebar collapses to hamburger, full-width overlay

States:
- Loading: skeleton sidebar + skeleton content area
- Role check failure: redirect to /login via AdminGuard
```

### 5.7 `src/app/admin/page.tsx` — Admin dashboard (placeholder)

```
Renders: 4 stat cards in a grid:
- Total Alumni (with user icon)
- Total Bookings (with calendar icon)
- Total Revenue (with rupee icon)
- Pending Reviews (with star icon)

Each card: icon, value (large mono number), label, subtle background tint

States:
- Loading: 4 skeleton cards
- Empty: all zeros (real data from DB)
- Error: "Could not load stats" + retry
```

---

## 6. Auth Actions (`src/actions/auth.actions.ts`)

Server actions for authentication:

```typescript
"use server"

import { hash } from "bcrypt-ts"
import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/lib/auth"
import { signupSchema, loginSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"
import { sendEmail, emailTemplates } from "@/lib/email"
import type { ApiResponse } from "@/types"

export async function signup(formData: FormData): Promise<ApiResponse<{ redirectTo: string }>> {
  try {
    // Rate limit
    // ...check rate limit

    // Parse & validate
    const data = signupSchema.parse(Object.fromEntries(formData))

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return { success: false, error: "An account with this email already exists" }
    }

    // Hash password using bcrypt-ts
    const passwordHash = await hash(data.password, 12)

    // Create user + student profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          phone: data.phone,
          role: "student",
          emailVerifiedAt: new Date(), // Auto-verified in demo
        },
      })

      await tx.studentProfile.create({
        data: {
          userId: newUser.id,
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          currentGrade: data.currentGrade,
          school: data.school,
        },
      })

      return newUser
    })

    // Log the "verification email" (demo: just console.log)
    await sendEmail(
      emailTemplates.signupVerification(data.email, data.fullName),
      user.id
    )

    // Auto-login the user
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true, data: { redirectTo: "/browse" } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors }
    }
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function login(formData: FormData): Promise<ApiResponse<{ redirectTo: string }>> {
  // ... similar validation + signIn call
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" })
}
```

---

## 7. Seed Data (`prisma/seed.ts`)

### 7.1 Seed script structure

```typescript
import { PrismaClient } from "../generated/prisma/client"
import { hash } from "bcrypt-ts"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding AlumNow database...")

  // Clear existing data (development only)
  await prisma.notificationLog.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.groupSession.deleteMany()
  await prisma.sessionTypeOffering.deleteMany()
  await prisma.alumniAvailability.deleteMany()
  await prisma.savedAlumni.deleteMany()
  await prisma.alumniProfile.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.platformStat.deleteMany()
  await prisma.platformSetting.deleteMany()

  const passwordHash = await hash("password123", 12)

  // 1. Create admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@alumnow.com",
      passwordHash,
      role: "admin",
      emailVerifiedAt: new Date(),
    },
  })
  await prisma.adminUser.create({ data: { userId: admin.id } })

  // 2. Create student
  const student = await prisma.user.create({
    data: {
      email: "student1@alumnow.com",
      passwordHash,
      role: "student",
      phone: "+919876543210",
      emailVerifiedAt: new Date(),
    },
  })
  await prisma.studentProfile.create({
    data: {
      userId: student.id,
      fullName: "Aarav Patel",
      currentGrade: "A2",
    },
  })

  // 3. Create 10 alumni
  const alumniData = [
    {
      email: "alumni1@alumnow.com",
      fullName: "Priya Sharma",
      universityName: "IIT Bombay",
      course: "B.Tech Computer Science",
      country: "India",
      graduationYearJbcn: 2022,
      qsRankingTier: "top50",
      bio: "I'm a software engineer at Google India, passionate about helping students navigate the IIT system. I've mentored over 20 students through JEE prep and college applications. Let me help you chart your path to a top engineering college.",
      languages: ["English", "Hindi", "Marathi"],
    },
    {
      email: "alumni2@alumnow.com",
      fullName: "Arjun Mehta",
      universityName: "Delhi University",
      course: "B.A. Economics",
      country: "India",
      graduationYearJbcn: 2021,
      qsRankingTier: "top200",
      bio: "Currently pursuing my MBA at ISB. I specialise in helping students explore non-engineering career paths — economics, finance, and liberal arts. I believe the right guidance at the right time can change everything.",
      languages: ["English", "Hindi"],
    },
    {
      email: "alumni3@alumnow.com",
      fullName: "Ishita Reddy",
      universityName: "BITS Pilani",
      course: "B.E. Mechanical Engineering",
      country: "India",
      graduationYearJbcn: 2023,
      qsRankingTier: "top100",
      bio: "Aerospace engineer at ISRO. My journey from JBCN to BITS to ISRO has been incredible. I want to help students who dream of engineering careers — whether it's college selection, exam prep, or understanding what engineers actually do.",
      languages: ["English", "Hindi", "Telugu"],
    },
    {
      email: "alumni4@alumnow.com",
      fullName: "Vikram Singh",
      universityName: "University of Cambridge",
      course: "M.A. Law",
      country: "United Kingdom",
      graduationYearJbcn: 2020,
      qsRankingTier: "top10",
      bio: "Barrister at Lincoln's Inn, London. I read Law at Cambridge and can guide students through UK university applications — personal statements, interview prep, and choosing the right college. I also advise on careers in law and public policy.",
      languages: ["English", "Hindi", "French"],
    },
    {
      email: "alumni5@alumnow.com",
      fullName: "Ananya Gupta",
      universityName: "NYU Stern",
      course: "B.Sc. Business",
      country: "United States",
      graduationYearJbcn: 2022,
      qsRankingTier: "top50",
      bio: "Investment banking analyst in New York. I can help with US university applications, SAT/ACT strategy, and understanding the US admissions system. I also mentor students interested in finance and consulting careers.",
      languages: ["English", "Hindi", "Spanish"],
    },
    {
      email: "alumni6@alumnow.com",
      fullName: "Rohit Joshi",
      universityName: "IIT Delhi",
      course: "B.Tech Electrical Engineering",
      country: "India",
      graduationYearJbcn: 2021,
      qsRankingTier: "top50",
      bio: "Product manager at Microsoft India. My IIT journey taught me that hard work beats talent when talent doesn't work hard. I mentor students on JEE prep, engineering college selection, and tech career paths.",
      languages: ["English", "Hindi", "Punjabi"],
    },
    {
      email: "alumni7@alumnow.com",
      fullName: "Sneha Kapoor",
      universityName: "University of Melbourne",
      course: "B.A. Psychology",
      country: "Australia",
      graduationYearJbcn: 2023,
      qsRankingTier: "top50",
      bio: "Clinical psychology graduate student. I help students explore psychology and social sciences as career paths — something rarely discussed in Indian schools. I also guide on Australian university applications and student life.",
      languages: ["English", "Hindi"],
    },
    {
      email: "alumni8@alumnow.com",
      fullName: "Karan Verma",
      universityName: "NUS Singapore",
      course: "B.E. Civil Engineering",
      country: "Singapore",
      graduationYearJbcn: 2022,
      qsRankingTier: "top50",
      bio: "Infrastructure consultant in Singapore. My NUS experience opened my eyes to global engineering standards. I guide students on engineering abroad, scholarship applications, and building a global career from an Indian school base.",
      languages: ["English", "Hindi", "Bengali"],
    },
    {
      email: "alumni9@alumnow.com",
      fullName: "Divya Nair",
      universityName: "UCL London",
      course: "M.Sc. Architecture",
      country: "United Kingdom",
      graduationYearJbcn: 2021,
      qsRankingTier: "top20",
      bio: "Architect at Zaha Hadid Architects. I believe design education in India needs more exposure. I mentor students interested in architecture, design, and creative careers — portfolio building, university selection, and the creative industry.",
      languages: ["English", "Hindi", "Malayalam"],
    },
    {
      email: "alumni10@alumnow.com",
      fullName: "Ravi Deshmukh",
      universityName: "University of Toronto",
      course: "B.Sc. Computer Science",
      country: "Canada",
      graduationYearJbcn: 2023,
      qsRankingTier: "top50",
      bio: "AI researcher focused on NLP. My path from JBCN to UofT involved a lot of self-discovery. I help students navigate computer science admissions, build strong portfolios, and decide between Indian vs international education.",
      languages: ["English", "Hindi", "Marathi"],
    },
  ]

  for (const data of alumniData) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: "alumnus",
        emailVerifiedAt: new Date(),
      },
    })

    await prisma.alumniProfile.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        universityName: data.universityName,
        course: data.course,
        country: data.country,
        graduationYearJbcn: data.graduationYearJbcn,
        qsRankingTier: data.qsRankingTier,
        bio: data.bio,
        languages: JSON.stringify(data.languages),
        verificationStatus: "approved",
        isVerifiedJbcnAlumnus: true,
        avgResponseTimeHours: Math.floor(Math.random() * 24) + 2,
        ratingAvg: +(3.5 + Math.random() * 1.5).toFixed(1),
        ratingCount: Math.floor(Math.random() * 20) + 3,
      },
    })

    // Add availability slots (3-5 recurring weekly slots)
    const days = [1, 2, 3, 4, 5] // Mon-Fri
    const slotCount = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < slotCount; i++) {
      const day = days[i % days.length]
      const startHour = 9 + Math.floor(Math.random() * 8)
      await prisma.alumniAvailability.create({
        data: {
          alumniId: user.id,
          dayOfWeek: day,
          startTime: `${String(startHour).padStart(2, "0")}:00`,
          endTime: `${String(startHour + 1).padStart(2, "0")}:00`,
          isRecurring: true,
        },
      })
    }

    // Add session type offerings
    const sessions = [
      { type: "call_30", pricePaise: 29900, maxParticipants: 1 },
      { type: "call_60", pricePaise: 49900, maxParticipants: 1 },
      { type: "group_40", pricePaise: 99900, maxParticipants: 6 },
    ]
    for (const session of sessions) {
      await prisma.sessionTypeOffering.create({
        data: {
          alumniId: user.id,
          type: session.type,
          pricePaise: session.pricePaise,
          maxParticipants: session.maxParticipants,
          descriptionOneLiner: getSessionDescription(session.type),
        },
      })
    }
  }

  // 4. Platform stats
  await prisma.platformStat.createMany({
    data: [
      { key: "alumni_count", value: 10 },
      { key: "universities_count", value: 10 },
      { key: "sessions_completed", value: 47 },
    ],
  })

  // 5. Platform settings
  await prisma.platformSetting.createMany({
    data: [
      { key: "upi_id", value: "alumnow@upi" },
      { key: "upi_qr_image_url", value: "/images/upi-qr-demo.png" },
    ],
  })

  console.log("✓ Seeded admin, 1 student, 10 alumni with profiles, availability, and pricing")
  console.log("  Passwords: password123")
  console.log("  Admin: admin@alumnow.com")
  console.log("  Student: student1@alumnow.com")
  console.log("  Alumni: alumni1-10@alumnow.com")
}

function getSessionDescription(type: string): string {
  switch (type) {
    case "call_30": return "Quick chat — perfect for specific questions"
    case "call_45": return "Standard session — explore topics in depth"
    case "call_60": return "Deep dive — comprehensive guidance"
    case "group_40": return "Group session — learn with peers (max 6 students)"
    default: return ""
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 7.2 Seed execution

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Install tsx: `npm install -D tsx`

Run: `npx prisma db seed`

---

## 8. Environment Configuration

### `.env` (local development)

```env
# Database (SQLite — defaults to file:./prisma/dev.db)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
AUTH_SECRET="change-me-to-a-random-string-at-least-32-chars"
AUTH_URL="http://localhost:3000"

# Google OAuth (create at https://console.cloud.google.com/apis/credentials)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="AlumNow"
```

### `.env.example` (committed to repo)

Same as above but with empty values and comments explaining where to get each.

---

## 9. Verification Checklist

After Phase 1 is complete, verify everything works:

### Database
- [ ] `npx prisma migrate dev --name init` runs without errors
- [ ] `npx prisma db seed` populates all data
- [ ] SQLite file `prisma/dev.db` exists and is non-empty
- [ ] All 13 models created with correct relations
- [ ] Cascade deletes work (test by deleting a user)

### Auth
- [ ] Can register a new student account
- [ ] Auto-verify animation plays (2.7s sequence)
- [ ] Redirected to `/browse` after signup
- [ ] Can login with seeded admin account (`admin@alumnow.com` / `password123`)
- [ ] Can login with seeded student account
- [ ] Can login with seeded alumni account
- [ ] Invalid credentials show error toast
- [ ] Rate limiting triggers after 5 failed login attempts
- [ ] Logout works and redirects to `/`
- [ ] Google OAuth button renders (will error without client ID — expected)

### Routes
- [ ] `/` — landing page renders with hero + CTA
- [ ] `/login` — login form renders
- [ ] `/register` — registration form renders
- [ ] `/browse` — redirects to `/login` when unauthenticated
- [ ] `/admin` — redirects to `/login` when unauthenticated
- [ ] `/admin` — shows "Access denied" for non-admin users
- [ ] `/admin` — renders dashboard for admin user

### UI Components
- [ ] Navbar shows logo + public links when logged out
- [ ] Navbar shows user menu + protected links when logged in
- [ ] Navbar shows "Admin" link for admin users
- [ ] Footer renders with 4 columns
- [ ] All shadcn/ui components render with correct AlumNow styling
- [ ] Toast notifications appear and auto-dismiss
- [ ] Skeleton loaders have fixed dimensions (no layout shift)
- [ ] Mobile: hamburger menu replaces nav links
- [ ] Mobile: no horizontal scroll at 375px width

### Utilities
- [ ] `lib/email.ts` logs formatted box to console
- [ ] `lib/rate-limit.ts` blocks after threshold
- [ ] `lib/validation.ts` rejects invalid inputs with field-level errors
- [ ] `formatPrice(29900)` returns "₹299"
- [ ] `formatPrice(49900)` returns "₹499"
- [ ] `formatFirstName("Priya Sharma")` returns "Priya"

### Seed Data
- [ ] 10 alumni with realistic Indian names exist
- [ ] Each alumni has 3-5 availability slots
- [ ] Each alumni has 3 session type offerings
- [ ] `PlatformStat` values are seeded
- [ ] `PlatformSetting` values are seeded
- [ ] All passwords `password123` work for every seeded account

---

## 10. What's NOT in Phase 1 (deferred to later phases)

| Feature | Phase | Reason |
|---------|-------|--------|
| Full landing page (sections, stats, testimonials) | Phase 2 | Needs Phase 1 auth and layout first |
| Forgot/reset password pages | Phase 2 | Needs email logger from Phase 1 |
| Google OAuth complete flow | Phase 2 | Needs Phase 1 auth config |
| Alumni self-apply flow | Phase 2 | Needs Phase 1 schema (AlumniProfile, SessionTypeOffering, AlumniAvailability) |
| Browse page with filters + grid | Phase 3 | Core feature, needs auth |
| Alumni profile page | Phase 4 | Needs browse to link to it |
| Booking flow + payment | Phase 5 | Needs profiles |
| Student dashboard | Phase 5 | Needs bookings |
| Admin CRUD pages | Phase 6 | Needs data from earlier phases |
| Alumni account management | Phase 7 | Nice-to-have, last |

---

## 11. File Manifest (Complete Phase 1 File List)

```
prisma/
├── schema.prisma                                    # Full data model (13 models)
└── seed.ts                                          # 10 alumni + admin + student + stats

public/
└── images/
    └── upi-qr-demo.png                              # Placeholder QR for Phase 5 (empty file for now)

src/
├── app/
│   ├── globals.css                                  # Tailwind + design tokens
│   ├── layout.tsx                                   # Root layout (Navbar + Footer + Toaster + Session)
│   ├── page.tsx                                     # Landing page (hero placeholder)
│   ├── SessionProvider.tsx                          # NextAuth SessionProvider wrapper
│   ├── login/
│   │   └── page.tsx                                 # Login form
│   ├── register/
│   │   └── page.tsx                                 # Signup form with auto-verify animation
│   └── admin/
│       ├── layout.tsx                               # Admin sidebar layout
│       └── page.tsx                                 # Admin dashboard placeholder (4 stat cards)
├── actions/
│   └── auth.actions.ts                              # signup, login, logout server actions
├── components/
│   ├── ui/                                          # shadcn/ui primitives (button, card, input, select,
│   │   │                                           #   badge, dialog, avatar, toast, skeleton, separator,
│   │   │                                           #   label, checkbox)
│   ├── Navbar.tsx                                   # Responsive nav with user menu
│   ├── Footer.tsx                                   # 4-column footer
│   ├── AuthGuard.tsx                                # Auth wrapper (redirects if not logged in)
│   └── AdminGuard.tsx                               # Admin wrapper (redirects if not admin)
├── lib/
│   ├── prisma.ts                                    # Prisma client singleton (better-sqlite3 adapter)
│   ├── auth.ts                                      # NextAuth v5 config (credentials + Google)
│   ├── auth.config.ts                               # Edge-compatible auth config for middleware
│   ├── rate-limit.ts                                # In-memory rate limiter
│   ├── validation.ts                                # Zod schemas for all API inputs
│   ├── email.ts                                     # Formatted email logger
│   └── utils.ts                                     # cn(), formatPrice(), formatDate(), formatTime(), etc.
├── types/
│   └── index.ts                                     # Shared TypeScript types
└── middleware.ts                                     # Route protection (admin, auth required paths)

.env                                                   # Local environment variables
.env.example                                           # Committed template
tailwind.config.ts                                     # Customised Tailwind config
components.json                                        # shadcn/ui config
tsconfig.json                                          # TypeScript config (strict mode)
package.json                                           # With prisma.seed script
```

**Total files: ~35**

---

## 12. Running Phase 1

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with AUTH_SECRET (generate with: openssl rand -base64 32)

# 3. Run database migration
npx prisma migrate dev --name init

# 4. Seed data
npx prisma db seed

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

**That's it — zero external services required.**
