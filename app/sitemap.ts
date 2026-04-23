import type { MetadataRoute } from 'next'

import { SITE_IDENTITY } from '@/lib/config/site-config'

import { getCanonicalSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionLikeEnvironment()) {
    return []
  }

  const siteUrl = getCanonicalSiteUrl(SITE_IDENTITY.url)

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      priority: 1,
    },
  ]
}
