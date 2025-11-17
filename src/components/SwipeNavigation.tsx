'use client'

import { useState, useEffect } from 'react';

const sections = ['hero', 'services', 'about', 'booking', 'faq', 'contact'];

export default function SwipeNavigation() {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only activate on mobile (screen width < 768px)
      if (window.innerWidth >= 768) return;
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      setTouchEnd(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (window.innerWidth >= 768) return;
      
      const swipeDistance = touchStart - touchEnd;
      const minSwipeDistance = 150; // increased from 100 to make it less sensitive

      if (Math.abs(swipeDistance) < minSwipeDistance) return;

      // Disable auto-snap to prevent jarring experience
      // User can manually scroll, swipe just suggests next section
      return;
      
      // DISABLED: Auto-snap functionality commented out
      /*
      // Get current section
      const currentScrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSectionIndex = 0;

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (currentScrollPosition >= elementTop) {
            currentSectionIndex = index;
          }
        }
      });

      // Swipe up - next section
      if (swipeDistance > 0) {
        const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        const nextSection = document.getElementById(sections[nextIndex]);
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // Swipe down - previous section
      else {
        const prevIndex = Math.max(currentSectionIndex - 1, 0);
        const prevSection = document.getElementById(sections[prevIndex]);
        if (prevSection) {
          prevSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      */

      setTouchStart(0);
      setTouchEnd(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd]);

  return null; // This is a logic-only component
}