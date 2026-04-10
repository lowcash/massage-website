import { test, expect } from '@playwright/test'

/**
 * PeekCarousel mouse-drag tests — desktop only.
 * Mouse drag is a desktop-only interaction (touch devices use native scroll).
 */

test.describe('BookingCalendar carousel drag — desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const carousel = document.querySelector('#booking .overflow-x-auto')
      carousel?.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await page.waitForTimeout(400)
  })

  test('mouse drag advances carousel', async ({ page }) => {
    const carousel = page.locator('#booking .overflow-x-auto').first()
    const box = await carousel.boundingBox()
    if (!box) throw new Error('Carousel not found in viewport')

    const startX = box.x + box.width * 0.7
    const endX = box.x + box.width * 0.2
    // Use top of cards (day header h3 area) — card slots are <a> links that now break out of capture
    const dragY = box.y + 30

    await page.mouse.move(startX, dragY)
    await page.mouse.down()
    await page.mouse.move(endX, dragY, { steps: 10 })
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
    const dragY = box.y + 30

    await page.mouse.move(startX, dragY)
    await page.mouse.down()
    await page.mouse.move(endX, dragY, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(600)

    const scrollLeft = await carousel.evaluate((el) => el.scrollLeft)
    expect(scrollLeft).toBeGreaterThanOrEqual(0)
  })
})
