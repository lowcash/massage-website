'use client'

import { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useBooking } from "@/src/contexts/BookingContext";
import { useReducedMotion, getAnimationConfig, getAnimationConfigWithDelay } from '@/src/hooks/useReducedMotion';
import type { CalendarSlot } from './Calendar';

/**
 * Map API calendar data to display format
 * API returns raw dates and reserved status
 * Component needs: day name, formatted date, time slots, isToday flag
 * 
 * IMPORTANT: Redis ukládá jednotlivé časové sloty (každý záznam = jeden konkrétní čas)
 * Musíme je seskupit podle dne a extrahovat časy
 */
const mapApiDataToDisplay = (apiData?: CalendarSlot[] | any) => {
  // Handle case where server action returns { success, data } instead of just data
  let slots: CalendarSlot[] = [];
  
  if (!apiData) {
    return [];
  }
  
  // If apiData is server action result { success, data }, extract data
  if (typeof apiData === 'object' && 'data' in apiData && Array.isArray(apiData.data)) {
    slots = apiData.data;
  } else if (Array.isArray(apiData)) {
    slots = apiData;
  } else {
    console.error('Invalid apiData format:', apiData);
    return [];
  }
  
  // Pokud API není dostupné nebo vrátí prázdná data → prázdný kalendář
  if (slots.length === 0) {
    return [];  // ← Žádný fallback! Pouze API data nebo nic.
  }

  const days = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Seskupit sloty podle dne (YYYY-MM-DD)
  const slotsByDay = new Map<string, CalendarSlot[]>();
  
  slots.forEach((slot) => {
    const slotDate = new Date(slot.date);
    // Use UTC methods to avoid timezone conversion issues
    const dayKey = `${slotDate.getUTCFullYear()}-${String(slotDate.getUTCMonth() + 1).padStart(2, '0')}-${String(slotDate.getUTCDate()).padStart(2, '0')}`;
    
    if (!slotsByDay.has(dayKey)) {
      slotsByDay.set(dayKey, []);
    }
    slotsByDay.get(dayKey)!.push(slot);
  });

  // Konvertovat na display format
  const result = Array.from(slotsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0])) // Seřadit podle data
    .map(([dayKey, daySlots]) => {
      // Vezmi první slot pro získání data dne
      const firstSlot = daySlots[0];
      const slotDate = new Date(firstSlot.date);
      // Use UTC methods to avoid timezone issues
      const utcDay = slotDate.getUTCDay();
      
      const dayName = days[utcDay === 0 ? 6 : utcDay - 1];
      const dateStr = `${slotDate.getUTCDate()}.${slotDate.getUTCMonth() + 1}.`;
      
      // Check if today using UTC
      const todayUTC = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
      const slotDateUTC = `${slotDate.getUTCFullYear()}-${String(slotDate.getUTCMonth() + 1).padStart(2, '0')}-${String(slotDate.getUTCDate()).padStart(2, '0')}`;
      const isToday = todayUTC === slotDateUTC;

      // Vytvoč časové sloty z dat - použij UTC metody
      const slots = daySlots.map(slot => {
        const time = new Date(slot.date);
        const timeStr = `${time.getUTCHours()}:${String(time.getUTCMinutes()).padStart(2, '0')}`;
        return {
          time: timeStr,
          available: !slot.reserved,
        };
      }).sort((a, b) => a.time.localeCompare(b.time)); // Seřadit podle času

      return {
        day: dayName,
        date: dateStr,
        slots,
        isToday,
      };
    });

  return result;
};

interface BookingCalendarProps {
  data?: CalendarSlot[];
}

export default function BookingCalendar({ data }: BookingCalendarProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentPageDesktop, setCurrentPageDesktop] =
    useState(0);
  const [currentPageMobile, setCurrentPageMobile] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { selectedService } = useBooking();
  
  const calendarData = useMemo(
    () => mapApiDataToDisplay(data),
    [data],
  );

  // Show empty state if no data
  if (!calendarData || calendarData.length === 0) {
    return (
      <section
        id="booking"
        className="py-32 px-6 md:px-16 bg-gradient-to-b from-white to-[#fef8fb]"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            {...getAnimationConfig(shouldReduceMotion)}
            className="text-center text-[#de397e] mb-6 tracking-wider"
            style={{
              fontFamily: "Dancing Script",
              fontSize: "2.2rem",
            }}
          >
            Rezervace
          </motion.h2>
          
          <div className="text-center text-[#666666] py-12">
            <p className="text-lg mb-4">Kalendář není aktuálně dostupný.</p>
            <p className="text-sm">Pro rezervaci mě prosím kontaktujte přímo.</p>
          </div>
        </div>
      </section>
    );
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Desktop: 3 cards per page (7 pages total)
  // Mobile: 1 card per page (21 pages total)
  const cardsPerPage = 3; // Desktop
  const totalPagesDesktop = Math.ceil(
    calendarData.length / cardsPerPage,
  ); // 7 pages
  const totalPagesMobile = calendarData.length; // 21 pages

  // Center on today's date on mount - SEPARATE for desktop and mobile
  useEffect(() => {
    const todayIndex = calendarData.findIndex(
      (day) => day.isToday,
    );
    if (todayIndex !== -1) {
      // Desktop: set to the page containing today
      const todayPageDesktop = Math.floor(
        todayIndex / cardsPerPage,
      );
      setCurrentPageDesktop(todayPageDesktop);

      // Mobile: set to today's card index
      setCurrentPageMobile(todayIndex);
    }
  }, [calendarData]);

  const goToPrevious = () => {
    setCurrentPageDesktop((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentPageDesktop((prev) =>
      Math.min(totalPagesDesktop - 1, prev + 1),
    );
  };

  const goToPreviousMobile = () => {
    setCurrentPageMobile((prev) => Math.max(0, prev - 1));
  };

  const goToNextMobile = () => {
    setCurrentPageMobile((prev) =>
      Math.min(totalPagesMobile - 1, prev + 1),
    );
  };

  // Touch handlers for swipe - desktop
  const onTouchStartDesktop = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMoveDesktop = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndDesktop = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPageDesktop < totalPagesDesktop - 1) {
      goToNext();
    }
    if (isRightSwipe && currentPageDesktop > 0) {
      goToPrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Touch handlers for swipe - mobile
  const onTouchStartMobile = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMoveMobile = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndMobile = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPageMobile < totalPagesMobile - 1) {
      goToNextMobile();
    }
    if (isRightSwipe && currentPageMobile > 0) {
      goToPreviousMobile();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleSlotClick = (
    date: string,
    time: string,
    available: boolean,
  ) => {
    if (!available) return;

    // WhatsApp message with selected service
    let message = `Dobrý den, chtěl(a) bych si rezervovat masáž na ${date} v čase ${time}.`;

    if (selectedService) {
      message = `Dobrý den, mám zájem o: ${selectedService}\n\nRezervace na ${date} v ${time}`;
    }

    const phoneNumber = "420605579643";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="booking"
      className="py-32 px-6 md:px-16 bg-gradient-to-b from-white to-[#fef8fb]"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          {...getAnimationConfig(shouldReduceMotion)}
          className="text-center text-[#de397e] mb-6 tracking-wider"
          style={{
            fontFamily: "Dancing Script",
            fontSize: "2.2rem",
          }}
        >
          Volné termíny
        </motion.h2>

        <motion.p
          {...getAnimationConfigWithDelay(shouldReduceMotion, 0.15)}
          className="text-center text-[#666666] mb-6 max-w-2xl mx-auto leading-loose"
        >
          Vyberte si termín, který vám vyhovuje, a rezervujte si
          masáž přes WhatsApp
        </motion.p>

        {/* Selected Service Badge */}
        {selectedService && (
          <div className="flex justify-center mb-10">
            <div className="bg-white/70 backdrop-blur-[16px] border border-[#de397e]/30 rounded-2xl px-6 py-4 shadow-lg shadow-[#de397e]/8">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.95rem" }}
                >
                  Vybraná služba:
                </span>
                <span
                  className="text-[#de397e] text-center"
                  style={{
                    fontFamily: "Dancing Script",
                    fontSize: "1.4rem",
                    lineHeight: "1.3",
                  }}
                >
                  {selectedService}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop Version: 3 cards per page - šipky jen na desktop (lg+) */}
          <div className="hidden md:block relative">
            {/* Previous Arrow - desktop only */}
            <button
              onClick={goToPrevious}
              disabled={currentPageDesktop === 0}
              className={`hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 ${
                currentPageDesktop === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-label="Předchozí termíny"
            >
              <ChevronLeft
                className={`w-6 h-6 ${currentPageDesktop === 0 ? "text-gray-400" : "text-[#de397e]"}`}
              />
            </button>

            {/* Fade gradient on left edge - only if there are previous pages */}
            {currentPageDesktop > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none" />
            )}

            <div className="overflow-hidden px-20 md:px-24" style={{ touchAction: 'pan-y' }}>
              <motion.div
                animate={{
                  x: `${-currentPageDesktop * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 35,
                  mass: 1.2,
                }}
                className="flex"
                onTouchStart={onTouchStartDesktop}
                onTouchMove={onTouchMoveDesktop}
                onTouchEnd={onTouchEndDesktop}
              >
                {/* Group cards into pages */}
                {Array.from({ length: totalPagesDesktop }).map(
                  (_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="w-full flex-shrink-0 flex gap-6"
                    >
                      {calendarData
                        .slice(
                          pageIndex * cardsPerPage,
                          (pageIndex + 1) * cardsPerPage,
                        )
                        .map((dayData, cardIndex) => {
                          const globalIndex =
                            pageIndex * cardsPerPage +
                            cardIndex;
                          // Highlight only the currently viewed card (first card of visible page)
                          const isActiveDay =
                            globalIndex ===
                            currentPageDesktop * cardsPerPage;
                          // Only allow clicks on cards from the current page
                          const isCurrentPage =
                            pageIndex === currentPageDesktop;
                          return (
                            <div
                              key={globalIndex}
                              className="flex-1"
                            >
                              <div
                                className={`rounded-3xl p-6 w-full transition-all duration-500 ${
                                  dayData.isToday
                                    ? "bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] border-2 border-[#de397e]/30 shadow-lg shadow-[#de397e]/10"
                                    : "bg-white/70 backdrop-blur-[16px] border border-white/50"
                                } ${!isCurrentPage ? "opacity-50" : ""}`}
                              >
                                {/* Day header - centered */}
                                <div className="text-center mb-6 pb-5 border-b border-[#de397e]/20">
                                  <h3
                                    className={
                                      dayData.isToday
                                        ? "text-[#de397e] mb-2"
                                        : "text-[#2c2c2c] mb-2"
                                    }
                                    style={{
                                      fontFamily:
                                        "Dancing Script",
                                      fontSize: "2rem",
                                      lineHeight: "1.2",
                                    }}
                                  >
                                    {dayData.day}
                                  </h3>
                                  <p
                                    className="text-[#666666]"
                                    style={{
                                      fontSize: "1.1rem",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {dayData.date}
                                  </p>
                                </div>

                                {/* Time slots */}
                                <div className="space-y-3">
                                  {dayData.slots.map((slot) => (
                                    <button
                                      key={slot.time}
                                      onClick={() =>
                                        isCurrentPage &&
                                        handleSlotClick(
                                          dayData.date,
                                          slot.time,
                                          slot.available,
                                        )
                                      }
                                      disabled={
                                        !slot.available ||
                                        !isCurrentPage
                                      }
                                      className={`w-full px-4 py-3 rounded-2xl text-center transition-all duration-300 ${
                                        slot.available &&
                                        isCurrentPage
                                          ? "bg-white/60 backdrop-blur-sm text-[#2c2c2c] border border-white/50 hover:bg-[#de397e] hover:text-white hover:border-[#de397e] hover:scale-[1.02] hover:shadow-md cursor-pointer"
                                          : "bg-[#e8e8e8] text-[#999999] cursor-not-allowed line-through"
                                      }`}
                                    >
                                      {slot.time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ),
                )}
              </motion.div>
            </div>

            {/* Fade gradient on right edge - only if there are next pages */}
            {currentPageDesktop < totalPagesDesktop - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none" />
            )}

            {/* Next Arrow - desktop only */}
            <button
              onClick={goToNext}
              disabled={
                currentPageDesktop >= totalPagesDesktop - 1
              }
              className={`hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-[16px] border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 ${
                currentPageDesktop >= totalPagesDesktop - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-label="Další termíny"
            >
              <ChevronRight
                className={`w-6 h-6 ${currentPageDesktop >= totalPagesDesktop - 1 ? "text-gray-400" : "text-[#de397e]"}`}
              />
            </button>

            {/* Progress Dots - Desktop: Intelligent grouping with max 10 dots */}
            <div className="flex justify-center gap-3 mt-12">
              {(() => {
                const MAX_DOTS = 10;
                const totalPages = totalPagesDesktop;
                
                // Calculate pages per dot to fit within MAX_DOTS
                const pagesPerDot = Math.ceil(totalPages / MAX_DOTS);
                const actualDots = Math.ceil(totalPages / pagesPerDot);
                
                return Array.from({ length: actualDots }).map((_, dotIndex) => {
                  const groupStartPage = dotIndex * pagesPerDot;
                  const groupEndPage = Math.min(groupStartPage + pagesPerDot - 1, totalPages - 1);
                  const isCurrentGroup =
                    currentPageDesktop >= groupStartPage &&
                    currentPageDesktop <= groupEndPage;

                  return (
                    <button
                      key={dotIndex}
                      onClick={() => setCurrentPageDesktop(groupStartPage)}
                      className={`transition-all rounded-full cursor-pointer ${
                        isCurrentGroup
                          ? "bg-[#de397e] w-8 h-3"
                          : "bg-[#de397e]/30 w-3 h-3 hover:bg-[#de397e]/60"
                      }`}
                      aria-label={`Přejít na skupinu ${dotIndex + 1}`}
                    />
                  );
                });
              })()}
            </div>
          </div>

          {/* Mobile Version: 1 card per page */}
          <div className="md:hidden relative">
            {/* Fade gradient on left edge - mobile - only if not first page */}
            {currentPageMobile > 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fef8fb]/80 via-[#fef8fb]/20 to-transparent z-10 pointer-events-none" />
            )}

            <div className="overflow-hidden" style={{ touchAction: 'pan-y' }}>
              <motion.div
                animate={{
                  x: `calc(17.5% - ${currentPageMobile * 65}%)`, // Start with 17.5% offset to center first card, then shift by 65% per page
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 35,
                  mass: 1.2,
                }}
                className="flex"
                onTouchStart={onTouchStartMobile}
                onTouchMove={onTouchMoveMobile}
                onTouchEnd={onTouchEndMobile}
              >
                {calendarData.map((dayData, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[65%]"
                  >
                    <div className="px-0 h-full">
                      <div
                        className={`rounded-3xl px-4 py-6 w-full max-w-[320px] mx-auto transition-all duration-500 ${
                          dayData.isToday
                            ? "bg-gradient-to-br from-[#fef8fb] to-[#fff5f9] border-2 border-[#de397e]/30 shadow-lg shadow-[#de397e]/10"
                            : "bg-white/70 backdrop-blur-[16px] border border-white/50"
                        } ${index !== currentPageMobile ? "opacity-40 scale-95" : "opacity-100"}`}
                      >
                        {/* Day header */}
                        <div className="text-center mb-6 pb-5 border-b border-[#de397e]/20">
                          <h3
                            className={
                              dayData.isToday
                                ? "text-[#de397e] mb-2"
                                : "text-[#2c2c2c] mb-2"
                            } // Označit JEN aktuální
                            style={{
                              fontFamily: "Dancing Script",
                              fontSize: "2rem",
                              lineHeight: "1.2",
                            }}
                          >
                            {dayData.day}
                          </h3>
                          <p
                            className="text-[#666666]"
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: 500,
                            }}
                          >
                            {dayData.date}
                          </p>
                        </div>

                        {/* Time slots */}
                        <div className="space-y-3">
                          {dayData.slots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() =>
                                index === currentPageMobile &&
                                handleSlotClick(
                                  dayData.date,
                                  slot.time,
                                  slot.available,
                                )
                              }
                              disabled={
                                !slot.available ||
                                index !== currentPageMobile
                              }
                              className={`w-full px-4 py-3 rounded-2xl text-center transition-all duration-300 ${
                                slot.available &&
                                index === currentPageMobile
                                  ? "bg-[#f5f0ea] text-[#2c2c2c] hover:bg-[#de397e] hover:text-white hover:scale-[1.02] hover:shadow-md cursor-pointer"
                                  : "bg-[#e8e8e8] text-[#999999] cursor-not-allowed line-through"
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Fade gradient on right edge - mobile - only if not last page */}
            {currentPageMobile < totalPagesMobile - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fef8fb]/80 via-[#fef8fb]/20 to-transparent z-10 pointer-events-none" />
            )}

            {/* Progress Dots - Mobile: Intelligent grouping with max 10 dots */}
            <div className="flex justify-center gap-3 mt-12">
              {(() => {
                const MAX_DOTS = 10;
                const totalDays = totalPagesMobile;
                
                // Calculate days per dot to fit within MAX_DOTS
                const daysPerDot = Math.ceil(totalDays / MAX_DOTS);
                const actualDots = Math.ceil(totalDays / daysPerDot);
                
                return Array.from({ length: actualDots }).map((_, dotIndex) => {
                  const groupStartDay = dotIndex * daysPerDot;
                  const groupEndDay = Math.min(groupStartDay + daysPerDot - 1, totalDays - 1);
                  const isCurrentGroup =
                    currentPageMobile >= groupStartDay &&
                    currentPageMobile <= groupEndDay;

                  return (
                    <button
                      key={dotIndex}
                      onClick={() => setCurrentPageMobile(groupStartDay)}
                      className={`transition-all rounded-full cursor-pointer ${
                        isCurrentGroup
                          ? "bg-[#de397e] w-8 h-3"
                          : "bg-[#de397e]/30 w-3 h-3 hover:bg-[#de397e]/60"
                      }`}
                      aria-label={`Přejít na skupinu ${dotIndex + 1}`}
                    />
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          {...getAnimationConfigWithDelay(shouldReduceMotion, 0.3)}
          className="text-center mt-16"
        >
          {!selectedService ? (
            <>
              <p className="text-[#666666] mb-6 leading-loose">
                Pro rezervaci termínu nejprve vyberte službu
                výše
              </p>
              <motion.a
                href="#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-3 bg-[#de397e] text-white rounded-full transition-all duration-300 hover:bg-[#c4a75f] hover:shadow-xl cursor-pointer"
              >
                <span
                  style={{
                    fontFamily: "Dancing Script",
                    fontSize: "1.25rem",
                  }}
                >
                  Vybrat službu
                </span>
              </motion.a>
            </>
          ) : (
            <>
              <p className="text-[#666666] mb-6 leading-loose">
                Nenašli jste vhodný termín? Kontaktujte mě a
                domluvíme se.
              </p>
              <motion.a
                href="https://wa.me/420605579643"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-3 bg-[#de397e] text-white rounded-full transition-all duration-300 hover:bg-[#c4a75f] hover:shadow-xl cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span
                  style={{
                    fontFamily: "Dancing Script",
                    fontSize: "1.25rem",
                  }}
                >
                  Napište mi na WhatsApp
                </span>
              </motion.a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}