'use server'

import fs from 'fs/promises'
import path from 'path'
import { actionClient, authActionClient } from '@/lib/safe-action'
import { calendarUpdateInputSchema } from '@/app/actions/calendar.schema'

const calendarFilePath = path.join(process.cwd(), 'data/calendar.json')

export const getCalendar = actionClient.action(async () => {
  const fileContent = await fs.readFile(calendarFilePath, 'utf-8')
  const parsedContent = JSON.parse(fileContent) as any[]

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
  await fs.writeFile(calendarFilePath, JSON.stringify(parsedInput, null, 2), 'utf-8')
})
