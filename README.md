# Massage Website — Mgr. Radka Šebestová

Professional website for a massage therapist with an integrated online booking system.

## Tech Stack

| Tool             | Version | Purpose                                 |
| ---------------- | ------- | --------------------------------------- |
| Next.js          | 16      | SSR framework (App Router)              |
| React            | 19      | UI layer (React Compiler enabled)       |
| TypeScript       | 5       | Type safety                             |
| Tailwind CSS     | 4       | Utility-first styling                   |
| shadcn/ui        | 0.29    | Headless component primitives           |
| Radix UI         | 1.1     | Accessible dialog, separator primitives |
| Zod              | 3       | Schema validation                       |
| next-safe-action | 8       | Type-safe server actions                |
| Sonner           | 2       | Toast notifications                     |
| Redis            | 5       | Calendar reservation caching            |
| Playwright       | 1       | End-to-end tests                        |
| Lighthouse       | 12      | Performance baseline                    |

## Architecture

High-level structure, key systems, and architectural decisions live in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

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

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run test:e2e` runs the Playwright end-to-end suite.
- `npm run perf:lighthouse` runs local desktop and mobile Lighthouse audits.

For the full script list, see `package.json`.

## Testing

Three Playwright projects: `desktop-chrome`, `mobile-safari`, `mobile-chrome`.
Tests run against a production preview build on port 3100 to avoid port conflicts.

## Security Baseline

- JWT authentication stored in HTTP-only cookies
- Admin panel (`/admin`) protected by basic auth
- Form validation with Zod on server and client
- Redis caching reduces database calls

## Production

Production URL: [https://pohlazenipoteleadusi.cz](https://pohlazenipoteleadusi.cz)  
Current deployment target: Vercel

**Author**: Lowcash  
**License**: MIT
