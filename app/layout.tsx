import './globals.css'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Dancing_Script, Montserrat } from 'next/font/google'

import { NAME } from '@/config'

export const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  weight: ['400', '500', '600'],
})

export const dancingScript = Dancing_Script({
  variable: '--font-dancing-script',
})

export const montserrat = Montserrat({
  variable: '--font-montserrat',
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
      <body className={`${cormorantGaramond.variable} ${dancingScript.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
