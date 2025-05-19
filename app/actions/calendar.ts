'use server'

import { createClient } from 'redis'
import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/app/actions/calendar.schema'

const CALENDAR_KV_KEY = 'calendar'

async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL })
  await client.connect()
  return client
}

export const getCalendar = actionClient.action(async () => {
  const redis = await getRedisClient()
  const fileContent = await redis.get(CALENDAR_KV_KEY)
  await redis.disconnect()
  if (!fileContent) {
    return []
  }
  const parsedContent = JSON.parse(fileContent as string) as any[]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return parsedContent
    .map((slot) => ({
      ...slot,
      date: new Date(slot.date),
    }))
    .filter((slot) => slot.date >= today)
})

export const updateCalendar = authActionClient.schema(calendarUpdateInputSchema).action(async ({ parsedInput }) => {
  const redis = await getRedisClient()
  await redis.set(CALENDAR_KV_KEY, JSON.stringify(parsedInput, null, 2))
  await redis.disconnect()
})