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

const mapApiDataToDisplay = (apiData?: CalendarSlot[] | any) => {
  let slots: CalendarSlot[] = [];
  
  if (!apiData) return [];
  
  if (typeof apiData === 'object' && 'data' in apiData && Array.isArray(apiData.data)) {
    slots = apiData.data;
  } else if (Array.isArray(apiData)) {
    slots = apiData;
  } else {
    console.error('Invalid apiData format:', apiData);
    return [];
  }
  
  if (slots.length === 0) return [];

  const days = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
  
  const today = new Date();
  const todayPrague = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
  todayPrague.setHours(0, 0, 0, 0);

  const slotsByDay = new Map<string, CalendarSlot[]>();
  
  slots.forEach((slot) => {
    const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date);
    const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
    const dayKey = `${slotPrague.getFullYear()}-${String(slotPrague.getMonth() + 1).padStart(2, '0')}-${String(slotPrague.getDate()).padStart(2, '0')}`;
    
    if (!slotsByDay.has(dayKey)) {
      slotsByDay.set(dayKey, []);
    }
    slotsByDay.get(dayKey)!.push(slot);
  });

  const result = Array.from(slotsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([dayKey, daySlots]) => {
      // Filtrovat jen dny, které jsou dnes nebo v budoucnosti (Prague timezone)
      const firstSlot = daySlots[0];
      const slotDate = firstSlot.date instanceof Date ? firstSlot.date : new Date(firstSlot.date);
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
      slotPrague.setHours(0, 0, 0, 0);
      return slotPrague >= todayPrague;
    })
    .map(([dayKey, daySlots]) => {
      const firstSlot = daySlots[0];
      const slotDate = firstSlot.date instanceof Date ? firstSlot.date : new Date(firstSlot.date);
      const slotPrague = new Date(slotDate.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
      
      const dayIndex = slotPrague.getDay();
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];
      const dateStr = `${slotPrague.getDate()}.${slotPrague.getMonth() + 1}.`;
      
      const slotDateOnly = `${slotPrague.getFullYear()}-${String(slotPrague.getMonth() + 1).padStart(2, '0')}-${String(slotPrague.getDate()).padStart(2, '0')}`;
      const todayDateOnly = `${todayPrague.getFullYear()}-${String(todayPrague.getMonth() + 1).padStart(2, '0')}-${String(todayPrague.getDate()).padStart(2, '0')}`;
      const isToday = todayDateOnly === slotDateOnly;

      const slots = daySlots.map(slot => {
        // Redis obsahuje UTC čas, převedeme na Prague timezone pro zobrazení
        const time = slot.date instanceof Date ? slot.date : new Date(slot.date);
        const timePrague = new Date(time.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
        const hours = timePrague.getHours();
        const minutes = timePrague.getMinutes();
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return {
          time: timeStr,
          available: !slot.reserved,
        };
      }).sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        if (aHours !== bHours) return aHours - bHours;
        return aMinutes - bMinutes;
      });

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
  
  const calendarData = useMemo(() => mapApiDataToDisplay(data), [data]);

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

  const minSwipeDistance = 50;

  const cardsPerPage = 3;
  const totalPagesDesktop = Math.ceil(calendarData.length / cardsPerPage);
  const totalPagesMobile = calendarData.length;

  useEffect(() => {
    const todayIndex = calendarData.findIndex((day) => day.isToday);
    if (todayIndex !== -1) {
      setCurrentPageDesktop(Math.floor(todayIndex / cardsPerPage));
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
    let message = `Dobrý den, chtěl(a) bych si rezervovat masáž na&nbsp;${date} v&nbsp;čase ${time}.`;

    if (selectedService) {
      message = `Dobrý den, mám zájem o:&nbsp;${selectedService}\n\nRezervace na&nbsp;${date} v&nbsp;${time}`;
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
          Vyberte si termín, který vám vyhovuje, a&nbsp;rezervujte si
          masáž přes&nbsp;WhatsApp
        </motion.p>

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

        <div className="relative">
          <div className="hidden md:block relative">
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
                              className="flex-1 max-w-[220px]"
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

                                <div className="space-y-2 flex-1 flex flex-col justify-center">
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

            {currentPageDesktop < totalPagesDesktop - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none" />
            )}

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

          <div className="md:hidden relative">
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

                        <div className="space-y-2 flex-1 flex flex-col justify-center">
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
                Nenašli jste vhodný termín? Kontaktujte mě a&nbsp;
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
                  Napište mi na&nbsp;WhatsApp
                </span>
              </motion.a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}