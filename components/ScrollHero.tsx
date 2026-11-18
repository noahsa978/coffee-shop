"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { specials, PLACEHOLDER_IMAGE } from "@/data/specials";
import { CAFE_CONFIG, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

export function ScrollHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const shouldReduceMotion = useReducedMotion() ?? false;
  const totalSlides = specials.length;
  const currentSpecial = specials[currentIndex];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prev) => (prev + newDirection + totalSlides) % totalSlides);
    },
    [totalSlides]
  );

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Auto-play every 6 seconds, pauses on hover or touch
  useEffect(() => {
    if (isPaused || shouldReduceMotion || totalSlides <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, totalSlides, paginate]);

  // Handle swipe left / right with clean threshold
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 40;
    const velocityThreshold = 200;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      // Swiped left -> next special
      paginate(1);
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      // Swiped right -> prev special
      paginate(-1);
    }
  };

  return (
    <header
      className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden select-none bg-espresso touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Handcrafted Specials Showcase - Swipe left or right to explore"
    >
      {/* Interactive Draggable / Swipeable Surface (touch-pan-y allows 100% smooth vertical scrolling) */}
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        drag={shouldReduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={handleDragEnd}
      >
        {/* ==================================================== */}
        {/* LAYER 1: BACKGROUND PHOTO (SLOWER PARALLAX: 15%)     */}
        {/* ==================================================== */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`bg-${currentIndex}`}
            custom={direction}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    x: direction > 0 ? "15%" : "-15%",
                    opacity: 0,
                  }
            }
            animate={{
              x: "0%",
              opacity: 1,
              transition: {
                x: { type: "spring", stiffness: 240, damping: 28 },
                opacity: { duration: 0.45 },
              },
            }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    x: direction > 0 ? "-15%" : "15%",
                    opacity: 0,
                    transition: {
                      x: { type: "spring", stiffness: 240, damping: 28 },
                      opacity: { duration: 0.35 },
                    },
                  }
            }
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          >
            <Image
              src={
                imgErrorMap[currentSpecial.id]
                  ? PLACEHOLDER_IMAGE
                  : currentSpecial.imageUrl || PLACEHOLDER_IMAGE
              }
              alt={currentSpecial.name}
              fill
              priority={currentIndex === 0}
              placeholder="blur"
              blurDataURL={WARM_PLACEHOLDER_BLUR}
              onError={() =>
                setImgErrorMap((prev) => ({
                  ...prev,
                  [currentSpecial.id]: true,
                }))
              }
              className="object-cover object-center scale-105"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Dark Café Gradient Overlays for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/45 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />

        {/* ==================================================== */}
        {/* LAYER 2: FOREGROUND CARD (FASTER PARALLAX: 60%)      */}
        {/* ==================================================== */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`content-${currentIndex}`}
            custom={direction}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    x: direction > 0 ? "60%" : "-60%",
                    opacity: 0,
                  }
            }
            animate={{
              x: "0%",
              opacity: 1,
              transition: {
                x: { type: "spring", stiffness: 240, damping: 26 },
                opacity: { duration: 0.4, delay: 0.05 },
              },
            }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    x: direction > 0 ? "-60%" : "60%",
                    opacity: 0,
                    transition: {
                      x: { type: "spring", stiffness: 240, damping: 26 },
                      opacity: { duration: 0.3 },
                    },
                  }
            }
            className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-8 pointer-events-none will-change-transform"
          >
            {/* Elegant Café Showcase Card (No expensive backdrop-blur, uses high-performance rgba to prevent scroll repaint jank) */}
            <div className="relative max-w-xl sm:max-w-2xl w-full mx-auto p-6 sm:p-9 rounded-3xl bg-[#2D1B13]/88 border border-caramel/25 shadow-2xl flex flex-col items-center text-center">
              {/* Badge & Slide Counter */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-sans font-mono tracking-widest text-cream/70 uppercase">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </span>
                <span className="w-1 h-1 rounded-full bg-caramel" />
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-sans font-semibold tracking-wide uppercase bg-caramel text-warm-white shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentSpecial.tag}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-cream font-normal tracking-wide leading-tight drop-shadow-sm">
                {currentSpecial.name}
              </h2>

              {/* Description */}
              <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-cream/90 font-sans leading-relaxed max-w-lg">
                {currentSpecial.description}
              </p>

              {/* Price & Highlight */}
              <div className="mt-4 sm:mt-5 flex items-baseline gap-2.5">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-caramel font-semibold">
                  Today&apos;s Feature
                </span>
                <span className="text-2xl sm:text-3xl font-serif text-warm-white font-medium">
                  {CAFE_CONFIG.currencySymbol}
                  {currentSpecial.price.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ==================================================== */}
      {/* DESKTOP PREV / NEXT BUTTONS                          */}
      {/* ==================================================== */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-espresso/70 hover:bg-espresso text-cream/80 hover:text-warm-white border border-caramel/30 items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
        aria-label="Previous special"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={() => paginate(1)}
        className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-espresso/70 hover:bg-espresso text-cream/80 hover:text-warm-white border border-caramel/30 items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
        aria-label="Next special"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ==================================================== */}
      {/* BOTTOM PROGRESS NAVIGATION & MOBILE SWIPE HINT       */}
      {/* ==================================================== */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex flex-col items-center gap-2 pointer-events-none">
        {/* Subtle Mobile Swipe Cue */}
        <div className="sm:hidden flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-cream/70 font-medium">
          <span>Swipe left for next</span>
          <ArrowRight className="w-3 h-3 text-caramel animate-pulse" />
        </div>

        {/* Slide Indicator Dots */}
        <nav
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso/80 border border-caramel/25 shadow-lg pointer-events-auto"
          aria-label="Specials carousel slide selectors"
        >
          {specials.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className="p-1 focus:outline-none cursor-pointer group"
                aria-label={`Go to slide ${idx + 1}: ${item.name}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-6 h-2 bg-caramel ring-2 ring-caramel/40"
                      : "w-2 h-2 bg-cream/40 group-hover:bg-cream/75"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
