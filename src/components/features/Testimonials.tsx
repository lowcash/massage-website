'use client'

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Petra K.',
    rating: 5,
    text: 'Masáž u\u00A0Radky byla naprostým zážitkem. Její přístup je velmi professionální a\u00A0zároveň osobní. Cítila jsem se\u00A0naprosto uvolněná a\u00A0odcázela s\u00A0pocitem, že mi\u00A0bylo věnováno maximum péče.',
    date: '15. října 2024',
  },
  {
    name: 'Martin S.',
    rating: 5,
    text: 'Po\u00A0náročném týdnu jsem potřeboval uvolnit napjaté svaly. Radka má zlaté ruce! Sportovní masáž byla přesně to, co jsem potřeboval. Rozhodně se\u00A0vrátím.',
    date: '8. října 2024',
  },
  {
    name: 'Jana M.',
    rating: 5,
    text: 'Krásné prostředí, skvělá atmosféra a\u00A0hlavně úžasná masáž. Radka má opravdu dar a\u00A0její přístup je velmi empatický. Můžu jen doporučit!',
    date: '2. října 2024',
  },
  {
    name: 'Tomáš V.',
    rating: 5,
    text: 'Lymfatická masáž mi\u00A0pomohla s\u00A0otoky nohou. Radka je velmi šikovná a\u00A0ví, co dělá. Cítím se\u00A0po\u00A0masáži jako nový člověk.',
    date: '25. září 2024',
  },
  {
    name: 'Lucie H.',
    rating: 5,
    text: 'Masáž lávovými kameny byla neskutečným zážitkem. Teplo kamenů a\u00A0Radčiny šikovné ruce dokázaly zázraky. Určitě se\u00A0vrátím!',
    date: '18. září 2024',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isJumping, setIsJumping] = useState(false); // Flag for instant jumps
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Create infinite loop - clone first and last 2 cards
  const cloneCount = 2;
  const extendedTestimonials = [
    ...testimonials.slice(-cloneCount), // Last 2 cards at start
    ...testimonials,                     // Original cards
    ...testimonials.slice(0, cloneCount) // First 2 cards at end
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (currentIndex === testimonials.length) {
      // At end clones, jump to real start
      setTimeout(() => {
        setIsJumping(true);
        setIsTransitioning(false);
        setCurrentIndex(0);
        setTimeout(() => {
          setIsTransitioning(true);
          setIsJumping(false);
        }, 100);
      }, 500);
    } else if (currentIndex === -1) {
      // At start clones, jump to real end
      setTimeout(() => {
        setIsJumping(true);
        setIsTransitioning(false);
        setCurrentIndex(testimonials.length - 1);
        setTimeout(() => {
          setIsTransitioning(true);
          setIsJumping(false);
        }, 100);
      }, 500);
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Testimonial Card Component - Ultra realistic sticky note style
  const TestimonialCard = ({ 
    testimonial, 
    isActive,
    distance 
  }: { 
    testimonial: typeof testimonials[0], 
    isActive: boolean,
    distance: number
  }) => {
    let scale = 100;
    let zIndex = 10;
    
    // Don't apply scaling effects during instant jumps
    if (isJumping) {
      scale = 100;
      zIndex = isActive ? 20 : 10;
    } else if (!isActive) {
      // Neaktivní karty - scale pro depth efekt
      if (distance === 1) {
        scale = 95;
        zIndex = 5;
      } else if (distance === 2) {
        scale = 90;
        zIndex = 3;
      } else {
        scale = 85;
        zIndex = 1;
      }
    } else {
      // Aktivní karta
      scale = 100;
      zIndex = 20;
    }
    
    // Barevné variace pro sticky notes (subtlní rozdíly)
    const cardColors = [
      { bg: '#fffef9', shadow: 'rgba(222, 57, 126, 0.08)' }, // Vanilla s růžovým stínem
      { bg: '#fffdf7', shadow: 'rgba(196, 167, 95, 0.1)' },  // Warm white se zlatým stínem
      { bg: '#fffefa', shadow: 'rgba(222, 57, 126, 0.06)' }, // Soft cream
      { bg: '#fffdfa', shadow: 'rgba(196, 167, 95, 0.08)' }, // Paper white
      { bg: '#fffef8', shadow: 'rgba(222, 57, 126, 0.07)' }, // Light cream
    ];
    
    const cardIndex = testimonials.findIndex(t => t.name === testimonial.name);
    const cardStyle = cardColors[cardIndex % cardColors.length];
    
    // Fixní rotace pro každou kartu - náhodné, ale konzistentní
    const rotations = [-1.5, 1.2, -0.8, 1.5, -1.0];
    const rotation = rotations[cardIndex % rotations.length];
    
    return (
      <div 
        className={`rounded-xl p-8 md:p-10 flex flex-col items-center transition-all duration-500 relative`}
        style={{ 
          opacity: isActive ? 1.0 : 0.85,
          transform: `scale(${scale / 100}) rotate(${rotation}deg)`,
          zIndex,
          width: '100%',
          height: 'fit-content',
          backgroundColor: cardStyle.bg,
          backgroundImage: `
            linear-gradient(135deg, rgba(222, 57, 126, 0.015) 0%, rgba(196, 167, 95, 0.025) 50%, rgba(222, 57, 126, 0.015) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(196, 167, 95, 0.008) 1px, transparent 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(196, 167, 95, 0.008) 1px, transparent 2px),
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(196, 167, 95, 0.04) 0%, transparent 50%)
          `,
          border: 'none',
          boxShadow: isActive 
            ? `
              0 20px 40px rgba(0, 0, 0, 0.15),
              0 12px 25px ${cardStyle.shadow},
              0 6px 12px rgba(196, 167, 95, 0.12),
              0 2px 4px rgba(0, 0, 0, 0.08),
              inset 0 0 0 1px rgba(255, 255, 255, 0.9),
              inset 0 1px 2px rgba(255, 255, 255, 0.95),
              inset 0 -2px 8px rgba(196, 167, 95, 0.08),
              inset 4px 0 8px rgba(196, 167, 95, 0.05),
              inset -4px 0 8px rgba(222, 57, 126, 0.04)
            ` 
            : `
              0 12px 28px rgba(0, 0, 0, 0.12),
              0 6px 14px ${cardStyle.shadow},
              0 2px 6px rgba(196, 167, 95, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.8),
              inset 0 1px 2px rgba(255, 255, 255, 0.85),
              inset 0 -2px 6px rgba(196, 167, 95, 0.06)
            `,
        }}
      >
        {/* Top highlight edge - simuluje světlo na horní hraně papíru */}
        <div 
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-70"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 0.9) 80%, transparent)',
          }}
        />
        
        {/* Bottom edge shadow - simuluje tloušťku papíru */}
        <div 
          className="absolute bottom-0 left-6 right-6 h-[1px] opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(196, 167, 95, 0.4) 20%, rgba(196, 167, 95, 0.4) 80%, transparent)',
            filter: 'blur(0.5px)'
          }}
        />
        
        {/* Bottom left curl effect */}
        <div 
          className="absolute -bottom-1 -left-1 w-8 h-8 opacity-50"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(196, 167, 95, 0.2) 50%)`,
            borderRadius: '0 0 0 50%',
            boxShadow: '-2px 2px 4px rgba(0, 0, 0, 0.15)',
            transform: 'rotate(0deg)',
          }}
        />
        
        {/* Corner fold - top right */}
        <div 
          className="absolute -top-0.5 -right-0.5 overflow-hidden opacity-60"
          style={{ width: '32px', height: '32px' }}
        >
          <div 
            className="absolute top-0 right-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 24px 24px 0',
              borderColor: 'transparent rgba(196, 167, 95, 0.2) transparent transparent',
              filter: 'drop-shadow(-1px 1px 3px rgba(0, 0, 0, 0.15))',
            }}
          />
          {/* Fold inner highlight */}
          <div 
            className="absolute top-0 right-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 20px 20px 0',
              borderColor: 'transparent rgba(255, 255, 255, 0.2) transparent transparent',
            }}
          />
        </div>
        
        <div className="flex gap-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star 
              key={i} 
              className="w-5 h-5 fill-[#c4a75f] text-[#c4a75f]" 
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(196, 167, 95, 0.4))',
              }}
            />
          ))}
        </div>
        
        <p 
          className="text-[#2c2c2c] text-center mb-8 leading-loose text-lg max-w-2xl relative z-10" 
          style={{ 
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
            letterSpacing: '0.01em',
          }}
        >
          &quot;{testimonial.text}&quot;
        </p>
        
        <div className="text-center pt-6 w-full relative"
          style={{
            borderTop: '1px solid rgba(222, 57, 126, 0.15)',
          }}
        >
          {/* Subtle gradient on divider */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(222, 57, 126, 0.3), transparent)',
            }}
          />
          
          <p 
            className="text-[#de397e] mb-1" 
            style={{ 
              fontFamily: 'Dancing Script', 
              fontSize: '1.35rem', 
              textShadow: '0 1px 3px rgba(222, 57, 126, 0.2)',
              filter: 'drop-shadow(0 1px 2px rgba(222, 57, 126, 0.12))',
            }}
          >
            {testimonial.name}
          </p>
          <p className="text-[#888888] text-sm" style={{ letterSpacing: '0.02em' }}>
            {testimonial.date}
          </p>
        </div>
        
        {/* Paper grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-xl"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #000 0.5px, transparent 0.5px),
              radial-gradient(circle at 80% 50%, #000 0.5px, transparent 0.5px)
            `,
            backgroundSize: '16px 16px, 20px 20px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />
        
        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(196, 167, 95, 0.03) 100%)',
          }}
        />
      </div>
    );
  };

  return (
    <section 
      id="testimonials" 
      className="py-32 px-6 md:px-16 bg-linear-to-b from-[#fef8fb] to-white overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          className="text-center text-[#de397e] mb-6 tracking-wider"
          style={{
            fontFamily: "Dancing Script",
            fontSize: "2.2rem",
          }}
        >
          Co říkají klienti
        </h2>

        <p
          className="text-center text-[#666666] mb-16 max-w-2xl mx-auto leading-loose"
        >
          Přečtěte si zkušenosti našich spokojených klientů
        </p>

        {/* Carousel Container - stejná logika jako kalendář */}
        <div className="relative">
          {/* Previous Arrow - desktop only (lg+) */}
          <button
            onClick={goToPrevious}
            className="hidden lg:block absolute left-42 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-lg border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 cursor-pointer"
            aria-label="Předchozí recenze"
          >
            <ChevronLeft className="w-6 h-6 text-[#de397e]" />
          </button>

          {/* Fade gradient on left edge - wider and smoother */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-linear-to-r from-[#fef8fb] via-[#fef8fb]/60 to-transparent z-10 pointer-events-none hidden md:block" />

          <div className="overflow-hidden px-0 sm:px-20 lg:px-52 py-16" style={{ touchAction: 'pan-y' }} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <motion.div
              animate={{ 
                x: `calc(-${(currentIndex + cloneCount) * 100}%)`  // Posun započítává klony na začátku
              }}
              transition={isTransitioning ? { 
                type: 'spring', 
                stiffness: 200,
                damping: 35,
                mass: 1.2
              } : {
                duration: 0
              }}
              className="flex items-center"
            >
              {extendedTestimonials.map((testimonial, index) => {
                const adjustedCurrentIndex = currentIndex + cloneCount;
                const isActive = index === adjustedCurrentIndex;
                return (
                  <div
                    key={index}
                    className="shrink-0 flex justify-center"
                    style={{ width: '100%' }}
                  >
                    <div className="w-full max-w-2xl lg:max-w-2xl xl:max-w-3xl px-4">  {/* Responsive max-width */}
                      <TestimonialCard 
                        testimonial={testimonial} 
                        isActive={isActive}
                        distance={Math.abs(index - adjustedCurrentIndex)}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Fade gradient on right edge - wider and smoother */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-linear-to-l from-white via-white/60 to-transparent z-10 pointer-events-none hidden md:block" />

          {/* Next Arrow - desktop only (lg+) */}
          <button
            onClick={goToNext}
            className="hidden lg:block absolute right-42 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-lg border border-white/40 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg z-20 cursor-pointer"
            aria-label="Další recenze"
          >
            <ChevronRight className="w-6 h-6 text-[#de397e]" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index
                    ? 'w-8 bg-[#de397e]'
                    : 'w-2 bg-[#de397e]/30 hover:bg-[#de397e]/50'
                }`}
                aria-label={`Přejít na recenzi ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}