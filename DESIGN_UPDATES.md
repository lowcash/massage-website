# Workflow: Aktualizace z Figma designu

## Koncept

Všechny design komponenty žijí v `/src/components` a jsou single source of truth. Tento dokument popisuje, jak bezpečně aktualizovat komponenty když se změní design v Figmě.

## Přehled toku

```
Figma Design Změny
    ↓
Exportovat/Zkopírovat do vite-project
    ↓
Analyzovat změny (git diff)
    ↓
Aplikovat relevantní změny do /src/components
    ↓
Zachovat Next.js specifické kustomizace
    ↓
Testovat a commitovat
```

## Detailný postup

### 1. Synchronizace z Figmy

Když se změní design v Figmě:

```bash
# Pokud máte vite-project conectovaný na Figmu
cd vite-project
npm run sync-figma  # nebo postup dle vaší setup

# Nebo manuálně: zkopírujte změněné komponenty z Figmy
```

### 2. Identifikace změn

```bash
# Podívejte se, co se změnilo
git diff vite-project/src/components/

# Například: Hero.tsx se změnil v Figmě
# -> Změna v banneru, typography, spacing
```

### 3. Kategorizace změn

Rozlišujte:

**Čisté design změny** (bezpečně synchronizovat):
- Layout, spacing, colors
- Typography (fonty, size)
- Images, assets
- Animation durations (pokud nejsou kritické)

**Strukturální změny** (opatrně!):
- Props interface změny
- Export patterns
- Import paths

**Next.js specifické změny** (NE synchronizovat):
- Server actions integrace
- Database fetching
- Cookie/auth management
- Vercel-specific features

### 4. Bezpečná synchronizace

#### Přístup A: Inkrementální merge (Doporučeno)

```bash
# 1. Porovnat CSS/styling
# Vezměte CSS změny z vite-project a aplikujte do /src/components

# 2. Porovnat JSX strukturu
# Vezměte JSX layout změny a aplikujte do /src/components
# VYNECHTE: props, server logic, data fetching

# 3. Porovnat props
# Pokud se props interface změnil v Figmě:
# - Vezměte nové props
# - Zkombinujte s vašimi Next-specific props
```

#### Přístup B: Three-way merge (Pro větší změny)

```
vite-project/src/components/Hero.tsx (NEW from Figma)
         ↓
    git merge
         ↓
/src/components/Hero.tsx (CURRENT - s Next.js customizations)
         ↓
    MANUÁLNĚ RESOLVE CONFLICTS
         ↓
Výsledek: Obě strany kombinovány chytře
```

#### Přístup C: Side-by-side editace (Nejbezpečnější)

```bash
# 1. Otevřete oba soubory vedle sebe
# - /src/components/Services.tsx (aktuální, s Next.js stuff)
# - vite-project/src/components/Services.tsx (nový z Figmy)

# 2. Příkazem po příkazu:
#    - Zkopírujte design/CSS část
#    - Zachovejte Next.js specifické parte (props, logic, imports)
#    - Testujte inkrementálně
```

### 5. Typické scénáře

#### Scénář 1: Jen CSS/Tailwind změny

```diff
// vite-project/src/components/Hero.tsx
- <div className="px-4 py-8">
+ <div className="px-6 py-12 md:px-8">

// Aplikujte:
// /src/components/Hero.tsx
- <div className="px-4 py-8">
+ <div className="px-6 py-12 md:px-8">
```

✅ Bezpečné - APLIKUJTE VŽDY

#### Scénář 2: Nový import nebo komponenta

```diff
// vite-project/src/components/Services.tsx
+ import { Badge } from '@/components/ui/badge'
+ <Badge>{service.tag}</Badge>

// Aplikujte:
// /src/components/Services.tsx
+ import { Badge } from '@/src/components/ui/badge'  // Pozor: @/src cesta!
+ <Badge>{service.tag}</Badge>
```

⚠️ OPATRNĚ - upravte paths

#### Scénář 3: Props změny

```diff
// vite-project/src/components/ServiceCard.tsx
- interface ServiceCardProps { title: string }
+ interface ServiceCardProps { title: string; badge?: string }

// Aplikujte:
// /src/components/ServiceCard.tsx
- interface ServiceCardProps { title: string }
+ interface ServiceCardProps { title: string; badge?: string }

// Zajistěte backward compatibility
+ badge?: string  // VŽDY optional, pokud to není kritické
```

⚠️ OPATRNĚ - Testujte všechny callsites

#### Scénář 4: Nový import z Figmy UI library

```diff
// vite-project/src/components/Contact.tsx
+ import { FormInput } from '@/components/figma/FormInput'

// Pozor! Figma komponenty jsou v vite-project
// Možnosti:
// A) Zkopírujte do /src/components/figma/
// B) Referenční import z Vite (pokud je sdílený)
// C) Reimplementujte lokálně pokud je to malé
```

❌ NE - zkopírujte, neimportujte z vite-project

### 6. Import paths - KRITICKÉ!

```
ŠPATNĚ:
import Badge from '@/components/ui/badge'
// Vite project struktura, nefunguje v Next!

SPRÁVNĚ v /src/components:
import Badge from '@/src/components/ui/badge'
// Nebo ze shadcn:
import { Badge } from '@/components/ui/badge'
```

### 7. Next.js customizace - CHRAŇTE

Příklady Next.js specifických věcí, KTERÉ SE NEMĚNÍ:

```typescript
// Server actions - NE MĚNIT
import { fetchServices } from '@/app/actions/services'

// Database/Auth integrace - NE MĚNIT
const { userId } = await auth()
const data = await db.services.findAll()

// Context usage - NE MĚNIT
const { selectedService, setSelectedService } = useBooking()

// Vercel Image Optimization - CHRAŇTE
import Image from 'next/image'

// Server Components - CHRAŇTE
// export default function Services() { // bez 'use client' }
```

### 8. Testovací checklist po synchronizaci

Po aplikování změn z Figmy:

```bash
# 1. Build check
npm run build
# ✓ Žádné TypeScript chyby
# ✓ Žádné import errory

# 2. Visual check
npm run dev
# ✓ Komponenta vypadá správně
# ✓ Animace hladké
# ✓ Responsive design OK

# 3. Funkční check
# ✓ Kliknutí / interakce fungují
# ✓ Vnitřní state management OK
# ✓ Props se správně propagují

# 4. Next.js specifické
# ✓ Admin panel funguje
# ✓ Server actions fungují
# ✓ Context poskytuje správná data
```

### 9. Git workflow

```bash
# 1. Vytvořte feature branch
git checkout -b feature/update-hero-from-figma

# 2. Aplikujte změny
# ... editujte komponenty ...

# 3. Testujte
npm run build
npm run dev

# 4. Commitujte
git commit -m "♻️ Update: Sync Hero component from Figma design

- Updated spacing (px-4 → px-6)
- Updated typography (font-size adjustments)
- Updated colors to latest palette
- Maintained Next.js server actions integration
- All tests pass"

# 5. Push a PR
git push origin feature/update-hero-from-figma
```

## Tipy a triky

### Tip 1: Git diff pro porovnání

```bash
# Porovnit konkrétní komponentu
git diff vite-project/src/components/Hero.tsx src/components/Hero.tsx

# Vidíte co se změnilo v obou
# Pomůže vám rozhodnout co aplikovat
```

### Tip 2: Staging changes

```bash
# Nejdřív aplikujte CSS
# Pak JSX
# Pak testujte v jednotlivých krocích

# Tím vyhynete velkým errory
```

### Tip 3: Backup

```bash
# Než synchronizujete větší komponentu
git stash  # Uložit aktuální stav
# Teď můžete experimentovat bezpečně
# Pokud se to pokazí: git stash pop
```

### Tip 4: Komunikace

Pokud se změní interface komponenty (props):
- Sjednoťte se s tynem pokud existuje
- Dokumentujte v PR
- Aktualizujte všechny callsites

## Automatizace (Budoucnost)

Ideálně byste měli:

```bash
# Skript na detekci změn
npm run detect-figma-changes
# → Vypíše co se v Figmě změnilo
# → Návrhy na co synchronizovat

# Skript na merge
npm run merge-figma-changes
# → Interactive wizard
# → Porovná a aplikuje bezpečně
```

## Shrnutí

✅ **Bezpečně aplikujte**:
- CSS/Tailwind změny
- Typography/color updates
- Layout změny
- Asset updates

⚠️ **Opatrně aplikujte**:
- Props interface changes
- Import path changes
- Strukturální JSX změny

❌ **Nikdy neaplikujte**:
- Server actions
- Database integrace
- Auth/Cookie management
- Vercel-specific features

🎯 **Golden Rule**: 
Vždy si vizuálně ověřte, že aplikují ty správné změny, a pak pusťte testy!
