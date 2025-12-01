'use client'

import { useState } from 'react'
import { useCalendarManager } from '@/src/components/features/admin/hooks/useCalendarManager'
import { CalendarForm } from '@/src/components/features/admin/CalendarForm'
import { CalendarList } from '@/src/components/features/admin/CalendarList'
import { Button } from '@/src/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { type CalendarItem } from '@/types/calendar'
import { Trash2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/utils'

interface DateTimeSelectorProps {
  data: CalendarItem[]
}

export default function DateTimeSelector({ data }: DateTimeSelectorProps) {
  const { list, selectedIndex, setSelectedIndex, isLoading, handleAdd, handleRemove, handleToggleReserved, handleUpdate } =
    useCalendarManager(data)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleAddWithToast = async (dateStr: string, timeStr: string) => {
    const result = await handleAdd(dateStr, timeStr)
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} úspěšně přidán`, {
        icon: <PlusCircle className='h-5 w-5' />,
      })
    }
  }

  const handleUpdateWithToast = async (dateStr: string, timeStr: string) => {
    const result = await handleUpdate(dateStr, timeStr)
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} úspěšně aktualizován`, {
        icon: <PlusCircle className='h-5 w-5' />,
      })
      // Keep selection on the updated item for further editing
      if (result.newIndex !== undefined) {
        setSelectedIndex(result.newIndex)
      }
    } else if (result?.conflict) {
      toast.error('Tento termín již existuje')
    } else if (result && !result.success) {
      toast.error('Nepodařilo se aktualizovat termín')
    }
  }

  const handleRemoveWithToast = async () => {
    const result = await handleRemove()
    if (result?.success && result.date) {
      toast.success(`Termín ${formatDateTime(result.date)} odstraněn`, {
        icon: <Trash2 className='h-5 w-5' />,
      })
    }
    setShowDeleteDialog(false)
  }

  const selectedDate = selectedIndex !== null ? list[selectedIndex]?.date : null
  const selectedItem = selectedIndex !== null ? list[selectedIndex] : null

  return (
    <div className='flex h-full w-full flex-col gap-4 rounded-lg border bg-white/90 backdrop-blur-sm p-6 shadow-lg overflow-hidden'>
      {/* Action buttons - sticky header */}
      {selectedIndex !== null && (
        <div className='flex gap-2 pb-4 border-b border-zinc-200 flex-shrink-0'>
          <Button 
            onClick={() => setShowDeleteDialog(true)} 
            disabled={isLoading} 
            variant='destructive' 
            className='flex-1 gap-2'
          >
            <Trash2 className='h-4 w-4' />
            Smazat vybraný termín
          </Button>
          <Button onClick={() => setSelectedIndex(null)} variant='outline' className='flex-1'>
            Zrušit výběr
          </Button>
        </div>
      )}

      {/* Form section */}
      <div className='space-y-4 flex-shrink-0'>
        <h2 className='text-lg font-semibold text-zinc-900'>Správa dostupných termínů</h2>
        <CalendarForm onAdd={handleAddWithToast} onUpdate={handleUpdateWithToast} isLoading={isLoading} selectedDate={selectedDate} />
      </div>

      {/* Scrollable calendar list */}
      <div className='flex-1 overflow-hidden flex flex-col min-h-0'>
        <CalendarList items={list} selectedIndex={selectedIndex} onSelect={setSelectedIndex} onToggleReserved={handleToggleReserved} />
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tento termín?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItem && (
                <span className='block mt-2 font-semibold text-zinc-900'>
                  {formatDateTime(selectedItem.date)}
                  {selectedItem.reserved && <span className='ml-2 text-red-600'>(Rezervováno)</span>}
                </span>
              )}
              <span className='block mt-2'>
                Tato akce je nevratná. Termín bude trvale odstraněn z databáze.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveWithToast} disabled={isLoading}>
              Smazat termín
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
