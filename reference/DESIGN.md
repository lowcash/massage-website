# Design System Document: The Editorial Sanctuary

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Curated Breath."**

In the high-end luxury wellness space, true luxury is not about more; it is about the intentionality of less. This system rejects the cluttered, "app-like" density of standard SaaS interfaces in favor of a high-end editorial experience. We treat the digital screen like a premium lifestyle magazine—emphasizing generous whitespace, sophisticated asymmetrical compositions, and a tactile sense of depth.

To move beyond "template" aesthetics, designers must embrace **Intentional Asymmetry**. Overlap images with text containers, use staggered grid alignments, and allow elements to "breathe" with expansive margins. The goal is a visual rhythm that mimics the slow, restorative pace of a premium spa experience.

---

## 2. Colors & Tonal Depth

Our palette is rooted in organic, warmth-driven neutrals that evoke a sense of calm and professional reliability.

### The "No-Line" Rule

**Strict Mandate:** Traditional 1px solid borders are prohibited for sectioning or containment.
Structure must be defined through:

1.  **Background Color Shifts:** Use `surface-container-low` (#f6f3f0) against the `background` (#fcf9f6) to define a new section.
2.  **Tonal Transitions:** Use soft gradients or subtle shifts in container tiers to guide the eye.

### Surface Hierarchy & Nesting

Treat the UI as a physical stack of fine paper.

- **Base:** `background` (#fcf9f6) is the canvas.
- **Floating Elements:** Use `surface-container-lowest` (#ffffff) for cards or high-priority modals to create a "lifted" effect.
- **Sunken Elements:** Use `surface-container-high` (#eae8e5) for secondary utility areas like sidebars or footers.

### The "Glass & Gradient" Rule

To achieve a "frosted glass" look for sticky headers or floating navigation, use the `surface` color at 70% opacity with a `backdrop-blur` of 20px.

- **Signature Textures:** Apply a subtle linear gradient from `primary` (#7d5141) to `primary_container` (#996958) on main Call-to-Action buttons. This adds a "silk-like" sheen that flat hex codes cannot replicate.

---

## 3. Typography: The Editorial Voice

The tension between the serif and sans-serif creates the brand’s "Trustworthy yet Modern" personality.

- **Display & Headlines (Cormorant Garamond / notoSerif):** These are our "hero" voices. Use `display-lg` (3.5rem) with tight letter-spacing for high-impact statements. The elegance of the serif communicates the brand's luxury heritage.
- **Body & Labels (DM Sans / manrope):** Used for clarity and professionalism. The clean, geometric nature of the sans-serif ensures that even complex information feels approachable and calm.
- **Hierarchy Tip:** Always pair a `display-md` headline with a `label-md` uppercase sub-header (using 0.1em letter spacing) to achieve a high-fashion editorial look.

---

## 4. Elevation & Depth

We eschew the "drop shadow" of 2010. Elevation in this system is organic and atmospheric.

- **The Layering Principle:** Depth is achieved by "stacking" container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create natural lift.
- **Ambient Shadows:** If a shadow is required for interaction (e.g., a hovered card), use: `box-shadow: 0 12px 40px rgba(44, 36, 32, 0.06);`. The shadow color is a tint of our charcoal text, not a generic grey.
- **The "Ghost Border" Fallback:** If accessibility requires a boundary, use `outline-variant` (#d6c2bc) at 20% opacity. 100% opaque borders are forbidden as they "choke" the design.
- **Glassmorphism:** Use `surface_variant` at 40% opacity with a heavy blur for navigation overlays, allowing the "warm cream" of the background to bleed through, maintaining the warm temperature of the UI.

---

## 5. Components

### Buttons

- **Primary:** Background: `primary` (#7d5141) gradient to `primary_container`. Text: `on_primary` (#ffffff). Shape: `DEFAULT` (0.5rem / 12px).
- **Secondary:** Background: `transparent`. Border: "Ghost Border" (20% `outline-variant`). Text: `primary`.
- **Tertiary:** No background or border. `label-md` typography with a subtle underline (2px) in `secondary_fixed`.

### Cards & Lists

- **Rule:** Forbid divider lines.
- **Execution:** Separate list items using the **Spacing Scale** (e.g., `spacing-4` / 1.4rem gap). For cards, use a `surface-container-low` background with 12px rounded corners.
- **Interactive Cards:** On hover, transition the background to `surface-container-lowest` and apply an **Ambient Shadow**.

### Input Fields

- **Style:** Minimalist. No bottom border. Use a `surface-container-low` filled background.
- **Focus State:** The background remains static, but the "Ghost Border" increases to 40% opacity. Label shifts to `primary` color.

### Signature Component: The "Wellness Carousel"

A bespoke component for spa services. Instead of a standard horizontal scroll, use a staggered vertical stack where cards slightly overlap, utilizing `spacing-negative` values and `surface-container` tiers to create a layered "piling" effect.

---

## 6. Do’s and Don’ts

### Do:

- **Embrace Whitespace:** Use `spacing-16` (5.5rem) and `spacing-24` (8.5rem) between major sections to let the content breathe.
- **Mix Alignments:** Center-align your display headlines but left-align your body copy for an intentional, asymmetric editorial feel.
- **Use High-End Imagery:** Only use photography with warm undertones and soft focus to match the `primary` (#7d5141) and `secondary` (#6c5a54) tokens.

### Don’t:

- **Don't use pure black:** Never use #000000. Use `on_surface` (#1c1c1a) or the deep charcoal provided.
- **Don't use hard borders:** Avoid 1px #CCCCCC lines. They create visual noise and break the "calm" personality.
- **Don't crowd the edges:** Elements should never touch the edge of the viewport; maintain a minimum margin of `spacing-8` (2.75rem) on all screens.
