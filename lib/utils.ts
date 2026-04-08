import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function applyCzechNbsp(text: string) {
  if (!text) {
    return text
  }

  const normalizedText = text.replace(/\u00A0/g, ' ')

  // Keep one-letter Czech prepositions and conjunctions with the following word.
  const withSingleLetterWords = normalizedText.replace(/(^|[\s(„"'])([AaIiKkOoSsUuVvZz])\s+/g, '$1$2\u00A0')

  // Keep common short Czech prepositions and conjunctions with the following word.
  const withShortFunctionWords = withSingleLetterWords.replace(
    /(^|[\s(„"'])(do|na|od|po|za|ve|ze|ke|se|či|že)\s+/gi,
    '$1$2\u00A0',
  )

  // Keep common abbreviations and titles with the following word.
  const withAbbreviations = withShortFunctionWords.replace(
    /(^|[\s(„"'])((?:Mgr|Ing|Bc|DiS|MUDr|PhDr|JUDr|RNDr|MVDr|PharmDr|doc|prof|akad|sv|tř|ul|nám|č|čl|např|tj|tzv|atd|apod))\.\s+/giu,
    '$1$2.\u00A0',
  )

  // Keep postal codes together.
  const withPostalCodes = withAbbreviations.replace(/(\d{3})\s+(\d{2})(?=\s|$)/g, '$1\u00A0$2')

  // Keep numeric values together with short units.
  return withPostalCodes.replace(/(\d+)\s+(%|°C|kg|g|km|m|cm|mm|min|h)\b/gi, '$1\u00A0$2')
}

const MOBILE_NAVIGATION_OFFSET = 70
const DESKTOP_NAVIGATION_OFFSET = 70

function updateLocationHash(sectionId: string) {
  const nextUrl =
    sectionId === 'hero'
      ? `${window.location.pathname}${window.location.search}`
      : `${window.location.pathname}${window.location.search}#${sectionId}`

  window.history.replaceState(null, '', nextUrl)
}

export { updateLocationHash }

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

export function scrollToSection(sectionId: string, options: { behavior?: ScrollBehavior; updateHash?: boolean } = {}) {
  if (typeof window === 'undefined') {
    return false
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const requestedBehavior = options.behavior ?? 'smooth'
  const behavior = requestedBehavior === 'smooth' && prefersReducedMotion ? 'auto' : requestedBehavior
  const shouldUpdateHash = options.updateHash ?? true

  if (sectionId === 'hero') {
    window.scrollTo({ top: 0, behavior })
    if (shouldUpdateHash) {
      updateLocationHash(sectionId)
    }
    return true
  }

  const element = document.getElementById(sectionId)
  if (!element) {
    return false
  }

  const offset = getNavigationOffset()
  const sectionTop = element.getBoundingClientRect().top + window.scrollY - offset
  const targetTop = Math.max(0, sectionTop)

  window.scrollTo({ top: targetTop, behavior })

  if (shouldUpdateHash) {
    updateLocationHash(sectionId)
  }

  return true
}

// Czech timezone formatter
const PRAGUE_TZ = 'Europe/Prague'

export function dateToInput(date: Date) {
  // yyyy-MM-dd v Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  const yyyy = pragueDate.getFullYear()
  const MM = String(pragueDate.getMonth() + 1).padStart(2, '0')
  const dd = String(pragueDate.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
}

export function timeToInput(date: Date) {
  // HH:MM v Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  return `${String(pragueDate.getHours()).padStart(2, '0')}:${String(pragueDate.getMinutes()).padStart(2, '0')}`
}

export function formatDateTime(date: Date) {
  // dd.MM.yyyy HH:mm v Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  const yyyy = pragueDate.getFullYear()
  const MM = String(pragueDate.getMonth() + 1).padStart(2, '0')
  const dd = String(pragueDate.getDate()).padStart(2, '0')
  const HH = String(pragueDate.getHours()).padStart(2, '0')
  const mm = String(pragueDate.getMinutes()).padStart(2, '0')
  return `${dd}.${MM}.${yyyy} ${HH}:${mm}`
}
