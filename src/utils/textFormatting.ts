/**
 * Formats Czech text to prevent single-letter prepositions and numbers from being at the end of a line.
 * Replaces spaces after specific prepositions and numbers with non-breaking spaces.
 * 
 * @param text The text to format
 * @returns Formatted text with non-breaking spaces
 */
export function formatCzechText(text: string): string {
  if (!text) return text;

  // 1. Single letter prepositions (k, v, s, z, o, u, a, i) - case insensitive
  // Replace " x " with " x&nbsp;" (where x is the preposition)
  // We use a regex that looks for word boundary, the preposition, and a space.
  // We replace the space with \u00A0 (non-breaking space).
  let formatted = text.replace(/(\s|^)([kKvVsSzZoOuUaAiI])\s/g, '$1$2\u00A0');

  // 2. Numbers followed by units or just numbers in text
  // This is a bit more aggressive, but generally "1000 Kč" should be "1000&nbsp;Kč"
  // Also handles the "1 500+" case mentioned by user: "1 500" -> "1&nbsp;500"
  
  // Handle numbers with spaces (e.g. 1 500) -> 1&nbsp;500
  formatted = formatted.replace(/(\d+)\s(?=\d{3})/g, '$1\u00A0');

  // Handle number followed by a word (unit) -> 10&nbsp;km
  // We limit this to short words (units) to avoid formatting "Year 2024 is..." incorrectly if possible,
  // but generally keeping number with the next word is good practice in Czech typography.
  formatted = formatted.replace(/(\d+)\s/g, '$1\u00A0');

  return formatted;
}
