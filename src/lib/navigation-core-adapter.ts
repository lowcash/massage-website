import {
  buildSectionBoundaries,
  buildSectionUrl,
  computeActiveSection,
  getTargetTop,
  resolveScrollBehavior,
  shouldWriteSectionUrl,
} from '@/packages/navigation-core'

const MOBILE_NAVIGATION_OFFSET = 70
const DESKTOP_NAVIGATION_OFFSET = 70
const HERO_SECTION_ID = 'hero'

function getCurrentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function setSectionHash(sectionId: string) {
  if (typeof window === 'undefined') {
    return
  }

  const nextUrl = buildSectionUrl({
    pathname: window.location.pathname,
    search: window.location.search,
    sectionId,
    clearSectionId: HERO_SECTION_ID,
  })

  if (!shouldWriteSectionUrl(getCurrentUrl(), nextUrl)) {
    return
  }

  window.history.replaceState(null, '', nextUrl)
}

export function getNavigationOffset() {
  if (typeof window === 'undefined') {
    return DESKTOP_NAVIGATION_OFFSET
  }

  const header = document.querySelector('header')
  if (header) {
    return header.getBoundingClientRect().height
  }

  const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--navigation-offset').trim()
  const parsedOffset = Number.parseFloat(offsetValue)

  return Number.isFinite(parsedOffset)
    ? parsedOffset
    : window.matchMedia('(min-width: 768px)').matches
      ? DESKTOP_NAVIGATION_OFFSET
      : MOBILE_NAVIGATION_OFFSET
}

/** Timestamp (ms) until which a programmatic scroll is active. The observer should not override the hash during this window. */
let programmaticScrollDeadline = 0

export function isProgrammaticScrollActive(): boolean {
  return Date.now() < programmaticScrollDeadline
}

export function scrollToSection(sectionId: string, options: { behavior?: ScrollBehavior; updateHash?: boolean } = {}) {
  if (typeof window === 'undefined') {
    return false
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = resolveScrollBehavior(options.behavior, prefersReducedMotion)
  const shouldUpdateHash = options.updateHash ?? true

  if (sectionId === HERO_SECTION_ID) {
    window.scrollTo({ top: 0, behavior })
    if (shouldUpdateHash) {
      setSectionHash(sectionId)
    }
    return true
  }

  const element = document.getElementById(sectionId)
  if (!element) {
    return false
  }

  const targetTop = getTargetTop({
    sectionTop: element.getBoundingClientRect().top,
    scrollY: window.scrollY,
    offset: getNavigationOffset(),
  })

  window.scrollTo({ top: targetTop, behavior })

  if (shouldUpdateHash) {
    setSectionHash(sectionId)
    // Lock hash for 1200 ms so the rAF observer doesn't overwrite it mid-scroll.
    programmaticScrollDeadline = Date.now() + 1200
  }

  return true
}

export function resolveActiveSection(sectionIds: readonly string[]) {
  if (typeof window === 'undefined') {
    return null
  }

  const boundaries = buildSectionBoundaries({
    sectionIds,
    resolveOffsetTop: (sectionId) => {
      const section = document.getElementById(sectionId)
      if (!section) {
        return null
      }

      return section.getBoundingClientRect().top + window.scrollY
    },
  })

  return computeActiveSection({
    scrollY: window.scrollY,
    sections: boundaries,
    offset: getNavigationOffset(),
    innerHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  })
}
