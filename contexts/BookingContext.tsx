'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BookingContextType {
  selectedService: string | null
  setSelectedService: (service: string | null) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  return (
    <BookingContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
