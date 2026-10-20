'use client'

import { useEffect, useState } from 'react'

import { updateCalendar } from '@/app/actions/calendar'

import type { CalendarItem } from '@/types/calendar'

import { combineDateTime, filterFutureCalendarItems, isDateTimeInFuture, sortCalendarList } from '../utils/calendar'

/** The server action reports failures in its result instead of throwing, so check both. */
async function saveCalendar(items: CalendarItem[]) {
  try {
    const result = await updateCalendar(items)
    return !result?.serverError && !result?.validationErrors
  } catch {
    return false
  }
}

export function useCalendarManager(initialData: CalendarItem[]) {
  const [list, setList] = useState<CalendarItem[]>(sortCalendarList(initialData))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setList(sortCalendarList(initialData))
  }, [initialData])

  /** Optimistic update: show the change now, put the previous list back if saving fails. */
  const commit = async (nextList: CalendarItem[]) => {
    const previousList = list
    setList(nextList)
    setIsLoading(true)

    try {
      const saved = await saveCalendar(nextList)

      if (!saved) {
        setList(previousList)
      }

      return saved
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (dateStr: string, timeStr: string) => {
    const selected = combineDateTime(dateStr, timeStr)
    if (!selected || !isDateTimeInFuture(selected)) {
      return
    }

    if (!list.some((dt) => dt.date.getTime() === selected.getTime())) {
      const updatedList = [...list, { date: selected, reserved: false }]
      const futureList = filterFutureCalendarItems(updatedList)
      const newList = sortCalendarList(futureList)

      const previousList = list

      if (!(await commit(newList))) {
        return { success: false, saveFailed: true }
      }

      return { success: true, date: selected, previousList }
    }

    return { success: false }
  }

  const handleRemoveAt = async (index: number) => {
    const removedItem = list[index]
    if (!removedItem) {
      return { success: false }
    }

    const previousList = list

    if (!(await commit(list.filter((_, idx) => idx !== index)))) {
      return { success: false, saveFailed: true }
    }

    return { success: true, date: removedItem.date, previousList }
  }

  const handleToggleReserved = async (idx: number) => {
    const newList = sortCalendarList(list.map((item, i) => (i === idx ? { ...item, reserved: !item.reserved } : item)))

    const previousList = list

    if (!(await commit(newList))) {
      return { success: false, saveFailed: true }
    }

    return { success: true, date: list[idx].date, reserved: !list[idx].reserved, previousList }
  }

  /** Puts back an earlier list (the "undo" of the last change) and saves it like any other change. */
  const handleRestore = async (previousList: CalendarItem[]) => {
    return commit(previousList)
  }

  return {
    list,
    isLoading,
    handleAdd,
    handleRemoveAt,
    handleToggleReserved,
    handleRestore,
  }
}
