import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('A11y smoke', () => {
  test('homepage has no serious or critical accessibility violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

    const seriousOrCritical = result.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )

    expect(
      seriousOrCritical,
      seriousOrCritical.map((violation) => `${violation.id}: ${violation.description}`).join('\n'),
    ).toEqual([])
  })
})
