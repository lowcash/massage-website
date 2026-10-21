import { expect, test } from '@playwright/test'

/**
 * PeekCarousel boundary tests — runs on all projects.
 * Mouse-drag tests live in carousel.desktop.spec.ts.
 */

test.describe('BookingCalendar carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to the carousel within the booking section
    await page.evaluate(() => {
      const carousel = document.querySelector('#booking .overflow-x-auto')
      carousel?.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await page.waitForTimeout(400)
  })

  test('carousel scroll container exists and is scrollable', async ({ page }) => {
    // Find the carousel scroll container inside the booking section
    const carousel = page.locator('#booking .overflow-x-auto').first()
    await expect(carousel).toBeVisible()

    const scrollWidth = await carousel.evaluate((el) => el.scrollWidth)
    const clientWidth = await carousel.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeGreaterThan(clientWidth)
  })

  test('initial scrollLeft is 0', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()
    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBe(0)
  })

  test('cannot scroll past left boundary (rubber-band simulation)', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()

    // Force scrollLeft to a negative value (simulating iOS rubber-band overscroll)
    await carousel.evaluate((el) => {
      el.scrollLeft = -50
    })
    await page.waitForTimeout(200)

    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    // Browser clamps to 0, and our JS clamp should also keep it at 0
    expect(scrollLeft).toBeGreaterThanOrEqual(0)
  })

  test('cannot scroll past right boundary', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()

    const maxScrollLeft = await carousel.evaluate((el) => el.scrollWidth - el.clientWidth)

    // Force scrollLeft beyond the max
    await carousel.evaluate((el) => {
      el.scrollLeft = el.scrollWidth + 200
    })
    await page.waitForTimeout(200)

    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBeLessThanOrEqual(maxScrollLeft + 2) // 2px tolerance
  })
})

test.describe('Hero scroll cue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('scroll cue is visible on initial load', async ({ page }) => {
    // Look for the chevron-down anchor in hero
    const heroCue = page.locator('a[href="#services"] svg').first()
    await expect(heroCue).toBeVisible()
  })

  test('scroll cue leaves the viewport after scrolling past the hero', async ({ page }) => {
    const cueLink = page.locator('#hero a[href="#services"][aria-label]')
    await expect(cueLink).toBeVisible()

    // Cue is absolute inside the full-viewport hero — scroll past the hero, not just a few hundred px.
    await page.evaluate(() => {
      const hero = document.getElementById('hero')
      window.scrollTo({ top: (hero?.offsetHeight ?? window.innerHeight) + 40, behavior: 'instant' })
    })
    await page.waitForTimeout(300)

    await expect(cueLink).not.toBeInViewport()
  })
})
