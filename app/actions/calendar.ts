'use server'

import { createClient } from 'redis'

import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/lib/schemas/calendar'

const CALENDAR_KV_KEY = 'calendar'

let redisClient: ReturnType<typeof createClient> | null = null

function shouldUseLocalFallbackCalendar() {
  return !process.env.VERCEL && !process.env.VERCEL_ENV
}

function createLocalFallbackCalendar() {
  const fallbackSlots = [
    { dayOffset: 1, hour: 9, minute: 0, reserved: false },
    { dayOffset: 1, hour: 14, minute: 30, reserved: false },
    { dayOffset: 2, hour: 10, minute: 0, reserved: false },
    { dayOffset: 2, hour: 16, minute: 30, reserved: true },
  ]

  return fallbackSlots.map(({ dayOffset, hour, minute, reserved }) => {
    const date = new Date()
    date.setDate(date.getDate() + dayOffset)
    date.setHours(hour, minute, 0, 0)

    return {
      date,
      reserved,
    }
  })
}

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
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
      return { success: true, data: shouldUseLocalFallbackCalendar() ? createLocalFallbackCalendar() : [] }
    }

    const parsedContent = JSON.parse(fileContent as string) as any[]

    // Map raw data to CalendarSlot format
    // IMPORTANT: Redis stores dates as ISO strings in UTC
    // When converted to Date objects, they remain in UTC but JavaScript will display them in local timezone
    const mappedData = parsedContent
      .map((slot) => {
        const dateValue = slot.date
        let dateObj: Date

        if (typeof dateValue === 'string') {
          // ISO string from Redis (stored in UTC)
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
      })
      .filter(Boolean) // Remove null entries

    return { success: true, data: mappedData }
  } catch (error) {
    console.error('Redis connection error:', error)

    if (shouldUseLocalFallbackCalendar()) {
      return { success: true, data: createLocalFallbackCalendar() }
    }

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
