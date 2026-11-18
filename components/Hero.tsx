"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { CAFE_CONFIG, type Product, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

interface HeroProps {
  featuredItems: Product[];
}

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function Hero({ featuredItems }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Subscribe to prefers-reduced-motion using React's useSyncExternalStore
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Touch coordinates for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = featuredItems.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play slideshow timer
  useEffect(() => {
    if (prefersReducedMotion || isPaused || totalSlides <= 1) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, totalSlides, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      // Swiped left -> next
      nextSlide();
    } else if (distance < -swipeThreshold) {
      // Swiped right -> prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (totalSlides === 0) {
    return (
      <header className="relative w-full h-[280px] sm:h-[340px] md:h-[420px] bg-espresso text-cream flex items-center justify-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream tracking-wide text-center">
          {CAFE_CONFIG.name}
        </h1>
      </header>
    );
  }

  const currentItem = featuredItems[currentIndex];

  return (
    <header
      className="relative w-full h-[280px] sm:h-[350px] md:h-[430px] overflow-hidden select-none bg-espresso"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Specials Slideshow"
    >
      {/* Background Slides */}
      {featuredItems.map((item, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              prefersReducedMotion
                ? isActive
                  ? "opacity-100"
                  : "opacity-0"
                : "duration-1000"
            } ${isActive ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
            aria-hidden={!isActive}
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              priority={idx === 0}
              placeholder="blur"
              blurDataURL={WARM_PLACEHOLDER_BLUR}
              className="object-cover object-center transform scale-105"
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* Warm espresso-brown overlay to ensure high contrast and readable text */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 via-espresso/70 to-espresso/85 z-10" />

      {/* Centered Business Name & Café Ambience Content */}
      <div className="relative z-20 h-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Subtle decorative motif */}
        <span className="text-caramel text-xs sm:text-sm tracking-[0.25em] uppercase font-sans font-medium mb-1.5 opacity-90">
          Handcrafted Daily
        </span>

        {/* Business Name from central config in cream Playfair Display */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-cream tracking-tight drop-shadow-sm">
          {CAFE_CONFIG.name}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="mt-2 text-sm sm:text-base text-cream/85 font-sans max-w-md sm:max-w-lg font-light tracking-wide line-clamp-2">
          {CAFE_CONFIG.tagline}
        </p>

        {/* Current featured slide indicator caption */}
        {currentItem && (
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-espresso/60 border border-caramel/30 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
            <span className="text-xs text-cream/90 font-sans tracking-wide">
              Featured: {currentItem.name}
            </span>
          </div>
        )}

        {/* Small Dot Indicators */}
        <nav
          className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center gap-2.5 z-20"
          aria-label="Slideshow slide selectors"
        >
          {featuredItems.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                type="button"
                className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel ${
                  isActive
                    ? "w-7 h-2 bg-caramel rounded-full"
                    : "w-2 h-2 bg-cream/40 hover:bg-cream/70"
                }`}
                aria-label={`Go to slide ${idx + 1}: ${item.name}`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </nav>
      </div>
    </header>
  );
}
