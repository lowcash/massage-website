/**
 * Navigation constants and section definitions
 * Central source of truth for all navigation-related data
 */

export const SCROLL_THRESHOLD = 100; // px - when navbar hides and side dots appear

export interface NavigationSection {
  id: string;
  label: string;
  href: string;
}

/**
 * Main navigation sections
 * Used by Navigation, SideDots, and SwipeNavigation components
 */
export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: 'hero', label: 'Úvod', href: '#hero' },
  { id: 'services', label: 'Služby', href: '#services' },
  { id: 'about', label: 'O\u00A0mně', href: '#about' },
  { id: 'booking', label: 'Rezervace', href: '#booking' },
  { id: 'contact', label: 'Kontakt', href: '#contact' },
];

/**
 * Menu items for main navigation (excludes hero/intro)
 * Logo serves as the link to hero section
 */
export const MENU_ITEMS = NAVIGATION_SECTIONS.filter(section => section.id !== 'hero');

/**
 * Section IDs only (for SwipeNavigation)
 */
export const SECTION_IDS = NAVIGATION_SECTIONS.map(section => section.id);
