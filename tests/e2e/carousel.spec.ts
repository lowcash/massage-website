import { expect, test } from '@playwright/test'

/**
 * PeekCarousel boundary tests — runs on all projects.
 * Mouse-drag tests live in carousel.desktop.spec.ts.
 */

test.describe('Studio gallery carousel (mobile)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Desktop swaps the carousel for a grid.
    test.skip(!testInfo.project.name.includes('mobile'), 'carousel is mobile-only')
    await page.goto('/')
    // Scroll to the carousel within the studio section
    await page.evaluate(() => {
      const carousel = document.querySelector('#studio .overflow-x-auto')
      carousel?.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await page.waitForTimeout(400)
  })

  test('carousel scroll container exists and is scrollable', async ({ page }) => {
    // Find the carousel scroll container inside the booking section
    const carousel = page.locator('#studio .overflow-x-auto').first()
    await expect(carousel).toBeVisible()

    const scrollWidth = await carousel.evaluate((el) => el.scrollWidth)
    const clientWidth = await carousel.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeGreaterThan(clientWidth)
  })

  test('initial scrollLeft is 0', async ({ page }) => {
    const carousel = page.locator('#studio .overflow-x-auto').first()
    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBe(0)
  })

  test('cannot scroll past left boundary (rubber-band simulation)', async ({ page }) => {
    const carousel = page.locator('#studio .overflow-x-auto').first()

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
    const carousel = page.locator('#studio .overflow-x-auto').first()

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
