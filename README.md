# Massage Website - Mgr. Radka Šebestová

Professional website for a massage therapist with an online reservation system. Built with Next.js using a component structure compatible with Vite.

## 🚀 Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **CSS Animations + Intersection Observer** - Animations (custom useInView hook, no Framer Motion)
- **Redis** - Calendar reservation caching
- **shadcn/ui** - UI components
- **Sonner** - Toast notifications

## 📁 Project Structure

See `ARCHITECTURE.md` for a detailed description. Brief overview:

```
/src/components/features   → Domain-specific components (Hero, Admin, etc.)
/src/components/layout     → Layout components (Header, Footer, Navigation)
/src/components/shared     → Shared reusable components
/src/components/ui         → Base UI components (shadcn/ui)
/app                       → Next.js app router (pages, layouts, actions)
```

## 🏗️ Design Architecture

All components live in `/src/components` and are organized by category:

```typescript
import Hero from '@/src/components/features/Hero'
import { Button } from '@/src/components/ui/button'
```

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API key, Redis URL, etc.

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## 📝 Key Files

- `app/page.tsx` - Main page
- `app/admin/page.tsx` - Admin panel
- `app/layout.tsx` - Root layout with BookingProvider
- `src/contexts/BookingContext.tsx` - State management
- `app/actions/calendar.ts` - Server actions for reservations

## 📱 Pages

- `/` - Main page with hero, services, about me, booking, contact
- `/admin` - Admin panel for reservation management
- `/robots.txt`, `/sitemap.xml` - SEO

## 🎨 Styling

- Global styles in `app/globals.css`
- Component styles inline with Tailwind
- Font: Dancing Script (headings), system font (text)

## 🚀 Deployment

Deploy to Vercel:

```bash
git push origin main
```

Vercel automatically detects Next.js and deploys.

Or manually:

```bash
npm run build
npm start
```

## 📚 More Info

- ARCHITECTURE.md - Detailed project structure description
- TypeScript config in `tsconfig.json`
- Tailwind config in `tailwind.config.ts`
- Next.js config in `next.config.ts`

---

**Author**: Radka Šebestová  
**Web**: https://masaze-hodonin.cz
