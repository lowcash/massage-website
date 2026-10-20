/**
 * Czech typography regression tests.
 *
 * Non-breaking spaces fix a few rules statically, but where a paragraph breaks depends on the
 * viewport, so the layout test measures real line breaks across widths and fails on one-word last lines.
 */
import { expect, test } from '@playwright/test'

import { applyCzechNbsp, bindTail } from '../../lib/typography'

const NBSP = ' '
const visible = (text: string) => text.replaceAll(NBSP, '⍽')

test.describe('applyCzechNbsp', () => {
  const cases: [string, string][] = [
    ['Jsem a v domě', `Jsem a${NBSP}v${NBSP}domě`],
    ['k a s o u', `k${NBSP}a${NBSP}s${NBSP}o${NBSP}u`],
    ['Ráda bych, abyste se mnou', `Ráda bych, abyste se${NBSP}mnou`],
    ['Mgr. Radka Šebestová', `Mgr.${NBSP}Radka Šebestová`],
    ['Národní tř. 383/15', `Národní tř.${NBSP}383/15`],
    ['695 01 Hodonín', `695${NBSP}01 Hodonín`],
    ['od 800 Kč', `od${NBSP}800${NBSP}Kč`],
    ['60 min', `60${NBSP}min`],
    ['Akupunktura – metodou TČM', `Akupunktura${NBSP}– metodou TČM`],
  ]

  for (const [input, expected] of cases) {
    test(`binds "${input}"`, () => {
      expect(visible(applyCzechNbsp(input))).toBe(visible(expected))
    })
  }

  test('glues the tail of paragraph-length text but not of short labels', () => {
    expect(visible(applyCzechNbsp('Ideální dárek pro každou příležitost dnes'))).toBe(
      visible(`Ideální dárek pro každou příležitost${NBSP}dnes`),
    )
    expect(visible(applyCzechNbsp('Rezervace přes WhatsApp'))).toBe('Rezervace přes WhatsApp')
  })

  test('is idempotent and leaves empty text alone', () => {
    const once = applyCzechNbsp('Jsem a v domě s Mgr. Novákem')
    expect(applyCzechNbsp(once)).toBe(once)
    expect(applyCzechNbsp('')).toBe('')
  })
})

test.describe('bindTail', () => {
  test('glues the last two words of a short text', () => {
    expect(visible(bindTail('Jak Vám můžu pomoci?'))).toBe('Jak Vám můžu⍽pomoci?')
  })

  test('leaves long tails and single words alone', () => {
    expect(bindTail('Mimořádně individuálně přizpůsobených terapeutických')).toBe(
      'Mimořádně individuálně přizpůsobených terapeutických',
    )
    expect(bindTail('Kontakt')).toBe('Kontakt')
  })
})

test.describe('line breaks', () => {
  const widths = [320, 360, 390, 768, 1024, 1280, 1440]

  for (const width of widths) {
    test(`no one-word last lines at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)

      const orphans = await page.evaluate(() => {
        const found: string[] = []
        const selector =
          '#main-content p, #main-content h1, #main-content h2, #main-content h3, #main-content li, footer p'

        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (el.offsetParent === null || el.closest('[aria-hidden="true"]')) return

          const words: { text: string; top: number }[] = []
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)

          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const value = node.textContent ?? ''
            for (const match of value.matchAll(/[^\s]+/g)) {
              const range = document.createRange()
              range.setStart(node, match.index ?? 0)
              range.setEnd(node, (match.index ?? 0) + match[0].length)
              const rect = range.getClientRects()[0]
              if (rect) words.push({ text: match[0], top: Math.round(rect.top) })
            }
          }

          if (words.length < 4) return

          const lastTop = Math.max(...words.map((w) => w.top))
          const lineTops = [...new Set(words.map((w) => w.top))]
          // Inline children with another font size sit a few px off; treat close tops as one line.
          const lines = lineTops.filter((top, i) => i === 0 || Math.abs(top - lineTops[i - 1]) > 6)
          const lastLine = words.filter((w) => Math.abs(w.top - lastTop) <= 6)

          if (lines.length >= 2 && lastLine.length === 1) {
            found.push(
              `${lines.length} lines, last word "${lastLine[0].text}": …${(el.textContent ?? '').trim().slice(-50)}`,
            )
          }
        })

        return found
      })

      expect(orphans, `one-word last lines at ${width}px`).toEqual([])
    })
  }
})
