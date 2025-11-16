import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Dancing_Script } from 'next/font/google'

import { DESCRIPTION, TITLE } from '@/const'
import { BookingProvider } from '@/contexts/BookingContext'

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='cs'>
      <body className={`${dancingScript.variable} antialiased`}>
        <BookingProvider>
          {children}
        </BookingProvider>

        <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} strategy='afterInteractive' />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
