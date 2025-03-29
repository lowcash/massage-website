const DAYS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
const MONTHS = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec',
]
const TODAY = 'Dnes'
const TOMMOROW = 'Zítra'

/**
 * Převede datum na řetězec pro porovnávání dnů
 */
export function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

/**
 * Vrátí lokalizovaný název dne vzhledem k aktuálnímu dni
 * @param date Datum, pro které chceme získat název
 * @param today Referenční datum považované za "dnes"
 */
export function getDayName(date: Date, today: Date = new Date()): string {
  // Porovnáme klíče datumů
  const dateKey = getDateKey(date)
  const todayKey = getDateKey(today)

  // Vytvoříme zítřejší datum
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowKey = getDateKey(tomorrow)

  if (dateKey === todayKey) return TODAY
  if (dateKey === tomorrowKey) return TOMMOROW

  return DAYS[date.getDay()]
}

/**
 * Formátuje datum do českého formátu (např. "29 Březen")
 */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/**
 * Formátuje čas do českého formátu (např. "14:30")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
}
