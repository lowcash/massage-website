import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from 'next/font/google'
import Script from 'next/script'

import { Analytics } from '@vercel/analytics/next'

import {
  DESCRIPTION,
  EMAIL,
  FACEBOOK,
  INSTAGRAM,
  KEYWORDS,
  SITE_URL,
  THERAPIST_NAME,
  TITLE,
} from '@/lib/config/site-metadata'
import { siteContent } from '@/lib/content'

import { BookingProvider } from '@/src/contexts/BookingContext'

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

export const viewport: Viewport = {
  themeColor: '#f6edeb',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: THERAPIST_NAME }],
  creator: THERAPIST_NAME,
  publisher: THERAPIST_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Pohlazení po těle a duši',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Pohlazení po těle a duši - Masáže Hodonín',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'wp5Ozmpn2DAK-Ll6d0LZ8Id2qPc3cTJUTKpPpOZGCuE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  const enableVercelAnalytics = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL)

  const serviceCatalogItems = siteContent.services.items.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
    },
  }))

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Pohlazení po těle a duši',
    description: DESCRIPTION,
    url: SITE_URL,
    telephone: '+420605579643',
    email: EMAIL,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Národní tř. 383/15',
      addressLocality: 'Hodonín',
      postalCode: '695 01',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '49.0661739',
      longitude: '17.1213106',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '15:00',
        closes: '21:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Masážní služby',
      itemListElement: serviceCatalogItems,
    },
    employee: {
      '@type': 'Person',
      name: THERAPIST_NAME,
      jobTitle: 'Certifikovaná masérka a terapeutka',
      description: 'Profesionální masérka s dlouholetou praxí v oblasti léčebných a relaxačních masáží.',
    },
    areaServed: {
      '@type': 'City',
      name: 'Hodonín',
    },
    sameAs: [FACEBOOK, INSTAGRAM],
    knowsAbout: [
      'Relaxační masáž',
      'Sportovní masáž',
      'Lymfatická masáž',
      'Terapeutické masáže',
      'Reflexní terapie',
      'Wellness procedury',
    ],
  }

  return (
    <html lang='cs'>
      <head>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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

        {gaTrackingId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} strategy='lazyOnload' />
            <Script id='gtag-init' strategy='lazyOnload'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}');
              `}
            </Script>
          </>
        ) : null}

        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
