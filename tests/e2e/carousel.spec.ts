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

test.describe('Hero (redesign)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero shows headline, photo and both calls to action without a scroll cue', async ({ page }) => {
    await expect(page.locator('#hero h1')).toBeVisible()
    await expect(page.locator('#hero img').first()).toBeVisible()
    await expect(page.locator('#hero a[href="#services"]')).toBeVisible()
    await expect(page.locator('#hero a[href="#booking"]')).toBeVisible()
    // The old full-bleed hero had a bouncing chevron; the split hero fits one screen and has none.
    await expect(page.locator('#hero a[href="#services"] svg')).toHaveCount(0)
  })

  test('LCP image and headline carry no animation or transform', async ({ page }) => {
    const state = await page.evaluate(() => {
      const nodes = [document.querySelector('#hero img'), document.querySelector('#hero h1')]
      return nodes.map((node) => {
        const style = getComputedStyle(node as Element)
        return {
          animationName: style.animationName,
          transform: style.transform,
          translate: style.translate,
          scale: style.scale,
        }
      })
    })

    for (const item of state) {
      expect(item.animationName).toBe('none')
      expect(item.transform).toBe('none')
      expect(item.translate).toBe('none')
      expect(item.scale).toBe('none')
    }
  })
})
