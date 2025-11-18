import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Czech timezone formatter
const PRAGUE_TZ = 'Europe/Prague'

export function dateToInput(date: Date) {
  // yyyy-MM-dd in Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  const yyyy = pragueDate.getFullYear()
  const MM = String(pragueDate.getMonth() + 1).padStart(2, '0')
  const dd = String(pragueDate.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
}

export function timeToInput(date: Date) {
  // HH:MM in Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  return `${String(pragueDate.getHours()).padStart(2, '0')}:${String(pragueDate.getMinutes()).padStart(2, '0')}`
}

export function formatDateTime(date: Date) {
  // dd.MM.yyyy HH:mm in Prague timezone
  const pragueDate = new Date(date.toLocaleString('en-US', { timeZone: PRAGUE_TZ }))
  const yyyy = pragueDate.getFullYear()
  const MM = String(pragueDate.getMonth() + 1).padStart(2, '0')
  const dd = String(pragueDate.getDate()).padStart(2, '0')
  const HH = String(pragueDate.getHours()).padStart(2, '0')
  const mm = String(pragueDate.getMinutes()).padStart(2, '0')
  return `${dd}.${MM}.${yyyy} ${HH}:${mm}`
}
