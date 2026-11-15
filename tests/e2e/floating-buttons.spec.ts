import { expect, test } from '@playwright/test'

/**
 * Floating button tests — ScrollToTop and WhatsApp button visibility behaviour.
 * Run against a live dev server: pnpm run dev
 */

async function scrollPastHero(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const hero = document.getElementById('hero')
    const y = hero ? hero.offsetTop + hero.offsetHeight + 24 : 800
    window.scrollTo(0, y)
  })
  await expect
    .poll(async () => page.evaluate(() => document.getElementById('hero')?.getBoundingClientRect().bottom ?? 0))
    .toBeLessThanOrEqual(0)
}

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

  test('appears after scrolling past the hero', async ({ page }) => {
    await scrollPastHero(page)

    const btn = page.getByRole('button', { name: 'Zpět nahoru' })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute('tabindex', '0')
  })

  test('scrolls back to top when clicked', async ({ page }) => {
    await scrollPastHero(page)

    const btn = page.getByRole('button', { name: 'Zpět nahoru' })
    await expect(btn).toBeVisible()
    await btn.click()
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(100)
  })
})

test.describe('WhatsApp button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('WhatsApp link is present and has correct href', async ({ page }) => {
    // Use aria-label to target only the floating WhatsApp button (not inline links)
    const waLink = page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' })
    await expect(waLink).toHaveCount(1)
    const href = await waLink.getAttribute('href')
    expect(href).toMatch(/wa\.me\/\d+/)
  })

  test('WhatsApp link opens in new tab', async ({ page }) => {
    const waLink = page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' })
    await expect(waLink).toHaveAttribute('target', '_blank')
    await expect(waLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('WhatsApp button is visible mid-page after the hero', async ({ page }) => {
    await scrollPastHero(page)

    const waLink = page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' })
    await expect(waLink).toBeVisible()
    await expect(waLink).toHaveAttribute('tabindex', '0')
  })

  test('on mobile, WhatsApp stays hidden while the hero is in view', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'mobile-only hero deferral')

    const waLink = page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' })
    await expect(waLink).toHaveAttribute('tabindex', '-1')

    const bookingCta = page.locator('#hero a[href="#booking"]')
    await expect(bookingCta).toBeVisible()

    // Even after a short scroll that leaves CTAs on screen, the FAB must stay deferred.
    await page.evaluate(() => window.scrollTo(0, 180))
    await expect(waLink).toHaveAttribute('tabindex', '-1')

    const overlap = await page.evaluate(() => {
      const fab = document.querySelector<HTMLElement>('a[aria-label="Kontaktujte mě na WhatsApp"]')
      const cta = document.querySelector<HTMLElement>('#hero a[href="#booking"]')
      if (!fab || !cta) return true
      const a = fab.getBoundingClientRect()
      const b = cta.getBoundingClientRect()
      const fabActive = getComputedStyle(fab).opacity !== '0' && fab.tabIndex >= 0
      if (!fabActive) return false
      return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
    })
    expect(overlap).toBe(false)
  })
})

/**
 * On wide screens floating chrome shares the nav/footer content column (max-w-6xl = 1152px).
 * Section body content is inset separately (CONTENT_SHELL px-2 md:px-6). Dots share ScrollToTop's center.
 * WhatsApp and ScrollToTop both sit on the trailing edge (bottom-right stack).
 */
test.describe('Floating elements on wide screens', () => {
  const CONTENT_COLUMN = 1152

  for (const width of [1440, 1920, 2560]) {
    test(`align with the nav content column at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await scrollPastHero(page)

      const contentLeft = (width - CONTENT_COLUMN) / 2
      const contentRight = contentLeft + CONTENT_COLUMN
      const tolerance = 2

      const whatsapp = await page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' }).boundingBox()
      const scrollTop = await page.getByRole('button', { name: 'Zpět nahoru' }).boundingBox()
      const dots = await page.locator('nav[aria-hidden="true"]').last().boundingBox()

      expect(whatsapp!.x + whatsapp!.width).toBeLessThanOrEqual(contentRight + tolerance)
      expect(whatsapp!.x + whatsapp!.width).toBeGreaterThanOrEqual(contentRight - 60)

      expect(scrollTop!.x + scrollTop!.width).toBeLessThanOrEqual(contentRight + tolerance)
      expect(scrollTop!.x + scrollTop!.width).toBeGreaterThanOrEqual(contentRight - 60)

      const scrollCenter = scrollTop!.x + scrollTop!.width / 2
      const dotsCenter = dots!.x + dots!.width / 2
      expect(Math.abs(dotsCenter - scrollCenter)).toBeLessThanOrEqual(tolerance)

      // Stacked: scroll-up sits above WhatsApp
      expect(scrollTop!.y + scrollTop!.height).toBeLessThanOrEqual(whatsapp!.y + tolerance)
      // Left edge unused for FABs on desktop (both trailing)
      expect(whatsapp!.x).toBeGreaterThan(contentLeft + 60)
    })
  }

  test('hides WhatsApp, scroll-up and section dots when footer is in view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect
      .poll(async () => page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' }).getAttribute('tabindex'))
      .toBe('-1')

    const waLink = page.getByRole('link', { name: 'Kontaktujte mě na WhatsApp' })
    const scrollTop = page.getByRole('button', { name: 'Zpět nahoru' })
    const dots = page.locator('nav[aria-hidden="true"]').last()

    await expect(waLink).toHaveAttribute('tabindex', '-1')
    await expect(scrollTop).toHaveAttribute('tabindex', '-1')
    await expect(dots).toHaveClass(/opacity-0/)
  })
})
