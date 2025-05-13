import './globals.css'
import type { Metadata } from 'next'
import { Dancing_Script } from 'next/font/google'

import { NAME } from '@/const'

export const dancingScript = Dancing_Script({
  variable: '--font-dancing-script',
})

export const metadata: Metadata = {
  title: NAME,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='cs'>
      <body className={`${dancingScript.variable} antialiased`}>{children}</body>
    </html>
  )
}
