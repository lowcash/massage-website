import { expect, test } from '@playwright/test'

/**
 * Floating button tests — ScrollToTop and WhatsApp button visibility behaviour.
 * Run against a live dev server: pnpm run dev
 */

test.describe('ScrollToTop button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('is hidden on initial load (no scroll)', async ({ page }) => {
    // Playwright counts opacity:0 as visible, so check the functional hide state:
    // when hidden, we set tabIndex=-1 to remove it from keyboard navigation
    const btn = page.getByRole('button', { name: 'Zpět nahoru' })
    await expect(btn).toHaveAttribute('tabindex', '-1')
  })

  test('appears after scrolling 320px down', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    await page.waitForTimeout(400)

    const btn = page.getByRole('button', { name: 'Zpět nahoru' })
    await expect(btn).toBeVisible()
  })

  test('scrolls back to top when clicked', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
    await page.waitForTimeout(400)

    const btn = page.getByRole('button', { name: 'Zpět nahoru' })
    await expect(btn).toBeVisible()
    await btn.click()
    await page.waitForTimeout(800)

    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })
})

test.describe('WhatsApp button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('WhatsApp link is present and has correct href', async ({ page }) => {
    // Use aria-label to target only the floating WhatsApp button (not inline links)
    const waLink = page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' })
    await expect(waLink).toHaveCount(1)
    const href = await waLink.getAttribute('href')
    expect(href).toMatch(/wa\.me\/\d+/)
  })

  test('WhatsApp link opens in new tab', async ({ page }) => {
    const waLink = page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' })
    await expect(waLink).toHaveAttribute('target', '_blank')
    await expect(waLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('WhatsApp button is visible mid-page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    await page.waitForTimeout(300)

    const waLink = page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' })
    await expect(waLink).toBeVisible()
  })
})

/**
 * On wide screens floating chrome shares the nav/footer content column (max-w-6xl = 1152px).
 * Section body content is inset separately (CONTENT_SHELL px-2 md:px-6). Dots share ScrollToTop's center.
 */
test.describe('Floating elements on wide screens', () => {
  const CONTENT_COLUMN = 1152

  for (const width of [1440, 1920, 2560]) {
    test(`align with the nav content column at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
      await page.waitForTimeout(500)

      const contentLeft = (width - CONTENT_COLUMN) / 2
      const contentRight = contentLeft + CONTENT_COLUMN
      const tolerance = 2

      const whatsapp = await page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' }).boundingBox()
      const scrollTop = await page.getByRole('button', { name: 'Zpět nahoru' }).boundingBox()
      const dots = await page.locator('nav[aria-hidden="true"]').last().boundingBox()

      expect(whatsapp!.x).toBeGreaterThanOrEqual(contentLeft - tolerance)
      expect(whatsapp!.x).toBeLessThanOrEqual(contentLeft + 60)

      expect(scrollTop!.x + scrollTop!.width).toBeLessThanOrEqual(contentRight + tolerance)
      expect(scrollTop!.x + scrollTop!.width).toBeGreaterThanOrEqual(contentRight - 60)

      const scrollCenter = scrollTop!.x + scrollTop!.width / 2
      const dotsCenter = dots!.x + dots!.width / 2
      expect(Math.abs(dotsCenter - scrollCenter)).toBeLessThanOrEqual(tolerance)
    })
  }

  test('hides WhatsApp, scroll-up and section dots when footer is in view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('footer').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    const waLink = page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' })
    const scrollTop = page.getByRole('button', { name: 'Zpět nahoru' })
    const dots = page.locator('nav[aria-hidden="true"]').last()

    await expect(waLink).toHaveAttribute('tabindex', '-1')
    await expect(scrollTop).toHaveAttribute('tabindex', '-1')
    await expect(dots).toHaveClass(/opacity-0/)
  })
})
