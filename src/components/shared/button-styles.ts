/** Shared calm button styles: flat, no shadow, sentence case, soft colour transitions only. */
const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.9375rem] leading-none font-medium tracking-[0.02em] transition-[background-color,border-color,color] duration-480 ease-(--ease-soft) disabled:cursor-not-allowed'

export const PRIMARY_BUTTON = `${BASE} bg-brand text-on-brand hover:bg-brand-hover disabled:bg-surface-alt disabled:text-slot-unavailable`

export const INVERSE_BUTTON = `${BASE} bg-paper text-ink hover:bg-surface-alt`

export const SECONDARY_BUTTON = `${BASE} border border-[color-mix(in_oklab,var(--color-ink)_30%,transparent)] text-ink hover:bg-surface-alt`
