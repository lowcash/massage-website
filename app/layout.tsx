import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Dancing_Script } from 'next/font/google'

import { DESCRIPTION, TITLE } from '@/const'

const dancingScript = Dancing_Script({
  variable: '--font-dancing-script',
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
        {children}

        <Script src='https://www.googletagmanager.com/gtag/js?id=G-BJWHB0F4BE' strategy='afterInteractive' />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BJWHB0F4BE');
          `}
        </Script>
      </body>
    </html>
  )
}
