import { Cormorant_Garamond, DM_Sans, Dancing_Script } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { BookingProvider } from '@/src/contexts/BookingContext'

import { LOCAL_BUSINESS_JSON_LD, ROOT_METADATA, ROOT_VIEWPORT } from '@/app/site-metadata'

import './globals.css'

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-serif-display',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'optional',
})

const dmSans = DM_Sans({
  variable: '--font-sans-display',
  subsets: ['latin'],
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
      <body
        className={`${dancingScript.variable} ${cormorantGaramond.variable} ${dmSans.variable} min-h-screen antialiased`}
      >
        <a
          href='#main-content'
          className='skip-link sr-only absolute top-4 left-4 z-100 rounded-md bg-[#2d1d1a] px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:ring-2 focus:ring-[#ca6f61] focus:ring-offset-2 focus:ring-offset-[#f6edeb] focus:outline-none'
        >
          Přeskočit na hlavní obsah
        </a>

        <BookingProvider>
          <main id='main-content'>{children}</main>
        </BookingProvider>

        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
