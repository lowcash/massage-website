'use server'

import { createClient } from 'redis'
import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/app/actions/calendar.schema'
import { formatDateTime } from '@/lib/utils'
import { type CalendarItem } from '@/app/types/calendar'

const CALENDAR_KV_KEY = 'calendar'

const redis = await createClient({ url: process.env.REDIS_URL }).connect()

export const getCalendar = actionClient.action(async () => {
  const fileContent = await redis.get(CALENDAR_KV_KEY)
  if (!fileContent) {
    return []
  }
  const parsedContent = JSON.parse(fileContent as string) as any[]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return parsedContent
    .map((slot) => {
      const date = new Date(slot.date)

      return {
        ...slot,
        date,
        dateFormated: formatDateTime(date),
      }
    })
    // .filter((slot) => slot.date >= today) as CalendarItem[]
})

export const updateCalendar = authActionClient.schema(calendarUpdateInputSchema).action(async ({ parsedInput }) => {
  await redis.set(CALENDAR_KV_KEY, JSON.stringify(parsedInput, null, 2))
})
