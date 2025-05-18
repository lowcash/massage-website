import { z } from 'zod'

export const calendarUpdateItemSchema = z.object({
  date: z.date(),
  available: z.boolean(),
})

export type CalendarUpdateItem = z.infer<typeof calendarUpdateItemSchema>

export const calendarUpdateInputSchema = z.array(calendarUpdateItemSchema)
