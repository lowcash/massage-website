'use server'

import { createClient } from 'redis'
import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/lib/schemas/calendar'

const CALENDAR_KV_KEY = 'calendar'

let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ 
      url: process.env.REDIS_URL || 'redis://localhost:6379' 
    })
    await redisClient.connect()
  }
  return redisClient
}

export const getCalendar = actionClient.action(async () => {
  try {
    const redis = await getRedisClient()
    const fileContent = await redis.get(CALENDAR_KV_KEY)
    if (!fileContent) {
      return []
    }
    const parsedContent = JSON.parse(fileContent as string) as any[]

    return parsedContent.map((slot) => ({
      ...slot,
      date: new Date(slot.date),
    }))
  } catch (error) {
    console.error('Redis connection error:', error)
    // Return empty array if Redis is not available
    return []
  }
})

export const updateCalendar = authActionClient.schema(calendarUpdateInputSchema).action(async ({ parsedInput }) => {
  try {
    const redis = await getRedisClient()
    await redis.set(CALENDAR_KV_KEY, JSON.stringify(parsedInput, null, 2))
  } catch (error) {
    console.error('Redis connection error:', error)
    throw new Error('Failed to update calendar. Redis connection unavailable.')
  }
})
