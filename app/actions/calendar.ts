'use server'

import { createClient } from 'redis'
import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/lib/schemas/calendar'

const CALENDAR_KV_KEY = 'calendar'

const redis = await createClient({ url: process.env.REDIS_URL }).connect()

export const getCalendar = actionClient.action(async () => {
  const fileContent = await redis.get(CALENDAR_KV_KEY)
  if (!fileContent) {
    return []
  }
  const parsedContent = JSON.parse(fileContent as string) as any[]

  return parsedContent.map((slot) => ({
    ...slot,
    date: new Date(slot.date),
  }))
})

export const updateCalendar = authActionClient.schema(calendarUpdateInputSchema).action(async ({ parsedInput }) => {
  await redis.set(CALENDAR_KV_KEY, JSON.stringify(parsedInput, null, 2))
})
