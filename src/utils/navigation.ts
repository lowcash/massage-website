/**
 * Navigation utility functions
 * Shared navigation logic across components
 */

/**
 * Smoothly scrolls to a section by its ID or href
 * @param target - Section ID (e.g., 'services') or href (e.g., '#services')
 */
export function scrollToSection(target: string): void {
  // Remove '#' if present
  const sectionId = target.startsWith('#') ? target.slice(1) : target;
  
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Gets the currently active section based on scroll position
 * @param sections - Array of section IDs to check
 * @returns Active section ID
 */
export function getActiveSection(sections: string[]): string {
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        return sectionId;
      }
    }
  }
  
  // Default to first section if none found
  return sections[0] || '';
}

/**
 * Checks if viewport is scrolled past threshold
 * @param threshold - Scroll threshold in pixels
 * @returns True if scrolled past threshold
 */
export function isScrolledPastThreshold(threshold: number): boolean {
  return window.scrollY > threshold;
}
