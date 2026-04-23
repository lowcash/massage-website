import type { Metadata, MetadataRoute, Viewport } from 'next'

import type { LocalBusiness, Offer, WithContext } from 'schema-dts'

import { APP_MANIFEST, BUSINESS, OPEN_GRAPH_IMAGE, PRACTITIONER, SITE_IDENTITY } from '@/lib/config/site-config'
import { siteContent } from '@/lib/content'

const SERVICE_CATALOG_ITEMS: Offer[] = siteContent.services.items.map((service) => ({
  '@type': 'Offer',
  itemOffered: {
    '@type': 'Service',
    name: service.name,
    description: service.description,
  },
}))

export const ROOT_VIEWPORT: Viewport = {
  themeColor: SITE_IDENTITY.themeColor,
  viewportFit: 'cover',
}

export const ROOT_OPEN_GRAPH = {
  type: 'website',
  locale: SITE_IDENTITY.locale,
  url: SITE_IDENTITY.url,
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  siteName: SITE_IDENTITY.name,
  images: [
    {
      url: OPEN_GRAPH_IMAGE.path,
      width: OPEN_GRAPH_IMAGE.size.width,
      height: OPEN_GRAPH_IMAGE.size.height,
      alt: OPEN_GRAPH_IMAGE.alt,
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>

export const ROOT_TWITTER = {
  card: 'summary_large_image',
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  images: [OPEN_GRAPH_IMAGE.path],
} satisfies NonNullable<Metadata['twitter']>

export const ROOT_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
} satisfies NonNullable<Metadata['robots']>

export const ROOT_APPLE_WEB_APP = {
  title: SITE_IDENTITY.shortName,
  capable: true,
  statusBarStyle: 'default',
} satisfies NonNullable<Metadata['appleWebApp']>

export const ROOT_METADATA: Metadata = {
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  keywords: [...SITE_IDENTITY.keywords],
  authors: [{ name: PRACTITIONER.name }],
  creator: PRACTITIONER.name,
  publisher: PRACTITIONER.name,
  applicationName: SITE_IDENTITY.name,
  category: SITE_IDENTITY.category,
  metadataBase: new URL(SITE_IDENTITY.url),
  manifest: APP_MANIFEST.path,
  alternates: {
    canonical: '/',
  },
  openGraph: ROOT_OPEN_GRAPH,
  twitter: ROOT_TWITTER,
  robots: ROOT_ROBOTS,
  appleWebApp: ROOT_APPLE_WEB_APP,
}

export const LOCAL_BUSINESS_JSON_LD: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_IDENTITY.url}/#business`,
  name: SITE_IDENTITY.name,
  description: SITE_IDENTITY.description,
  url: SITE_IDENTITY.url,
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  priceRange: BUSINESS.priceRange,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.locality,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.countryCode,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.geo.latitude,
    longitude: BUSINESS.geo.longitude,
  },
  openingHoursSpecification: BUSINESS.openingHours.map((openingHours) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [...openingHours.dayOfWeek],
    opens: openingHours.opens,
    closes: openingHours.closes,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: BUSINESS.offerCatalogName,
    itemListElement: SERVICE_CATALOG_ITEMS,
  },
  employee: {
    '@type': 'Person',
    name: PRACTITIONER.name,
    jobTitle: PRACTITIONER.jobTitle,
    description: PRACTITIONER.description,
  },
  areaServed: {
    '@type': 'City',
    name: BUSINESS.areaServedCity,
  },
  sameAs: [...BUSINESS.socialProfiles],
  knowsAbout: [...BUSINESS.knowsAbout],
}

export const MANIFEST_METADATA: MetadataRoute.Manifest = {
  name: APP_MANIFEST.name,
  short_name: SITE_IDENTITY.shortName,
  description: APP_MANIFEST.description,
  start_url: '/',
  display: 'standalone',
  background_color: SITE_IDENTITY.themeColor,
  theme_color: SITE_IDENTITY.themeColor,
  lang: SITE_IDENTITY.language,
  icons: [
    {
      src: '/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any',
    },
  ],
}
