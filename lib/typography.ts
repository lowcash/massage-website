const NBSP = '\u00A0'
const LEAD = '(^|[\\s(„"\'\u00A0])'
// Plain whitespace only: an already-bound NBSP must stay available as the next word's leading boundary.
const GAP = '[^\\S\u00A0]+'

const SINGLE_LETTER = new RegExp(`${LEAD}([AaIiKkOoSsUuVvZz])${GAP}`, 'g')
const SHORT_WORD = new RegExp(`${LEAD}(do|na|od|po|za|ve|ze|ke|se|si|či|že)${GAP}`, 'gi')
const ABBREVIATION = new RegExp(
  `${LEAD}((?:Mgr|Ing|Bc|DiS|MUDr|PhDr|JUDr|RNDr|MVDr|PharmDr|doc|prof|akad|sv|tř|ul|nám|č|čl|např|tj|tzv|atd|apod))\\.${GAP}`,
  'giu',
)
const POSTAL_CODE = /(\d{3})\s+(\d{2})(?=\s|$)/g
const NUMBER_UNIT = /(\d+)\s+(%|°C|kg|g|km|m|cm|mm|min|h)\b/gi
const THOUSANDS = /(\d{1,3})\s+(\d{3})(?!\d)/g
const NUMBER_CURRENCY = /(\d)\s+(Kč)(?![\p{L}\d])/gu
const DASH = /(\S)\s+([–—])(\s)/g

/**
 * Keeps Czech short words, abbreviations and numbers glued to their neighbours so a line never
 * ends with "v", "a", "Mgr." or a dangling unit. Static rules only: how the last line of a
 * paragraph breaks depends on the viewport, which is handled in CSS with `text-wrap: pretty`.
 */
export function applyCzechNbsp(text: string) {
  if (!text) {
    return text
  }

  let result = text.replace(/\u00A0/g, ' ')

  // A match consumes the gap the next word would need as its boundary, so chained short words
  // ("a v domě", "k a s") need another round until nothing changes.
  for (let round = 0; round < 5; round++) {
    const next = result
      .replace(SINGLE_LETTER, `$1$2${NBSP}`)
      .replace(SHORT_WORD, `$1$2${NBSP}`)
      .replace(ABBREVIATION, `$1$2.${NBSP}`)

    if (next === result) {
      break
    }

    result = next
  }

  const bound = result
    .replace(POSTAL_CODE, `$1${NBSP}$2`)
    .replace(THOUSANDS, `$1${NBSP}$2`)
    .replace(NUMBER_UNIT, `$1${NBSP}$2`)
    .replace(NUMBER_CURRENCY, `$1${NBSP}$2`)
    .replace(DASH, `$1${NBSP}$2$3`)

  // Sentences and paragraphs also get a glued tail: `text-wrap: pretty` is only a hint and still
  // leaves a one-word last line in some widths and browsers.
  return bound.split(/\s+/).length >= PARAGRAPH_MIN_WORDS ? bindTail(bound) : bound
}

const TAIL_LIMIT = 24
const PARAGRAPH_MIN_WORDS = 6

// A token is a word or an already glued group of words ("v\u00A0Bratislavě", "sv.\u00A0Alžbety").
const TOKEN = '[^\\s\u00A0]+(?:\u00A0[^\\s\u00A0]+)*'
const TAIL = new RegExp(`(${TOKEN})${GAP}(${TOKEN})$`)

/**
 * Glues the last two tokens of a text together so it can never end with a stranded fragment on its own
 * line ("v Bratislavě", "dnes"), whatever the browser's `text-wrap` decides. Because glued groups count as
 * one token, "Alžbety v\u00A0Bratislavě" stays together as a whole. Long tails are left alone to avoid an
 * unbreakable chunk that overflows narrow screens.
 */
export function bindTail(text: string) {
  return text.replace(TAIL, (match, penultimate: string, last: string) =>
    penultimate.length + last.length + 1 <= TAIL_LIMIT ? `${penultimate}${NBSP}${last}` : match,
  )
}
