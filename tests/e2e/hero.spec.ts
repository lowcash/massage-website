import { expect, test } from '@playwright/test'

test.describe('Hero (redesign)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero shows headline, lead sentence, photo and both calls to action without a scroll cue', async ({ page }) => {
    await expect(page.locator('#hero h1')).toBeVisible()
    await expect(page.locator('#hero')).toContainText('Uvolnění ztuhlých svalů, regenerace po sportu')
    await expect(page.locator('#hero img').first()).toBeVisible()
    await expect(page.locator('#hero a[href="#services"]')).toBeVisible()
    await expect(page.locator('#hero a[href="#booking"]')).toBeVisible()
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
