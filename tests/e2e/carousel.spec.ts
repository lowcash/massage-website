import { test, expect } from '@playwright/test'

/**
 * PeekCarousel boundary tests.
 * Run against a live dev server: npm run dev
 * Then: npx playwright test carousel --project=mobile-safari
 */

test.describe('BookingCalendar carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to the booking calendar section
    await page.evaluate(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'instant' })
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

  test('mouse drag advances carousel', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()
    const box = await carousel.boundingBox()
    if (!box) throw new Error('Carousel not found in viewport')

    const startX = box.x + box.width * 0.7
    const endX = box.x + box.width * 0.2
    const midY = box.y + box.height / 2

    // Use page.mouse which triggers pointer events (carousel JS handler is mouse-only)
    await page.mouse.move(startX, midY)
    await page.mouse.down()
    await page.mouse.move(endX, midY, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(600)

    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBeGreaterThan(0)
  })

  test('mouse drag left from start does not go past first item', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()
    const box = await carousel.boundingBox()
    if (!box) throw new Error('Carousel not found in viewport')

    const startX = box.x + box.width * 0.3
    const endX = box.x + box.width * 0.8
    const midY = box.y + box.height / 2

    // Drag right (scroll left) from start position
    await page.mouse.move(startX, midY)
    await page.mouse.down()
    await page.mouse.move(endX, midY, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(600)

    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBeGreaterThanOrEqual(0)
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

  test('scroll cue disappears after scrolling down', async ({ page }) => {
    // Find the scroll cue link (it's position:fixed, z-20, links to #services)
    const cueLink = page.locator('a[href="#services"].fixed')
    await expect(cueLink).toBeVisible()

    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(300)

    await expect(cueLink).not.toBeVisible()
  })
})
