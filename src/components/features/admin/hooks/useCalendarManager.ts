'use client'

import { useEffect, useState } from 'react'

import { updateCalendar } from '@/app/actions/calendar'

import type { CalendarItem } from '@/types/calendar'

import { combineDateTime, filterFutureCalendarItems, isDateTimeInFuture, sortCalendarList } from '../utils/calendar'

export function useCalendarManager(initialData: CalendarItem[]) {
  const [list, setList] = useState<CalendarItem[]>(sortCalendarList(initialData))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setList(sortCalendarList(initialData))
  }, [initialData])

  const handleAdd = async (dateStr: string, timeStr: string) => {
    const selected = combineDateTime(dateStr, timeStr)
    if (!selected || !isDateTimeInFuture(selected)) {
      return
    }

    if (!list.some((dt) => dt.date.getTime() === selected.getTime())) {
      const updatedList = [...list, { date: selected, reserved: false }]
      const futureList = filterFutureCalendarItems(updatedList)
      const newList = sortCalendarList(futureList)
      setList(newList)
      setIsLoading(true)
      try {
        await updateCalendar(newList)
      } finally {
        setIsLoading(false)
      }

      return { success: true, date: selected }
    }

    return { success: false }
  }

  const handleRemove = async () => {
    if (selectedIndex !== null && list[selectedIndex]) {
      const removedItem = list[selectedIndex]
      const newList = list.filter((_, idx) => idx !== selectedIndex)
      setList(newList)
      setSelectedIndex(null)
      setIsLoading(true)
      try {
        await updateCalendar(newList)
        return { success: true, date: removedItem.date }
      } finally {
        setIsLoading(false)
      }
    }

    return { success: false }
  }

  const handleToggleReserved = async (idx: number) => {
    const newList = sortCalendarList(list.map((item, i) => (i === idx ? { ...item, reserved: !item.reserved } : item)))
    setList(newList)
    setIsLoading(true)
    try {
      await updateCalendar(newList)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (dateStr: string, timeStr: string) => {
    if (selectedIndex === null) {
      return { success: false }
    }

    const newDate = combineDateTime(dateStr, timeStr)
    if (!newDate) {
      return { success: false }
    }

    if (list.some((item, idx) => idx !== selectedIndex && item.date.getTime() === newDate.getTime())) {
      return { success: false, conflict: true }
    }

    const oldItem = list[selectedIndex]
    const newList = list.map((item, idx) => (idx === selectedIndex ? { ...item, date: newDate } : item))
    const sortedList = sortCalendarList(newList)
    setList(sortedList)

    const newIndex = sortedList.findIndex(
      (item) => item.date.getTime() === newDate.getTime() && item.reserved === oldItem.reserved,
    )

    setIsLoading(true)
    try {
      await updateCalendar(sortedList)
      return { success: true, date: newDate, newIndex }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    list,
    selectedIndex,
    setSelectedIndex,
    isLoading,
    handleAdd,
    handleRemove,
    handleToggleReserved,
    handleUpdate,
  }
}
