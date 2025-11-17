import { useState, useEffect } from 'react';

/**
 * Hook to detect if animations should be reduced
 * NOVÉ: Vždy vrací true = všechny scroll animace jsou vypnuté
 * Zachováváme jen funkcionální animace (carousel, mobile menu slide)
 */
export function useReducedMotion(): boolean {
  // Všechny scroll animace jsou vypnuté pro maximální výkon a stabilitu
  return true;
}

/**
 * ČISTÁ STRÁNKA: Žádné scroll animace
 * Komponenty jsou okamžitě viditelné bez fade-in, scale nebo slide efektů
 * 
 * ✅ VÝHODY:
 * - Instant zobrazení obsahu
 * - Žádné blikání na mobilu
 * - Maximální výkon
 * - Elegance v jednoduchosti (masážní salon = klid)
 * 
 * Zachováváme:
 * ✅ Carousel slide animations (funkcionalita)
 * ✅ Hover efekty (micro-interactions) 
 * ✅ Mobile menu slide (UX standard)
 */
export function getAnimationConfig(shouldReduce: boolean) {
  // Všude stejné - žádná animace při scroll
  return {
    initial: { opacity: 1 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0 },
  };
}

/**
 * Get animation config with custom delay
 * Delay je ignorován - všechny komponenty se zobrazí okamžitě
 */
export function getAnimationConfigWithDelay(shouldReduce: boolean, delay: number = 0) {
  // Delay ignorujeme - okamžité zobrazení
  return {
    initial: { opacity: 1 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0 },
  };
}