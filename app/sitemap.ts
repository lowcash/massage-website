import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/config/site-metadata'

import { getProductionSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionLikeEnvironment()) {
    return []
  }

  const siteUrl = getProductionSiteUrl(SITE_URL)

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
