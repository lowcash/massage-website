# Project Architecture

## Overview
This project is a Next.js 16 application built with TypeScript, serving as a professional massage service booking platform. It features server-side rendering, server actions for data mutation, and a Redis-backed caching layer.

## Directory Structure

```
app/                 # Next.js App Router pages and layouts
  actions/           # Server Actions (backend logic)
  admin/             # Admin panel routes
  api/               # API routes (auth, etc.)
components/          # React components
  admin/             # Admin-specific components
  ui/                # Reusable UI elements (shadcn/ui)
lib/                 # Utilities and helpers
  jwt.ts             # Authentication logic
  safe-action.ts     # Type-safe server action wrapper
  schemas/           # Zod validation schemas
public/              # Static assets
styles/              # Global styles
types/               # TypeScript type definitions
```

## Key Systems

### 1. Booking System
- **Frontend**: `CalendarForm.tsx` handles user input and date selection.
- **Backend**: `actions/calendar.ts` processes bookings, validates availability, and updates Redis.
- **State**: React Server Components fetch initial data; Client Components handle interactivity.

### 2. Authentication
- **Method**: JWT (JSON Web Tokens) stored in HTTP-only cookies.
- **Implementation**: `lib/jwt.ts` handles signing and verification.
- **Protection**: Middleware or per-action checks ensure admin-only access.

### 3. Data Persistence
- **Database**: Redis (Upstash) used for storing appointments and availability.
- **Pattern**: Key-value store optimized for fast reads of available slots.

## Tech Stack Decisions
- **Next.js 16**: Latest features including Server Actions and partial prerendering.
- **Tailwind CSS v4**: Cutting-edge styling engine.
- **Redis**: Simple, fast storage sufficient for calendar data without SQL overhead.
- **Zod**: Runtime validation for all user inputs.
