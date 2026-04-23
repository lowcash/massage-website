# Universal Blueprint: High-Performance One-Pager Architecture

This blueprint distills the technical excellence from specialized projects into a **generalized framework** for building premium, high-conversion, and technically flawless landing pages (one-pagers).

## 1. The "Semantic Core" Architecture

Regardless of the design, the code should be structured in three strict layers to ensure maintainability.

### A. The Primitive Layer (`ui/core`)

- **Purpose**: Pure layout and atomic components.
- **Components**: `Stack` (Flex/Grid), `Box` (Containers), `Text` (Typography engines), `Button`.
- **Constraint**: These components should NOT have business colors or specific branding. They accept props like `gap`, `padding`, `align`, and `variant`.

### B. The System Layer (`ui/prefabs`)

- **Purpose**: Encapsulating the brand's design system.
- **Components**: `HeroSection`, `PriceTable`, `FeatureGrid`, `TestimonialCard`.
- **Constraint**: This is the ONLY place where brand-specific tokens (colors, specific rounding, shadows) are defined.
- **Best Practice**: Use **Contextual Composition**. A `HeroSection` should internally use `VStack` and `Heading` prefabs to stay consistent.
- **The No-Passthrough / Encapsulation Rule**:
  - Prefabs do NOT expose `className`/`style` to consumers.
  - Core is used only via semantic prop API inside prefabs.
  - For missing coverage: add new prop to core OR use raw HTML in prefab.
  - Brand tokens (text-accent-amber etc.) on raw HTML in prefab = correct.

### C. The Assembly Layer (`app/`)

- **Purpose**: Assembling the one-pager.
- **Constraint**: **The Rule of Zero**. There should be zero `className` or `style` props here. If you need to "nudge" an element, adjust the `ui/core` props or create a new prefab.

---

## 2. Technical Performance & SEO (RSC First)

- **Keep it Static**: 90% of a one-pager (Hero, Features, Pricing) should be **React Server Components (RSC)**.
- **Isolate Interactivity**: Only wrap specific interactive elements (e.g., a "Contact Form" or a "Pricing Toggle") in `'use client'`.
  - **Leaf-only rule**: `'use client'` must be placed on the smallest possible leaf component that requires browser APIs (`useState`, `useEffect`, `IntersectionObserver`, event listeners). Never propagate it to a parent section just because it contains an interactive child.
  - **Correct pattern**: `HeroSection` (RSC) renders `<HeroCarousel />` (client leaf) — the section itself stays server-rendered.
- **Benefit**: Zero-JS for the initial render, perfect lighthouse scores, and instant "Time to Interactive".

### Responsive Without Hydration Issues

- **Anti-Pattern**: Using `window.innerWidth` or `useMediaQuery` (causes layout shifts and forces Client Components).
- **Pro-Pattern**: Use CSS-based visibility tokens in your layout primitives.
  - `<Stack hideOn="md">` -> Renders a div with a `hidden md:flex` class.
  - This works perfectly with SSR/RSC.

---

## 3. Styling & Theming (CSS Variable Engine)

### The Single Source of Truth

Use **Tailwind CSS 4+** with CSS variables defined in a global theme layer.

```css
@theme {
  --color-brand-primary: #...;
  --color-surface-sunken: #...;
  --spacing-section: 5rem;
}
```

- **Why?**: You can swap the entire "one-pager" look for a different product just by changing these variables, without touching a single component.

---

## 4. Premium Feel (Micro-Interactions)

### Orchestrated Animations

Don't just fade things in. Use a "Standard Animation Wrapper" prefab:

- **`EntranceAnimation`**: Uses `framer-motion` to handle `whileInView` events.
- **Staggered Children**: Layout components (`VStack`, `HStack`) should have an `animate` prop that automatically staggers the appearance of their children.

---

## 5. Developer Workflow (The "Safety Net")

1.  **Storybook-First**: Build every `ui/core` and `ui/prefab` in isolation. If it doesn't look right in Storybook, it shouldn't be in the app.
2.  **Strict Linting**: Use Prettier with the `sort-imports` and `tailwindcss` plugins to keep code readable for any future agent.
3.  **Type Safety**: No `any`. Use strict TypeScript interfaces for props. If a component accepts `children`, use `React.ReactNode`.

---

## 5a. Strict Semantic Rendering (No className/style in Prefabs)

### The Rule: Zero Inline Styles in `ui/prefabs`

- **Prohibition**: No `className` or `style` attributes on raw HTML inside prefabs **except** in very limited cases.
- **Why**: Inline styles couple layout decisions to component implementation, breaking encapsulation and making prefabs hard to maintain.

### Allowed Exceptions

Raw HTML with `className`/`style` is only permitted in these scenarios:

1. **Wrapper divs purely for semantic nesting** (e.g., `<form>`, `<div role="group">`).
2. **Interactive client-leaf components** (e.g., `<GalleryScroll>`, `<HeroCarousel>`) where inline `style` is used for browser APIs (scroll snap, parallax transforms) that cannot be abstracted into CSS classes. Must be documented.
3. **Third-party library integration** where the library requires inline styles (rare). Must be explicitly flagged in a comment.

### Pattern: No Wrapper Divs, Use Core Primitives

Instead of:

```jsx
<div className='mb-16 space-y-4 text-center'>
  <Heading level={2} size='4xl'>
    {title}
  </Heading>
  <Text>{subtitle}</Text>
</div>
```

Use semantic core composition (once Layout API is extended with `SectionHeading` or `CenteredStack`):

```jsx
<SectionHeading align='center' spacing='lg'>
  <Heading level={2} size='4xl'>
    {title}
  </Heading>
  <Text>{subtitle}</Text>
</SectionHeading>
```

### Escalation Path (When Core API Is Insufficient)

1. Check if an existing core prop can solve it (e.g., `spacing`, `align`, `gap`, `variant`).
2. If not, propose extending the core component with a new semantic prop.
3. Once approved, add the prop to core, then use it in prefabs.
4. Document the new prop in this blueprint under "Extended Core API".

---

## 5b. Type Imports Convention

### React Imports (JSX Runtime)

Next.js with `jsx: "react-jsx"` in `tsconfig.json` does **not** require `import React from 'react'` for JSX.

**Correct**:

```tsx
import { FormEvent, ReactNode } from 'react'

export function MyComponent({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

**Incorrect**:

```tsx
import React, { ReactNode } from 'react'

// React is unused for JSX

export function MyComponent({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

### Type Imports (TypeScript 5+)

Always use `type` keyword for type-only imports to clarify intent and reduce bundle size:

```tsx
import type { CSSProperties, FormEvent } from 'react'
import { useState } from 'react'

export function Form() {
  const [styles, setStyles] = useState<CSSProperties>({})
  const handleSubmit = (e: FormEvent) => {
    /* ... */
  }
  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### Import Order (Per `prettier.config.js`)

1. React/Next imports
2. Third-party modules
3. Type definitions (`@/types`)
4. Config (`@/config`)
5. Utils/lib (`@/lib`)
6. Components (`@/components`, `@/ui`)
7. App files (`@/app`)
8. Relative imports (`./`, `../`)

**Example**:

```tsx
import type { ReactNode } from 'react'

import Image from 'next/image'

import { HERO } from '@/lib/content'
import { Container, Section, Heading, Text } from '@/ui/core'

import { HeroCarousel } from './HeroCarousel'

export function HeroSection() {
  return (/* ... */)
}
```

---

## 5c. Formatting Convention (Prettier-Driven)

All code must respect the `prettier.config.js` settings:

- **No semicolons**: `semi: false`
- **Single quotes**: `singleQuote: true`
- **Print width**: `100` characters
- **Tab width**: `2` spaces (no tabs)
- **Trailing comma**: `es5` (in objects/arrays, not function params)
- **Prettier plugins**: `@trivago/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`

### Key Implications

- Import statements auto-sorted per `importOrder` array.
- Tailwind classes auto-sorted in `className` attributes.
- Quote style consistent across file (single quotes).
- No line-ending semicolons.

### Agent Output Standard

When generating or modifying code, agents should:

1. Follow the import order without adding unnecessary blank lines between sections.
2. Use single quotes for all strings.
3. Avoid semicolons at statement ends.
4. Compose longer `className` strings carefully; Prettier will re-sort them.
5. Use 2-space indentation consistently.

---

## 6. One-Pager Specific Checklist

- [ ] **Sticky Navigation**: Does the header transition when scrolling?
- [ ] **Anchor Links**: Is there a smooth-scroll behavior for all IDs?
- [ ] **Accessibility**: Are all sections wrapped in `<section>` with proper `aria-labelledby`?
- [ ] **Fast LCP**: Is the Hero image prioritized via `priority` prop (Next.js Image)?
- [ ] **Conversion Focus**: Is the Primary CTA button using the `Golden Path` variant (highest contrast)?
