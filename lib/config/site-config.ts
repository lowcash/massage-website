export type MassageSiteConfig = {
  readonly site: {
    readonly category: string
    readonly description: string
    readonly keywords: readonly string[]
    readonly language: string
    readonly locale: string
    readonly name: string
    readonly shortName: string
    readonly themeColor: `#${string}`
    readonly title: string
    readonly url: `https://${string}`
  }
  readonly practitioner: {
    readonly description: string
    readonly jobTitle: string
    readonly name: string
  }
  readonly business: {
    readonly address: {
      readonly countryCode: string
      readonly locality: string
      readonly postalCode: string
      readonly streetAddress: string
    }
    readonly areaServedCity: string
    readonly email: string
    readonly geo: {
      readonly latitude: string
      readonly longitude: string
    }
    readonly knowsAbout: readonly string[]
    readonly mapsEmbed: `https://${string}`
    readonly mapsLink: `https://${string}`
    readonly offerCatalogName: string
    readonly openingHours: readonly {
      readonly closes: string
      readonly dayOfWeek: readonly `https://${string}`[]
      readonly opens: string
    }[]
    readonly phoneDisplay: string
    readonly phoneE164: `+${string}`
    readonly priceRange: '$' | '$$' | '$$$'
    readonly socialProfiles: readonly `https://${string}`[]
  }
  readonly manifest: {
    readonly description: string
    readonly name: string
    readonly path: `/${string}`
  }
  readonly openGraphImage: {
    readonly alt: string
    readonly description: string
    readonly eyebrow: string
    readonly headline: string
    readonly path: `/${string}`
    readonly size: {
      readonly width: number
      readonly height: number
    }
  }
}

export const SITE_CONFIG = {
  site: {
    url: 'https://pohlazenipoteleadusi.cz',
    name: 'Pohlazení po těle a duši',
    shortName: 'Pohlazení',
    title: 'Pohlazení po těle a duši | Masáže Hodonín - Mgr. Radka Šebestová',
    description:
      'Profesionální masáže v Hodoníně. Relaxační, sportovní, lymfatické masáže a masáže lávovými kameny. Dotek, který uleví - péče, která obnoví.',
    keywords: [
      'masáže Hodonín',
      'relaxační masáž',
      'sportovní masáž',
      'lymfatická masáž',
      'masáž lávovými kameny',
      'terapeutka Hodonín',
      'Radka Šebestová',
      'wellness Hodonín',
      'masérka Hodonín',
      'léčebné masáže',
    ],
    category: 'health',
    language: 'cs',
    locale: 'cs_CZ',
    themeColor: '#f6edeb',
  },
  practitioner: {
    name: 'Mgr. Radka Šebestová',
    jobTitle: 'Certifikovaná masérka a terapeutka',
    description: 'Profesionální masérka s dlouholetou praxí v oblasti léčebných a relaxačních masáží.',
  },
  business: {
    email: 'sebestovar@seznam.cz',
    phoneDisplay: '(+420) 605 579 643',
    phoneE164: '+420605579643',
    address: {
      streetAddress: 'Národní tř. 383/15',
      locality: 'Hodonín',
      postalCode: '695 01',
      countryCode: 'CZ',
    },
    geo: {
      latitude: '49.0661739',
      longitude: '17.1213106',
    },
    openingHours: [
      {
        dayOfWeek: [
          'https://schema.org/Monday',
          'https://schema.org/Tuesday',
          'https://schema.org/Wednesday',
          'https://schema.org/Thursday',
          'https://schema.org/Friday',
        ],
        opens: '15:00',
        closes: '21:00',
      },
    ],
    areaServedCity: 'Hodonín',
    priceRange: '$$',
    socialProfiles: [
      'https://www.facebook.com/radka6575',
      'https://www.instagram.com/radka.sebestova.5?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    ],
    knowsAbout: [
      'Relaxační masáž',
      'Sportovní masáž',
      'Lymfatická masáž',
      'Terapeutické masáže',
      'Reflexní terapie',
      'Wellness procedury',
    ],
    offerCatalogName: 'Masážní služby',
    mapsLink: 'https://maps.app.goo.gl/AvXgEjyGb2r9R4qT7',
    mapsEmbed: 'https://www.google.com/maps?q=Pohlazení+po+těle+a+duši,+Hodonín&output=embed',
  },
  manifest: {
    path: '/manifest.webmanifest',
    name: 'Pohlazení po těle a duši',
    description: 'Masážní studio v Hodoníně zaměřené na uvolnění, regeneraci a terapeutickou péči.',
  },
  openGraphImage: {
    path: '/opengraph-image',
    size: {
      width: 1200,
      height: 630,
    },
    alt: 'Pohlazení po těle a duši - Masáže Hodonín',
    eyebrow: 'Masáže Hodonín',
    headline: 'Pohlazení po těle a duši',
    description: 'Dotek, který uleví. Péče, která obnoví.',
  },
} as const satisfies MassageSiteConfig

export const SITE_IDENTITY = SITE_CONFIG.site
export const PRACTITIONER = SITE_CONFIG.practitioner
export const BUSINESS = SITE_CONFIG.business
export const APP_MANIFEST = SITE_CONFIG.manifest
export const OPEN_GRAPH_IMAGE = SITE_CONFIG.openGraphImage
