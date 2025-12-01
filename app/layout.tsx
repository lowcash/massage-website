import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Dancing_Script } from 'next/font/google'

import { 
  DESCRIPTION, 
  TITLE, 
  KEYWORDS, 
  SITE_URL, 
  THERAPIST_NAME,
  EMAIL,
  FACEBOOK,
  INSTAGRAM
} from '@/const'
import { BookingProvider } from '@/src/contexts/BookingContext'

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
})

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
        url: '/og-image.png',
        width: 1720,
        height: 782,
        alt: 'Pohlazení po těle a duši - Masáže Hodonín',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
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
  // JSON-LD strukturovaná data pro Google (LocalBusiness schema)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    "name": "Pohlazení po těle a duši",
    "description": DESCRIPTION,
    "url": SITE_URL,
    "telephone": "+420605579643",
    "email": EMAIL,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Národní tř. 383/15",
      "addressLocality": "Hodonín",
      "postalCode": "695 01",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "49.0661739",
      "longitude": "17.1213106"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "15:00",
        "closes": "21:00"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Masážní služby",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ošetření spoušťových bodů",
            "description": "Terapeutická technika zaměřená na uvolnění svalových uzlů"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Thajská masáž nohou",
            "description": "Tradiční technika kombinující akupresuru a protahování"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Deep tissue massage",
            "description": "Hloubková masáž zaměřená na chronické napětí"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Těhotenská masáž",
            "description": "Jemná masáž pro těhotné ženy"
          }
        }
      ]
    },
    "employee": {
      "@type": "Person",
      "name": THERAPIST_NAME,
      "jobTitle": "Certifikovaná masérka a terapeutka",
      "description": "Profesionální masérka s dlouholetou praxí v oblasti léčebných a relaxačních masáží."
    },
    "areaServed": {
      "@type": "City",
      "name": "Hodonín"
    },
    "sameAs": [
      FACEBOOK,
      INSTAGRAM
    ],
    "knowsAbout": [
      "Relaxační masáž",
      "Sportovní masáž",
      "Lymfatická masáž",
      "Terapeutické masáže",
      "Reflexní terapie",
      "Wellness procedury"
    ]
  };

  return (
    <html lang='cs'>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${dancingScript.variable} antialiased min-h-screen`}>
        <BookingProvider>
          {children}
        </BookingProvider>

        {/* Google Analytics */}
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
