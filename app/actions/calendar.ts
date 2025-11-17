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
      // Return empty array if no data in Redis
      return { success: true, data: [] }
    }
    
    const parsedContent = JSON.parse(fileContent as string) as any[]

    // Map raw data to CalendarSlot format
    const mappedData = parsedContent.map((slot) => ({
      date: typeof slot.date === 'string' ? new Date(slot.date) : slot.date,
      reserved: slot.reserved ?? false,
    }))

    return { success: true, data: mappedData }
  } catch (error) {
    console.error('Redis connection error:', error)
    // Return empty array if Redis is not available
    return { success: false, data: [] }
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
