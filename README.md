# Massage Website - Mgr. Radka Šebestová

Profesionální web pro masérku s online rezervačním systémem. Vytvořeno s Next.js s design komponentami ze struktury kompatibilní s Vite.

## 🚀 Technologie

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Redis** - Calendar reservation caching
- **shadcn/ui** - UI components
- **Sonner** - Toast notifications

## 📁 Projekt Struktura

Viz `ARCHITECTURE.md` pro podrobný popis. Krátký přehled:

```
/src              → Design komponenty (single source of truth)
/components       → Next-specific komponenty (admin, utilities)
/app              → Next.js app router (pages, layouts, actions)
```

## 🏗️ Design Architecture

Všechny **design komponenty** žijí v `/src/components` a jsou importovány jako:

```typescript
import Hero from '@/src/components/Hero'
import { useBooking } from '@/src/contexts/BookingContext'
```

**Admin komponenty** a utilities zůstávají v `/components`:

```typescript
import { Button } from '@/components/ui/button'
import SignOut from '@/components/SignOut'
```

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edituj .env.local s tvým API klíčem, Redis URL, atd.

# Run dev server
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## 📝 Klíčové Soubory

- `app/page.tsx` - Hlavní stránka (importuje z `/src/components`)
- `app/admin/page.tsx` - Admin panel (importuje z `/components`)
- `app/layout.tsx` - Root layout s BookingProvider
- `src/contexts/BookingContext.tsx` - State management
- `app/actions/calendar.ts` - Server actions pro rezervace

## 🔗 Import Convention

**Design komponenty** (reusable, framework-agnostic):
```typescript
import from '@/src/components/...'
import from '@/src/assets/...'
import from '@/src/contexts/...'
```

**Next-specific** (admin, utilities):
```typescript
import from '@/components/ui/...'
import from '@/components/SignOut'
```

## 📱 Stránky

- `/` - Hlavní stránka s hero, služby, o mně, rezervace, FAQ, kontakt
- `/admin` - Admin panel pro správu rezervací (frontend pro tvorbu slotů)
- `/robots.txt`, `/sitemap.xml` - SEO

## 🎨 Styling

- Global styles v `app/globals.css`
- Component styles inline s Tailwind
- Font: Dancing Script (pro nadpisy), system font (text)

## 🚀 Deployment

Deploy na Vercel:

```bash
git push origin main
```

Vercel automaticky detekuje Next.js a deployuje.

Nebo ručně:

```bash
npm run build
npm start
```

## 📚 Další Info

- ARCHITECTURE.md - Detailní popis struktury projektu
- TypeScript config v `tsconfig.json`
- Tailwind config v `tailwind.config.ts`
- Next.js config v `next.config.ts`

---

**Autor**: Radka Šebestová  
**Web**: https://masaze-hodonin.cz
