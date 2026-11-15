/**
 * Regression tests for the Warm Paper redesign: selectable services, credentials accordion,
 * motion fallbacks and the booking panel presentation. Booking logic itself stays covered by booking-flow specs.
 */
import { expect, test } from '@playwright/test'

test.describe('Redesign interactions', () => {
  test('choosing a service sets aria-pressed on that row only and shows it in the booking panel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const rows = page.locator('#services li > button')
    await expect(rows.first()).toBeAttached({ timeout: 10000 })
    await expect(rows.first()).toHaveAttribute('aria-pressed', 'false')

    await rows.nth(1).scrollIntoViewIfNeeded()
    await rows.nth(1).click()

    await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'true')
    await expect(rows.first()).toHaveAttribute('aria-pressed', 'false')

    const name = ((await page.locator('#services li').nth(1).locator('h3').textContent()) ?? '').trim()
    await expect(page.locator('#booking')).toContainText(name)
  })

  test('credentials accordion opens and closes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const details = page.locator('#about details')
    await details.scrollIntoViewIfNeeded()
    await expect(details).not.toHaveAttribute('open', '')

    await details.locator('summary').click()
    await expect(details).toHaveAttribute('open', '')
    await expect(details.locator('li').first()).toBeVisible()

    await details.locator('summary').click()
    await expect(details).not.toHaveAttribute('open', '')
  })

  test('reduced motion: reveal content is fully visible and nothing animates', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'networkidle' })

    const state = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('.reveal, .reveal-soft'))
      return {
        count: nodes.length,
        hidden: nodes.filter((node) => {
          const style = getComputedStyle(node)
          return style.opacity !== '1' || style.animationName !== 'none' || style.translate !== 'none'
        }).length,
        jsClass: document.documentElement.classList.contains('js'),
      }
    })

    expect(state.count).toBeGreaterThan(0)
    expect(state.hidden).toBe(0)
    expect(state.jsClass).toBe(false)
  })

  test('booking panel is the dark night section with 44px slot targets', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const section = page.locator('#booking')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveClass(/bg-night/)

    const slot = section.locator('article a[href^="https://wa.me/"]').first()
    await expect(slot).toBeAttached()
    const box = await slot.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
