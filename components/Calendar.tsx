"use client";

import React, { useState, useRef, useEffect } from "react";

// Helper function to get date string
const getDateString = (addDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + addDays);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
};

// Helper to check if date is today
const isToday = (dateString: string) => {
  const today = new Date().toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
  return dateString === today;
};

// Mock available times with some unavailable slots
const generateMockTimes = () => {
  const times = [];
  const totalSlots = Math.floor(Math.random() * 5) + 2; // 2-6 slots
  const startHour = 9;

  for (let i = 0; i < totalSlots; i++) {
    const hour = startHour + Math.floor(Math.random() * 8); // 9am to 5pm
    const isAvailable = Math.random() > 0.3; // 30% chance of being unavailable
    times.push({ time: `${hour}:00`, available: isAvailable });
    if (Math.random() > 0.5) {
      const isHalfAvailable = Math.random() > 0.3; // 30% chance of being unavailable
      times.push({ time: `${hour}:30`, available: isHalfAvailable });
    }
  }

  return times.sort((a, b) => a.time.localeCompare(b.time));
};

// Generate mock data for entire month
const generateMonthData = () => {
  const monthData = [];
  for (let i = 0; i < 30; i++) {
    monthData.push({
      date: getDateString(i),
      times: generateMockTimes(),
    });
  }
  return monthData;
};

const monthData = generateMonthData();

const Calendar = () => {
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const visibleDays = 5; // Show 5 days at once
  const totalPages = Math.ceil(monthData.length / visibleDays);
  const timeBlocksRefs = useRef<(HTMLDivElement | null)[][]>([]);

  const scrollToContact = () => {
    const element = document.getElementById("o-mne");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && displayStartIndex >= visibleDays) {
      setDisplayStartIndex(displayStartIndex - visibleDays);
      setActivePage(activePage - 1);
    } else if (
      direction === "next" &&
      displayStartIndex + visibleDays < monthData.length
    ) {
      setDisplayStartIndex(displayStartIndex + visibleDays);
      setActivePage(activePage + 1);
    }
  };

  const visibleDaysData = monthData.slice(
    displayStartIndex,
    displayStartIndex + visibleDays
  );

  // Calculate the height of the tallest day column
  useEffect(() => {
    // Reset references array for the current visible days
    timeBlocksRefs.current = visibleDaysData.map(() => []);

    // Wait for render to complete
    setTimeout(() => {
      const heights = visibleDaysData.map((_, dayIndex) => {
        const dayHeight =
          timeBlocksRefs.current[dayIndex]?.reduce((height, ref) => {
            if (!ref) return height;
            return height + ref.offsetHeight + 8; // 8px for gap
          }, 0) || 0;

        return dayHeight;
      });

      const maxColumnHeight = Math.max(...heights, 200); // Minimum height of 200px

      // Add some padding
      setMaxHeight(maxColumnHeight > 0 ? maxColumnHeight + 24 : 200);
    }, 100);
  }, [visibleDaysData]);

  return (
    <section id="kalendar" className="py-20 px-4 bg-studio-beige">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">Kalendář</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-sans">
            Vyberte si volný termín pro vaši relaxační proceduru.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto calendar-container">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white rounded-full p-2 shadow-md z-10 text-bc6290 hover:text-studio-gold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleNavigation("prev")}
            disabled={displayStartIndex === 0}
            aria-label="Předchozí týden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="calendar-scroll-area">
            <div className="flex gap-4 py-4 justify-center">
              {visibleDaysData.map((day, dayIndex) => (
                <div key={dayIndex} className="flex-shrink-0 w-40">
                  <div
                    className={`bg-white rounded-2xl shadow-sm p-4 h-full transition-all ${
                      isToday(day.date) ? "current-day" : ""
                    }`}
                  >
                    <div
                      className={`text-center border-b pb-2 mb-3 ${
                        isToday(day.date) ? "border-bc6290" : "border-gray-100"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          isToday(day.date) ? "text-bc6290" : "text-gray-700"
                        }`}
                      >
                        {day.date}
                      </p>
                    </div>

                    {day.times.length > 0 ? (
                      <div
                        className="flex flex-col items-center space-y-2"
                        style={{ minHeight: `${maxHeight}px` }}
                      >
                        {day.times.map((timeObj, timeIndex) => (
                          <div
                            key={timeIndex}
                            ref={(el) => {
                              if (!timeBlocksRefs.current[dayIndex]) {
                                timeBlocksRefs.current[dayIndex] = [];
                              }
                              timeBlocksRefs.current[dayIndex][timeIndex] = el;
                            }}
                            className={`time-block w-full flex justify-center ${
                              timeObj.available
                                ? "time-block-available"
                                : "time-block-unavailable"
                            }`}
                            onClick={
                              timeObj.available ? scrollToContact : undefined
                            }
                          >
                            <span>{timeObj.time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-gray-400 text-sm font-sans">
                        Žádné volné termíny
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white rounded-full p-2 shadow-md z-10 text-bc6290 hover:text-studio-gold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleNavigation("next")}
            disabled={displayStartIndex + visibleDays >= monthData.length}
            aria-label="Další týden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Page indicator dots */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`calendar-indicator ${
                activePage === index ? "calendar-indicator-active" : ""
              }`}
              onClick={() => {
                setDisplayStartIndex(index * visibleDays);
                setActivePage(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
