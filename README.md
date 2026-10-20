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
pnpm install
pnpm run dev:local            # http://localhost:3000, admin: user "admin", password "local-admin"
```

`pnpm run dev:local` is the safe way to work locally: it starts a throwaway Redis on port 6390 and overrides
`REDIS_URL` and the admin credentials, so changes made in `/admin` can never reach production data. Plain
`pnpm run dev` uses whatever is in `.env.local`, which may be the production Redis. Requires `redis-server`
(`brew install redis`). The admin also opens as `http://admin:local-admin@localhost:3000/admin` (the page then
reloads itself without the credentials, because browsers refuse to save from a URL that contains them).
Next.js allows one dev server per folder, so stop a running `pnpm run dev` first. The admin cookie is `Secure`, so use Chrome or Firefox on `localhost` (Safari drops it over http).

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

### Admin Panel

Basic-auth credentials protect `/admin`:

- `AUTH_USERNAME` – admin username
- `AUTH_PASSWORD` – admin password (the placeholder from `.env.example` is rejected)
- `JWT_SECRET` – random secret that signs the login cookie, e.g. `openssl rand -base64 48`; in production the
  admin refuses to log in without it

### Booking / Redis

- `REDIS_URL` – Redis connection string (e.g. from Upstash)

## Commands

- `pnpm run dev:local` starts the dev server against a throwaway local Redis (safe, recommended).
- `pnpm run dev` starts the dev server with the environment from `.env.local`.
- `pnpm calendar:backup list | dump | restore` inspects and restores calendar backups.
- `pnpm run lint` runs ESLint.
- `pnpm run test:e2e` runs the Playwright end-to-end suite.
- `pnpm run perf:lighthouse` runs local desktop and mobile Lighthouse audits.

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
