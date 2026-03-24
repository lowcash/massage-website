import { clsx, type ClassValue } from 'clsx'
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
  const withSingleLetterWords = normalizedText.replace(
    /(^|[\s(„"'])([AaIiKkOoSsUuVvZz])\s+/g,
    '$1$2\u00A0'
  )

  // Keep common short Czech prepositions and conjunctions with the following word.
  const withShortFunctionWords = withSingleLetterWords.replace(
    /(^|[\s(„"'])(do|na|od|po|za|ve|ze|ke|se|či|že)\s+/gi,
    '$1$2\u00A0'
  )

  // Keep common abbreviations and titles with the following word.
  const withAbbreviations = withShortFunctionWords.replace(
    /(^|[\s(„"'])((?:Mgr|Ing|Bc|DiS|MUDr|PhDr|JUDr|RNDr|MVDr|PharmDr|doc|prof|akad|sv|tř|ul|nám|č|čl|např|tj|tzv|atd|apod))\.\s+/giu,
    '$1$2.\u00A0'
  )

  // Keep postal codes together.
  const withPostalCodes = withAbbreviations.replace(/(\d{3})\s+(\d{2})(?=\s|$)/g, '$1\u00A0$2')

  // Keep numeric values together with short units.
  return withPostalCodes.replace(
    /(\d+)\s+(%|°C|kg|g|km|m|cm|mm|min|h)\b/gi,
    '$1\u00A0$2'
  )
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
