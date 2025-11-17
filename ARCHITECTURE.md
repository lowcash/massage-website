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
├── admin/              ← Admin panel components and utilities
│   ├── hooks/          ← Custom hooks
│   │   └── useCalendarManager.ts    ← Calendar state management
│   ├── utils/          ← Utility functions
│   │   └── calendar.ts              ← Calendar helpers
│   ├── CalendarForm.tsx             ← Date/time input form
│   ├── CalendarList.tsx             ← List display container
│   └── CalendarListItem.tsx         ← Individual list item
├── ui/                 ← shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── separator.tsx
│   └── sonner.tsx
├── SignOut.tsx         ← Admin: logout component
├── DateTimeSelector.tsx ← Admin: calendar editor (orchestrator)
└── Header.tsx          ← Layout component

/app
├── layout.tsx          ← Root layout with BookingProvider
├── page.tsx            ← Main page (imports from @/src/components)
├── admin/
│   ├── layout.tsx      ← Admin layout
│   └── page.tsx        ← Admin page (imports from @/components)
├── actions/            ← Server actions
│   └── calendar.ts     ← Calendar management
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
- **Admin Best Practices**: 
  - Hooks pro state management (`useCalendarManager`)
  - Utility functions v `/admin/utils` pro testability
  - Malé, fokusované komponenty (`CalendarForm`, `CalendarList`, `CalendarListItem`)
  - Orchestrator komponenta (`DateTimeSelector`) koordinuje vše

## Import patterns

```typescript
// Importovat design komponenty z /src
import Hero from '@/src/components/Hero'
import { useBooking } from '@/src/contexts/BookingContext'
import heroAsset from '@/src/assets/hero-image.png'

// Importovat Next-specific z /components
import { Button } from '@/components/ui/button'
import SignOut from '@/components/SignOut'
import { useCalendarManager } from '@/components/admin/hooks/useCalendarManager'
import { sortCalendarList } from '@/components/admin/utils/calendar'
```

## Admin Code Structure

Admin kód je organizován pro snadné údržby a testování:

### Hooks (`/components/admin/hooks/`)
- **`useCalendarManager`**: Centrální hook pro správu stavu kalendáře
  - Spravuje seznam termínů (`list`)
  - Trackuje vybraný index (`selectedIndex`)
  - Poskytuje akce: `handleAdd`, `handleRemove`, `handleToggleReserved`
  - Komunikuje se serverem přes `updateCalendar` action

### Utilities (`/components/admin/utils/`)
- **`calendar.ts`**: Čisté funkce bez side-effects
  - `combineDateTime()`: Kombinuje datum a čas
  - `isDateTimeInFuture()`: Validace budoucího data
  - `getDefaultDateString()`: Default hodnoty
  - `getDefaultTimeString()`: Default čas (zaokrouhleno na 5 minut)
  - `sortCalendarList()`: Seřazení seznamu
  - `filterFutureCalendarItems()`: Filtrování minulých termínů

### Komponenty (`/components/admin/`)
- **`CalendarForm`**: Řídící vstup pro datum/čas
  - Zobrazuje input fieldy
  - Volá `onAdd` callback
- **`CalendarList`**: Kontejner pro seznam
  - Zobrazuje `CalendarListItem` pro každý termín
  - Obsluhuje scroll, počet itemů
- **`CalendarListItem`**: Jeden termín v seznamu
  - Zobrazuje datum a čas
  - Checkbox pro toggle dostupnosti
  - Visual feedback pro vybrané
- **`DateTimeSelector`**: Orchestrator
  - Používá `useCalendarManager`
  - Skládá dohromady Form, List, akční tlačítka
  - Obsluhuje toasty a notifications

## Migrace z Vite na Next

Všechny komponenty v `/src/components` jsou kompatibilní s oběma frameworky:
- ✅ Importují `framer-motion` (ne `motion/react`)
- ✅ Mají `'use client'` directive kde je potřeba
- ✅ Importují z `@/src/contexts` a `@/src/assets`
- ✅ Exportují `export default function` (Next-compatible)

## Přidání nových admin funkcí

1. **Přidat utility funkci** → `/components/admin/utils/`
2. **Přidat hook** → `/components/admin/hooks/`
3. **Přidat komponentu** → `/components/admin/`
4. **Složit dohromady** v orchestrator komponentě

Tím se udržuje kód modulární a testovatelný.

