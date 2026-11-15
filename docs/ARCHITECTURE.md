# Project Architecture

## Overview

Massage Website is a Next.js App Router booking site focused on reservation intake, admin-only schedule management, and low-overhead data persistence.

## Project Structure

```
app/
├── actions/                     # Server actions for booking and auth
├── admin/                       # Protected admin routes
├── layout.tsx
├── page.tsx
└── globals.css
src/
├── components/
│   ├── features/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── contexts/
├── hooks/
└── lib/
lib/
├── config/
├── schemas/
├── security/
├── jwt.ts
├── next-free-slot.ts               # First bookable slot for the hero badge
├── prague-time.ts                  # Europe/Prague wall-clock helpers for slots
├── redis.ts
├── safe-action.ts
└── typography.ts                   # Czech non-breaking-space helper
types/
tests/
```

## Key Systems

### 1. Booking Flow & Availability

**Implementation**: `src/components/features/BookingCalendar.tsx`, `app/actions/calendar.ts`

The booking UI collects slot and date data, then submits through Server Actions that validate inputs and check availability on the server. That keeps the public booking flow and admin-side updates aligned around the same reservation rules.

### 2. Admin Authentication Boundary

**Implementation**: `app/admin/*`, `app/actions/user.ts`, `lib/jwt.ts`

Admin access is protected by credentials and JWT-backed session state stored in HTTP-only cookies. Protected actions verify identity on the server instead of trusting client state.

### 3. Availability Storage

**Implementation**: `app/actions/calendar.ts`, `lib/config/*`

Availability and reservations live in Redis, which fits the slot-oriented data model and keeps reads fast for the booking calendar without introducing a heavier SQL layer.

### 4. Next Free Slot (Hero Badge)

**Implementation**: `lib/next-free-slot.ts`, `src/components/features/Hero.tsx`, `lib/prague-time.ts`

`findNextFreeSlot` is a read-only view over the same calendar data the booking panel uses. It returns the first available slot, skipping reserved slots and today's slots that have already started (Prague time). `Hero.tsx` shows the result as the "Nejbližší volný termín" badge; when no slot is free the badge is omitted. Unit coverage: `tests/unit/next-free-slot.test.ts`.

### 5. Warm Paper Visual System

**Implementation**: `app/globals.css` (`@theme`), `app/layout.tsx` (fonts), `src/components/shared/SectionIntro.tsx`, `src/components/shared/RevealFallback.tsx`

- **Design tokens** are OKLCH colour variables under `@theme` in `app/globals.css` (for example `brand`, `ink`, `surface`, `paper`, `night`, `glow`, `sage`), with an sRGB fallback block for browsers without OKLCH support (`@supports not (color: oklch(0 0 0))`). Components use the token utilities (`bg-paper`, `text-ink`, `text-brand`), not raw colours.
- **Fonts** are loaded with `next/font/google` in `app/layout.tsx`: Fraunces (display headings, variable axes), DM Sans (UI and body text) and Dancing Script (signature accents only). Font families are exposed as `--font-display`, `--font-sans-display` and `--font-dancing`.
- **SectionIntro** renders the shared section header (eyebrow, `h2`, lead text) used by the content sections. It carries the `reveal` class.
- **Scroll reveal** uses CSS `animation-timeline: view()` (`.reveal`, `.reveal-soft`), gated by `prefers-reduced-motion` and `@supports`. **RevealFallback** is a client component that renders nothing; it only adds the hidden-until-visible state (`.js .reveal`) when the browser has no view timelines and the visitor accepts motion. Content is fully visible without JavaScript and under reduced motion.

## Tech Stack Decisions

- **Next.js App Router + Server Actions** keep booking mutations close to the route layer without adding a separate client API surface.
- **next-safe-action + Zod** provide typed action boundaries and shared validation for booking and admin input.
- **Redis** matches appointment and availability data with low operational overhead.
- **shadcn/ui + Radix** provide accessible interactive primitives without custom widget infrastructure.
