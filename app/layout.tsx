import { DM_Sans, Dancing_Script, Fraunces } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { RevealFallback } from '@/src/components/shared/RevealFallback'
import { BookingProvider } from '@/src/contexts/BookingContext'

import { LOCAL_BUSINESS_JSON_LD, ROOT_METADATA, ROOT_VIEWPORT } from '@/app/site-metadata'

import './globals.css'

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  weight: '500',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const fraunces = Fraunces({
  variable: '--font-display',
  axes: ['opsz', 'SOFT'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-sans-display',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const viewport = ROOT_VIEWPORT

export const metadata = ROOT_METADATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const enableVercelAnalytics = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL)

  return (
    <html lang='cs'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
      </head>
      <body className={`${dancingScript.variable} ${fraunces.variable} ${dmSans.variable} min-h-screen antialiased`}>
        <a
          href='#main-content'
          className='skip-link bg-night focus:ring-brand focus:ring-offset-skip-offset sr-only absolute top-4 left-4 z-100 rounded-full px-5 py-2.5 text-sm font-medium text-white focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:outline-none'
        >
          Přeskočit na hlavní obsah
        </a>

        <BookingProvider>{children}</BookingProvider>

        <RevealFallback />

        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
