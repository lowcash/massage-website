# Massage Website — Mgr. Radka Šebestová

Professional website for a massage therapist with an integrated online booking system.

## Tech Stack

| Tool             | Version | Purpose                                 |
| ---------------- | ------- | --------------------------------------- |
| Next.js          | 16      | SSR framework (App Router)              |
| React            | 19      | UI layer (React Compiler enabled)       |
| TypeScript       | 5       | Type safety                             |
| Tailwind CSS     | 4       | Utility-first styling                   |
| CSS Transitions  | —       | Animations via custom `useInView` hook  |
| shadcn/ui        | latest  | Headless component primitives           |
| Radix UI         | latest  | Accessible dialog, separator primitives |
| Redis            | —       | Calendar reservation caching            |
| Zod              | 3       | Schema validation                       |
| next-safe-action | 8       | Type-safe server actions                |
| Sonner           | 2       | Toast notifications                     |
| Playwright       | 1       | End-to-end tests                        |
| Lighthouse       | 12      | Performance baseline                    |

## Architecture

High-level structure, component ownership, and system design live in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Development Setup

```bash
cp .env.example .env.local   # fill in REDIS_URL, AUTH_USERNAME, AUTH_PASSWORD
npm install
npm run dev                  # http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

### Admin Panel

Basic-auth credentials protect `/admin`:

- `AUTH_USERNAME` – admin username
- `AUTH_PASSWORD` – admin password

### Booking / Redis

- `REDIS_URL` – Redis connection string (e.g. from Upstash)

## Commands

| Command                            | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `npm run dev`                      | Start dev server (Turbopack, port 3000) |
| `npm run build`                    | Production build                        |
| `npm run preview`                  | Serve production build locally          |
| `npm run lint`                     | ESLint                                  |
| `npm run typecheck`                | TypeScript check                        |
| `npm run format`                   | Prettier                                |
| `npm run test:e2e`                 | Run all Playwright tests                |
| `npm run test:e2e:baseline`        | Smoke + a11y tests (CI subset)          |
| `npm run perf:lighthouse:baseline` | Build + Lighthouse + threshold check    |

## Testing

Three Playwright projects: `desktop-chrome`, `mobile-safari`, `mobile-chrome`.
Tests run against a production preview build on port 3100 to avoid port conflicts.

```bash
npm run test:e2e
npm run test:e2e:ui   # interactive UI mode
```

## Production

Production URL: [https://pohlazenipoteleadusi.cz](https://pohlazenipoteleadusi.cz)  
Current deployment target: Vercel

---

**Author**: Lowcash  
**License**: MIT
