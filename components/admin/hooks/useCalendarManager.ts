import { useCallback, useState } from 'react'
import { CalendarItem } from '@/types/calendar'
import { updateCalendar } from '@/app/actions/calendar'
import { sortCalendarList, combineDateTime, isDateTimeInFuture } from '../utils/calendar'

export function useCalendarManager(initialData: CalendarItem[]) {
  const [list, setList] = useState<CalendarItem[]>(initialData)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = useCallback(
    async (dateStr: string, timeStr: string) => {
      const selected = combineDateTime(dateStr, timeStr)
      if (!selected || !isDateTimeInFuture(selected)) return

      if (!list.some((dt) => dt.date.getTime() === selected.getTime())) {
        const newList = sortCalendarList([...list, { date: selected, reserved: false }])
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
    },
    [list],
  )

  const handleRemove = useCallback(async () => {
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
  }, [selectedIndex, list])

  const handleToggleReserved = useCallback(
    async (idx: number) => {
      const newList = list.map((item, i) => (i === idx ? { ...item, reserved: !item.reserved } : item))
      setList(newList)
      setIsLoading(true)
      try {
        await updateCalendar(newList)
      } finally {
        setIsLoading(false)
      }
    },
    [list],
  )

  return {
    list,
    selectedIndex,
    setSelectedIndex,
    isLoading,
    handleAdd,
    handleRemove,
    handleToggleReserved,
  }
}
