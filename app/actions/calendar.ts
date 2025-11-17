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
    // IMPORTANT: Redis stores dates as ISO strings, must convert back to Date objects
    const mappedData = parsedContent.map((slot) => {
      const dateValue = slot.date
      let dateObj: Date
      
      if (typeof dateValue === 'string') {
        // ISO string from Redis
        dateObj = new Date(dateValue)
      } else if (dateValue instanceof Date) {
        dateObj = dateValue
      } else if (typeof dateValue === 'number') {
        // Unix timestamp
        dateObj = new Date(dateValue)
      } else {
        console.error('Invalid date format in Redis:', dateValue)
        return null
      }
      
      // Validate date is valid
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date after parsing:', dateValue)
        return null
      }
      
      return {
        date: dateObj,
        reserved: slot.reserved ?? false,
      }
    }).filter(Boolean) // Remove null entries

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
