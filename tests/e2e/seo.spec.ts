import { expect, test } from '@playwright/test'

test.describe('SEO outputs', () => {
  test('homepage exposes canonical, social and LocalBusiness metadata', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pohlazenipoteleadusi.cz')
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /https:\/\/pohlazenipoteleadusi\.cz\/opengraph-image(\?.+)?$/,
    )
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')

    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '{}')
    expect(jsonLd['@type']).toBe('LocalBusiness')
    expect(jsonLd.url).toBe('https://pohlazenipoteleadusi.cz')
    expect(jsonLd.address.addressLocality).toBe('Hodonín')
    expect(jsonLd.hasOfferCatalog.itemListElement.length).toBeGreaterThanOrEqual(5)
  })

  test('robots.txt and sitemap.xml resolve for production-like environment', async ({ request }) => {
    const robotsResponse = await request.get('/robots.txt')
    expect(robotsResponse.ok()).toBe(true)
    expect(await robotsResponse.text()).toContain('Sitemap: https://pohlazenipoteleadusi.cz/sitemap.xml')

    const sitemapResponse = await request.get('/sitemap.xml')
    expect(sitemapResponse.ok()).toBe(true)
    const sitemapBody = await sitemapResponse.text()
    expect(sitemapBody).toContain('<loc>https://pohlazenipoteleadusi.cz</loc>')
    expect(sitemapBody).not.toContain('changefreq')
  })

  test('manifest, Seznam verification and generated og image routes are served', async ({ request }) => {
    const manifestResponse = await request.get('/manifest.webmanifest')
    expect(manifestResponse.ok()).toBe(true)

    const manifest = await manifestResponse.json()
    expect(manifest.name).toBe('Pohlazení po těle a duši')
    expect(manifest.theme_color).toBe('#f6edeb')

    const seznamResponse = await request.get('/seznam-wmt-k9RUaFLb80EExx1s2FX1SG2L1BYHtHn8.txt')
    expect(seznamResponse.ok()).toBe(true)
    expect(await seznamResponse.text()).toBe('k9RUaFLb80EExx1s2FX1SG2L1BYHtHn8')

    const imageResponse = await request.get('/opengraph-image')
    expect(imageResponse.ok()).toBe(true)
    expect(imageResponse.headers()['content-type']).toContain('image/png')
  })
})
