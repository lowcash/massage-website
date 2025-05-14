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
      <head>
        <script async src='https://www.googletagmanager.com/gtag/js?id=G-BJWHB0F4BE'></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-BJWHB0F4BE');
            `,
          }}
        />
      </head>
      <body className={`${dancingScript.variable} antialiased`}>{children}</body>
    </html>
  )
}
