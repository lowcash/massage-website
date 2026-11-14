# Design System Document: The Editorial Sanctuary

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Curated Breath."**

In the high-end luxury wellness space, true luxury is not about more; it is about the intentionality of less. This system rejects the cluttered, "app-like" density of standard SaaS interfaces in favor of a high-end editorial experience. We treat the digital screen like a premium lifestyle magazine—emphasizing generous whitespace, sophisticated asymmetrical compositions, and a tactile sense of depth.

To move beyond "template" aesthetics, designers must embrace **Intentional Asymmetry**. Overlap images with text containers, use staggered grid alignments, and allow elements to "breathe" with expansive margins. The goal is a visual rhythm that mimics the slow, restorative pace of a premium spa experience.

---

## 2. Colors & Tokens (as shipped)

Source of truth: the `@theme` block in `app/globals.css`. Use the Tailwind utilities generated from these tokens (`bg-brand`, `text-ink`, ...) instead of hard-coded hex values.

> **Dark mode is not shipped.** The site is light-only: there is no `.dark` token set, no `dark:` variants and no theme switcher (`next-themes` was removed). Do not add dark-mode styles without a design pass.

### Brand & neutrals

| Token                 | Value     | Use                               |
| --------------------- | --------- | --------------------------------- |
| `--color-ink`         | `#2b211f` | Headings, primary text            |
| `--color-body`        | `#54443f` | Body copy                         |
| `--color-muted-ink`   | `#6b554e` | Secondary text, icon buttons      |
| `--color-brand`       | `#a24d3f` | Brand accent, CTAs, focus outline |
| `--color-brand-hover` | `#8a4033` | CTA hover / pressed               |
| `--color-surface`     | `#f8f2ef` | Default section background        |
| `--color-surface-alt` | `#f0e3de` | Alternating section background    |
| `--color-paper`       | `#fffdfb` | Cards and raised panels           |
| `--color-line`        | `#e8d6d0` | Borders and dividers              |
| `--color-night`       | `#2b1d1a` | Footer, skip link, dark panels    |

### Functional tokens (contrast-checked, WCAG AA)

| Token                      | Value                     | Use                                                      |
| -------------------------- | ------------------------- | -------------------------------------------------------- |
| `--color-whatsapp`         | `#1b7a45`                 | WhatsApp FAB (white icon >= 3:1; was `#25d366`, 1.98:1)  |
| `--color-whatsapp-hover`   | `#157a3c`                 | WhatsApp FAB hover                                       |
| `--color-slot-unavailable` | `#816f69`                 | Unavailable booking slots (~4.76:1 on white)             |
| `--color-nav-hero-active`  | `#ffe4de`                 | Active nav item while the nav sits over the hero         |
| `--color-brand-glow`       | `rgb(201 123 111 / 0.18)` | Glow shadow on the selected booking day                  |
| `--color-overlay-nav`      | `rgb(60 35 28 / 0.07)`    | Sticky nav shadow tint                                   |
| `--color-overlay-drawer`   | `rgb(70 40 32 / 0.08)`    | Mobile drawer shadow tint (not yet used)                 |
| `--color-html-chrome`      | `#2c2c2c`                 | `<html>` background (visible in overscroll / browser UI) |
| `--color-skip-offset`      | `#f6edeb`                 | Skip-link focus ring offset (matches `theme_color`)      |

Admin slot switch: the "off" track uses `bg-ink/50` (3.15:1); `bg-ink/20` failed contrast.

### shadcn-style semantic tokens

`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--ring`, `--chart-*`, `--sidebar-*` and `--radius` are declared in `:root` (neutral `oklch` greys, light values only) and mapped through `@theme inline`. They back the few shadcn-derived primitives (e.g. `sonner`); page UI uses the brand tokens above.

### Surfaces and borders

- Section backgrounds alternate `surface` and `surface-alt`; cards sit on them in `paper` / white.
- Containment uses a 1px `border-line` border on cards, inputs and list rows, plus the soft shadow below. The "No-Line" rule from the original concept was **not** adopted.
- Glass effect: the sticky nav uses `bg-surface/95` with backdrop blur; its drop shadow uses `overlay-nav`. `overlay-drawer` is reserved for the mobile drawer shadow (declared, not yet wired).

---

## 3. Typography

Fonts load through `next/font/google` in `app/layout.tsx` and are exposed as CSS variables:

- **Display & headlines: EB Garamond** (`--font-display`, class `font-display`). Serif voice for headings and large statements.
- **Body & UI: DM Sans** (`--font-sans-display`, set on `body`). Base size `1.0625rem`, line-height `1.65`.
- **Accent script: Dancing Script** (`--font-dancing`, class `font-dancing`). Used sparingly for stats, closing lines and signatures.

Czech typography rules: headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`, and non-breaking spaces are applied through `applyCzechNbsp` (`lib/typography.ts`). Uppercase labels use wide letter-spacing (`~0.12em`-`0.18em`).

---

## 4. Elevation, Radius & Motion

- **Shadow:** a single resting elevation, `--shadow-soft: 0 18px 50px rgb(70 40 32 / 0.07)` (`shadow-soft`). `--shadow-lift` was removed; hovered elements use scale/brightness or `shadow-sm`/`shadow-lg` utilities rather than a second token.
- **Radius scale:** buttons and CTAs are pills (`rounded-full`); chips, inputs and list rows `rounded-xl`; tiles, images and inner cards `rounded-2xl`; large panels `rounded-3xl`.
- **Motion:** `hero-zoom` (slow hero scale), `whatsapp-pulse` (single pulse, `motion-safe:` only) and in-view `Reveal` fades. A global `prefers-reduced-motion` guard in `globals.css` shortens leftover animations and transitions, and `html` scroll behavior falls back to `auto`.
- **Overlays:** dialogs/lightboxes use `bg-black/70` with a blur backdrop and sit above the nav (`z-80`).

---

## 5. Components (as shipped)

- **Primary button:** `bg-brand` -> `hover:bg-brand-hover`, white text, `rounded-full`, uppercase tracked label (flat color, no gradient).
- **Cards:** `bg-paper`/white, `border-line`, `rounded-2xl`/`rounded-3xl`, `shadow-soft`.
- **Focus:** `:focus-visible` shows a 2px `brand` outline with 3px offset on all interactive elements.
- **Carousel:** `PeekCarousel` is a horizontally scrolling, focusable region (`role='region'`) with edge arrows that are removed from the tab order and accessibility tree when they cannot scroll.
- **Dialog:** shared `Dialog` component (Escape, focus trap, focus restore, scroll lock, inert background) used by the portrait and gallery lightboxes.

---

## 6. Do's and Don'ts

### Do:

- **Use tokens**, not raw hex, for any color that appears in markup or CSS.
- **Keep contrast at WCAG AA** (4.5:1 text, 3:1 UI components); verify new colors before adding them to `@theme`.
- **Embrace whitespace:** generous section padding (`py-16`-`py-28`) and the shared `CONTENT_SHELL` width.
- **Use warm photography** that matches the `brand` and `surface` tones.

### Don't:

- **Don't introduce dark-mode styles or `dark:` variants** - dark mode is not shipped.
- **Don't use pure black for text**; use `ink` / `body`. (Black is only used for image overlays.)
- **Don't add new fonts or off-palette colors** without updating `globals.css` and this document.
