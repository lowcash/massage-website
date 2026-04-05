/**
 * Motion regression tests for service cards.
 *
 * Verifies that the hover transition animates `translate` (not `transform`) so
 * that the individual transform property interpolates correctly without causing
 * a "jumpy" reset.  Run against a live dev/preview server.
 */
import { expect, test } from '@playwright/test'

test.describe('Service cards — motion regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('service card uses transition-property: translate (not transform)', async ({ page }) => {
    // Scroll to services section so cards enter the viewport
    await page.evaluate(() => {
      const services = document.getElementById('services')
      services?.scrollIntoView({ behavior: 'instant' })
    })

    // Pick the first service card button
    const card = page.locator('#services button').first()
    await expect(card).toBeVisible()

    const transitionProperty = await card.evaluate((el) => getComputedStyle(el).transitionProperty)

    // Must include "translate" as a discrete property — NOT "transform"
    expect(transitionProperty).toContain('translate')
    expect(transitionProperty).not.toBe('transform')
  })

  test('service card hover does not snap (transition-duration ≥ 300ms)', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'instant' })
    })

    const card = page.locator('#services button').first()
    await expect(card).toBeVisible()

    const durationMs = await card.evaluate((el) => {
      const raw = getComputedStyle(el).transitionDuration
      // e.g. "0.36s, 0.36s" → pick first value in ms
      const first = raw.split(',')[0].trim()
      return first.endsWith('ms') ? parseFloat(first) : parseFloat(first) * 1000
    })

    // Duration must be at least 300 ms to ensure a smooth, non-instantaneous feel
    expect(durationMs).toBeGreaterThanOrEqual(300)
  })

  test('service cards are visible after scroll reveal', async ({ page }) => {
    // Scroll to services so the IntersectionObserver fires
    await page.evaluate(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'instant' })
    })

    // Wait for reveal animation to complete (longest possible delay + duration)
    await page.waitForTimeout(1200)

    const cards = page.locator('#services button')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Every card should be fully opaque after the reveal
    for (let i = 0; i < Math.min(count, 4); i++) {
      const opacity = await cards.nth(i).evaluate((el) => getComputedStyle(el).opacity)
      expect(parseFloat(opacity)).toBeCloseTo(1, 1)
    }
  })
})
