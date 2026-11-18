"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { specials, PLACEHOLDER_IMAGE } from "@/data/specials";
import { CAFE_CONFIG, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

// Parallax speed variants for the background (moves slower, 25% distance)
const backgroundVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "25%" : "-25%",
    scale: 1.1,
    opacity: 0,
  }),
  center: {
    x: "0%",
    scale: 1.04,
    opacity: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.8 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-25%" : "25%",
    scale: 1.0,
    opacity: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.4 },
    },
  }),
};

// Parallax speed variants for the text & foreground (moves faster, 75% distance)
const textVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "75%" : "-75%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 26 },
      opacity: { duration: 0.4, delay: 0.05 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-75%" : "75%",
    opacity: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 26 },
      opacity: { duration: 0.3 },
    },
  }),
};

export function ScrollHero() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const shouldReduceMotion = useReducedMotion() ?? false;
  const totalSlides = specials.length;

  // Normalized current slide index
  const currentIndex = ((page % totalSlides) + totalSlides) % totalSlides;
  const currentSpecial = specials[currentIndex];

  // Motion value for active drag tracking to give immediate real-time parallax feedback
  const dragX = useMotionValue(0);

  // Background moves at 1/4 the rate of drag (subtle depth)
  const bgDragOffset = useTransform(dragX, [-300, 300], ["-8%", "8%"]);
  // Foreground text moves at 1/2 the rate of drag (feels close to camera)
  const textDragOffset = useTransform(dragX, [-300, 300], ["-35%", "35%"]);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setPage((prev) => prev + newDirection);
    },
    []
  );

  const goToSlide = (idx: number) => {
    const diff = idx - currentIndex;
    if (diff === 0) return;
    setDirection(diff > 0 ? 1 : -1);
    setPage((prev) => prev + diff);
  };

  // Auto-play every 6 seconds, pauses on hover or user interaction
  useEffect(() => {
    if (isPaused || shouldReduceMotion || totalSlides <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, totalSlides, paginate]);

  // Handle drag / swipe release
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    const velocityThreshold = 250;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      // Swiped left -> show next special
      paginate(1);
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      // Swiped right -> show prev special
      paginate(-1);
    }
  };

  return (
    <header
      className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden select-none bg-espresso"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Handcrafted Specials Showcase - Swipe left or right to explore"
    >
      {/* Interactive Draggable / Swipeable Area */}
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        drag={shouldReduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        <AnimatePresence initial={false} custom={direction}>
          {/* ==================================================== */}
          {/* LAYER 1: PARALLAX BACKGROUND (MOVES SLOWER)          */}
          {/* ==================================================== */}
          <motion.div
            key={`bg-${currentIndex}`}
            custom={direction}
            variants={shouldReduceMotion ? undefined : backgroundVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ x: shouldReduceMotion ? 0 : bgDragOffset }}
            className="absolute inset-y-0 -left-[12%] -right-[12%] w-[124%] h-full pointer-events-none"
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

        {/* Ambient Warm Gradient Overlays for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/70 to-espresso/50 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />

        {/* ==================================================== */}
        {/* LAYER 2: PARALLAX FOREGROUND CONTENT (MOVES FASTER)  */}
        {/* ==================================================== */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`text-${currentIndex}`}
            custom={direction}
            variants={shouldReduceMotion ? undefined : textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ x: shouldReduceMotion ? 0 : textDragOffset }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-14 pointer-events-none"
          >
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              {/* Category / Special Tag Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wide uppercase bg-caramel text-warm-white shadow-md mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {currentSpecial.tag}
              </div>

              {/* Special Title */}
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-normal tracking-wide drop-shadow-md leading-tight">
                {currentSpecial.name}
              </h2>

              {/* Mouth-watering Description */}
              <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-base text-cream/90 font-sans max-w-lg leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-3">
                {currentSpecial.description}
              </p>

              {/* Price & Feature Callout */}
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
      {/* DESKTOP PREV / NEXT PARALLAX SWIPE BUTTONS           */}
      {/* ==================================================== */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-espresso/60 hover:bg-espresso/90 text-cream/80 hover:text-warm-white border border-caramel/30 backdrop-blur-xs items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        aria-label="Previous special"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={() => paginate(1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-espresso/60 hover:bg-espresso/90 text-cream/80 hover:text-warm-white border border-caramel/30 backdrop-blur-xs items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        aria-label="Next special"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ==================================================== */}
      {/* MOBILE SWIPE HINT & BOTTOM PROGRESS INDICATOR        */}
      {/* ==================================================== */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex flex-col items-center gap-2 pointer-events-none">
        {/* Subtle Swipe Left Cue for Touch Screens */}
        <div className="sm:hidden flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-cream/60 font-medium">
          <span>Swipe left for next</span>
          <ArrowRight className="w-3 h-3 text-caramel animate-pulse" />
        </div>

        {/* Slide Dots / Pill Indicators */}
        <nav
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso/60 backdrop-blur-xs border border-caramel/25 shadow-md pointer-events-auto"
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
                      : "w-2 h-2 bg-cream/35 group-hover:bg-cream/70"
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
