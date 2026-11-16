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

**Implementation**: `src/components/features/BookingCalendar.tsx`, `src/components/features/booking/MonthGrid.tsx`, `lib/booking-days.ts`, `app/actions/calendar.ts`

The public booking calendar is a three-step picker: (1) service (native `select`, shared with the service rows through `BookingContext`, optional), (2) day in a month grid with availability dots, (3) time chips for the chosen day, followed by a summary (service, date and time range when the service has a fixed length, price) and a WhatsApp link that carries service, date and time. Nothing is written when a visitor books; the reservation is completed in WhatsApp and the therapist marks the slot in `/admin`.

- `lib/booking-days.ts` is the pure data layer (Prague day grouping, today's already started slots dropped, month weeks, Czech date formatting, end time from the service duration). Unit coverage: `tests/unit/booking-days.test.ts`.
- `MonthGrid` is an ARIA grid with a roving tabindex: Tab enters once, arrows move by day/week, Home/End go to the week edges, PageUp/PageDown switch month. Days announce their state ("pondělí 16. listopadu, 3 volné termíny" / "obsazeno"); days without slots are `aria-disabled`. Fully booked days stay selectable so the visitor sees why nothing is offered.
- `BookingCalendar` receives `generatedAt` from the server, so the first client render matches the HTML; the clock takes over after mount.
- Admin-side updates (`updateCalendar`) are unchanged and still back up the calendar before every write.

### 2. Admin Authentication Boundary

**Implementation**: `app/admin/*`, `app/actions/user.ts`, `lib/jwt.ts`

Admin access is protected by credentials and JWT-backed session state stored in HTTP-only cookies. Protected actions verify identity on the server instead of trusting client state.

### 3. Availability Storage

**Implementation**: `app/actions/calendar.ts`, `lib/config/*`

Availability and reservations live in Redis, which fits the slot-oriented data model and keeps reads fast for the booking calendar without introducing a heavier SQL layer.

### 4. Next Free Slot (Hero Badge)

**Implementation**: `lib/next-free-slot.ts`, `src/components/features/Hero.tsx`, `lib/prague-time.ts`

`findNextFreeSlot` is a read-only view over the same calendar data the booking panel uses. It returns the first available slot, skipping reserved slots and today's slots that have already started (Prague time). `Hero.tsx` shows the result as the "Nejbližší volný termín" badge; when no slot is free the badge is omitted. Unit coverage: `tests/unit/next-free-slot.test.ts`.

### 5. Demo Calendar (preview only)

**Implementation**: `lib/demo-calendar.ts`, `app/actions/calendar.ts`, `app/page.tsx`

A preview deployment without Redis would show an empty booking section, so the calendar design could not be reviewed. Demo mode serves a generated, deterministic sample (next four weeks, mixed free/busy slots, fully booked days, one day off, a few Saturdays) instead of Redis.

- **Gate** (`isDemoCalendarEnabled`, fails closed): off when `VERCEL_ENV` is `production` (even if the flag is set by mistake); on when `VERCEL_ENV` is `preview` or `DEMO_CALENDAR` is exactly `1` (local runs, e2e). Unit coverage: `tests/unit/demo-calendar.test.ts`.
- **No Redis**: `getCalendar` returns the sample before any Redis call; `updateCalendar` returns early, so admin edits in a preview are simulated by doing nothing (nothing is written, the next load shows the sample again).
- **UI**: a dashed note ("Ukázková data pro náhled") appears above the calendar. The reservation button becomes "Vyzkoušet rezervaci": it marks the slot busy in component state only, never opens WhatsApp. A reload restores the sample.
- **E2E**: `tests/e2e/demo-calendar.spec.ts` runs in the `demo-chrome` project against a second build (`NEXT_DIST_DIR=.next-demo`, port 3140) whose `REDIS_URL` points at a dead port.
- Never set `DEMO_CALENDAR` in Vercel Production; the gate ignores it there, but keep the variable out of the Production environment anyway.

### 6. Quiet Salon Visual System

**Implementation**: `app/globals.css` (`@theme`), `app/layout.tsx` (fonts), `src/components/shared/SectionIntro.tsx`, `src/components/shared/RevealFallback.tsx`

- **Direction**: calm but confident salon. Warm linen and sand surfaces that alternate section by section (`surface`, `band`), one saturated-enough clay accent (`brand`, about 6:1 on white), a deep `night` footer as the anchor and one `brand` band (gift vouchers) as the single colour moment. Text pairs are WCAG AA on every surface. Photography is shown in natural colour (no wash, no overlay). No shadows on cards except the booking panel, no grain, no decorative pills.
- **Design tokens** are OKLCH colour variables under `@theme` in `app/globals.css` (for example `brand`, `ink`, `surface`, `band`, `paper`, `sage`), with an sRGB fallback block for browsers without OKLCH support (`@supports not (color: oklch(0 0 0))`). Components use the token utilities (`bg-paper`, `text-ink`, `text-brand`), not raw colours.
- **Buttons** come from `src/components/shared/button-styles.ts` (`PRIMARY_BUTTON`, `SECONDARY_BUTTON`): flat, sentence case, colour transitions only.
- **Photography** uses `.photo-soft` (saturation 0.88, contrast 1.02): natural colour with a hint of warmth.
- **Fonts** are loaded with `next/font/google` in `app/layout.tsx`: Fraunces (display headings, light weight 300-360, variable axes), DM Sans (UI and body text) and Dancing Script (signature accents only). Font families are exposed as `--font-display`, `--font-sans-display` and `--font-dancing`.
- **SectionIntro** renders the shared section header (eyebrow, `h2`, lead text) used by the content sections. It carries the `reveal` class.
- **Scroll reveal** is slow and quiet: text only rises a few pixels (`.reveal`, `.reveal-soft`; no opacity change, because half transparent text fails axe contrast checks at whatever scroll position they run) and text-free blocks such as the portrait fade in (`.reveal-media`), using CSS `animation-timeline: view()` gated by `prefers-reduced-motion` and `@supports`. **RevealFallback** is a client component that renders nothing; it only adds the hidden-until-visible state (`.js .reveal`) when the browser has no view timelines and the visitor accepts motion. Content is fully visible without JavaScript and under reduced motion.

## Tech Stack Decisions

- **Next.js App Router + Server Actions** keep booking mutations close to the route layer without adding a separate client API surface.
- **next-safe-action + Zod** provide typed action boundaries and shared validation for booking and admin input.
- **Redis** matches appointment and availability data with low operational overhead.
- **shadcn/ui + Radix** provide accessible interactive primitives without custom widget infrastructure.

### Floating chrome

WhatsApp (44px, bottom right) and the scroll-to-top button (44px, outline style, 12px above WhatsApp) share one rail (`FloatingContainer`). Scroll-to-top appears only after the hero has fully scrolled past and hides with the footer. From 1440px the rail (and the section dots) sit in the gutter just outside the 76rem content shell, below that they use the nav column. `useRafThrottle` resets its frame id on cleanup, otherwise React StrictMode (dev) froze every throttled scroll handler.
