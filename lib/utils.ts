import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { pragueFormatDateTime, pragueTimeInput } from '@/lib/prague-time'
import { applyCzechNbsp } from '@/lib/typography'

import { scrollToSection, setSectionHash } from '@/src/lib/navigation-core-adapter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const updateLocationHash = setSectionHash

export { applyCzechNbsp, scrollToSection }

export const timeToInput = pragueTimeInput
export const formatDateTime = pragueFormatDateTime
