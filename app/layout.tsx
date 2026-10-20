import { DM_Sans, Dancing_Script, EB_Garamond } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { BookingProvider } from '@/src/contexts/BookingContext'

import { LOCAL_BUSINESS_JSON_LD, ROOT_METADATA, ROOT_VIEWPORT } from '@/app/site-metadata'

import './globals.css'

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  variable: '--font-display',
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
      <body className={`${dancingScript.variable} ${ebGaramond.variable} ${dmSans.variable} min-h-screen antialiased`}>
        <a
          href='#main-content'
          className='skip-link bg-night focus:ring-brand sr-only absolute top-4 left-4 z-100 rounded-md px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f6edeb] focus:outline-none'
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
