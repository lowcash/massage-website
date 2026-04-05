---
applyTo: '**/*.{ts,tsx,js,jsx,mjs}'
---

This file owns import path policy for the repository.

- Prefer alias-based absolute imports over deep relative chains.
- Use `@/*` for root-level paths (maps to `./` in tsconfig).
- Use `@/src/*` for components, hooks, and assets under `src/`.
- Use `@/lib/*` for utilities under `lib/`.
- Prefer same-folder `./` imports only for tightly local siblings.
- Avoid `../..` chains when an alias import can express ownership more clearly.
- Keep aliases aligned with `tsconfig.json` path mappings. When reorganising the project structure, update both the tsconfig paths and all import sites together.
