# Phase 7 — Alumni Account (Profile Edit + Availability + Pricing): Build Spec

**Goal:** Alumni can log in, edit their profile, set availability, and manage pricing.

**Complexity:** Easy
**Dependencies:** Phase 4

## Files to create

```
src/
├── actions/
│   ├── alumni-profile.actions.ts   # updateProfile, updateAvailability, updateSessionPricing
│   └── availability.actions.ts     # +setRecurringSlots, +setOneOffSlots, +deleteSlot (add to existing)
├── components/
│   ├── ProfileEditor.tsx           # Edit bio, photo, linkedin, languages
│   ├── AvailabilityEditor.tsx      # Set recurring weekly availability + one-off slots
│   └── PricingEditor.tsx           # Set per-session-type prices
└── app/
    └── alumni/
        └── profile/
            ├── page.tsx            # Profile view (read-only)
            ├── edit/page.tsx       # Edit profile form
            ├── availability/page.tsx # Manage availability calendar
            └── pricing/page.tsx    # Manage session pricing
```

## What works after Phase 7
- Alumni can log in and view their dashboard (upcoming bookings)
- Edit profile: photo (upload to /public/uploads/), bio, languages, LinkedIn URL
- Set recurring weekly availability + one-off slots
- Set pricing per session type (30/45/60 min 1:1, group)
- View their upcoming bookings with student details
- Cannot self-verify (verification is admin-only)

## Design rules
- No comments in code
- Tailwind utility classes only, no --color-* CSS vars
- Inter font, no emojis, no italic headers
- Framer Motion for transitions
- All pages are server components wrapping client components
- Auth guard on every page
