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
└── safe-action.ts
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

## Tech Stack Decisions

- **Next.js App Router + Server Actions** keep booking mutations close to the route layer without adding a separate client API surface.
- **next-safe-action + Zod** provide typed action boundaries and shared validation for booking and admin input.
- **Redis** matches appointment and availability data with low operational overhead.
- **shadcn/ui + Radix** provide accessible interactive primitives without custom widget infrastructure.
