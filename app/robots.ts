import type { MetadataRoute } from 'next'

import { SITE_IDENTITY } from '@/lib/config/site-config'

import { getCanonicalSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function robots(): MetadataRoute.Robots {
  const isProductionLike = isProductionLikeEnvironment()
  const siteUrl = getCanonicalSiteUrl(SITE_IDENTITY.url)

  return {
    rules: isProductionLike
      ? {
          userAgent: '*',
          allow: '/',
          disallow: '/admin',
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
