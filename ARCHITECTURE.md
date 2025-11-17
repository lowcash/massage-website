# Architektura projektu

## Struktura složek

```
/src
├── components/          ← Design components (single source of truth)
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── Testimonials.tsx
│   ├── Calendar.tsx
│   ├── BookingCalendar.tsx
│   ├── ScrollProgress.tsx
│   ├── ScrollToTop.tsx
│   ├── SideDots.tsx
│   ├── SwipeNavigation.tsx
│   ├── WhatsAppButton.tsx
│   ├── WaveDivider.tsx
│   └── ui/             ← shadcn UI components (if needed)
├── assets/             ← Design images (hero carousel)
├── contexts/           ← React contexts
│   └── BookingContext.tsx
└── guidelines/         ← Design documentation

/components             ← Next.js-specific components (admin, UI utilities)
├── ui/                 ← shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── separator.tsx
│   └── sonner.tsx
├── SignOut.tsx         ← Admin: logout component
├── DateTimeSelector.tsx ← Admin: calendar editor
└── Header.tsx          ← Layout component

/app
├── layout.tsx          ← Root layout with BookingProvider
├── page.tsx            ← Main page (imports from @/src/components)
├── admin/
│   ├── layout.tsx      ← Admin layout
│   └── page.tsx        ← Admin page (imports from @/components)
├── actions/            ← Server actions
├── api/                ← API routes (if any)
└── robots.ts, sitemap.ts
```

## Princip

- **Single Source of Truth**: Všechny design komponenty žijí v `/src/components`
- **Bez duplikace**: Komponenty se nereplikují
- **Čistá separace**: 
  - `/src` = Vite-compatible design komponenty (lze reuse v jiných projektech)
  - `/components` = Next-specific komponenty (admin, utilities)
  - `/app` = Next.js app router (stránky a logika)

## Import patterns

```typescript
// Importovat design komponenty z /src
import Hero from '@/src/components/Hero'
import { useBooking } from '@/src/contexts/BookingContext'
import heroAsset from '@/src/assets/hero-image.png'

// Importovat Next-specific z /components
import { Button } from '@/components/ui/button'
import SignOut from '@/components/SignOut'
```

## Migrace z Vite na Next

Všechny komponenty v `/src/components` jsou kompatibilní s oběma frameworky:
- ✅ Importují `framer-motion` (ne `motion/react`)
- ✅ Mají `'use client'` directive kde je potřeba
- ✅ Importují z `@/src/contexts` a `@/src/assets`
- ✅ Exportují `export default function` (Next-compatible)

