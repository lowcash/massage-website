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
 * On very wide screens the floating elements sit in the same centered column as the page (84rem = 1344px) instead of
 * sticking to the far window edges.
 */
test.describe('Floating elements on wide screens', () => {
  const COLUMN = 1344

  for (const width of [1440, 1920, 2560]) {
    test(`stay inside the centered column at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
      await page.waitForTimeout(500)

      const columnLeft = (width - COLUMN) / 2
      const columnRight = columnLeft + COLUMN
      const tolerance = 2

      const whatsapp = await page.getByRole('link', { name: 'Kontaktujte nás na WhatsApp' }).boundingBox()
      const scrollTop = await page.getByRole('button', { name: 'Zpět nahoru' }).boundingBox()
      const dots = await page.locator('nav[aria-hidden="true"]').last().boundingBox()

      expect(whatsapp!.x).toBeGreaterThanOrEqual(columnLeft - tolerance)
      expect(whatsapp!.x).toBeLessThanOrEqual(columnLeft + 60)
      expect(scrollTop!.x + scrollTop!.width).toBeLessThanOrEqual(columnRight + tolerance)
      expect(scrollTop!.x + scrollTop!.width).toBeGreaterThanOrEqual(columnRight - 60)
      expect(dots!.x + dots!.width).toBeLessThanOrEqual(columnRight + tolerance)
      expect(dots!.x + dots!.width).toBeGreaterThanOrEqual(columnRight - 60)
    })
  }
})
