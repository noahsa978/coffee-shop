"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Sparkles, Coffee } from "lucide-react";
import { specials, PLACEHOLDER_IMAGE, type SpecialItem } from "@/data/specials";
import { CAFE_CONFIG, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

const INTRO_CAFE_NAME = "Your Cafe Name";
const INTRO_SLOGAN = "Where every cup feels like home.";

interface HorizontalSpecialPanelProps {
  item: SpecialItem;
  index: number;
  totalPanels: number;
  scrollYProgress: MotionValue<number>;
  shouldReduceMotion: boolean;
}

function HorizontalSpecialPanel({
  item,
  index,
  totalPanels,
  scrollYProgress,
  shouldReduceMotion,
}: HorizontalSpecialPanelProps) {
  const [imgError, setImgError] = useState(false);

  // Panel index 1 to 8 (Intro is 0)
  const panelIndex = index + 1;
  const panelStart = Math.max(0, (panelIndex - 1) / (totalPanels - 1));
  const panelEnd = Math.min(1, (panelIndex + 1) / (totalPanels - 1));

  // Subtle counter-parallax for background image as panel slides horizontally
  const bgX = useTransform(
    scrollYProgress,
    [panelStart, panelEnd],
    shouldReduceMotion ? ["0%", "0%"] : ["6%", "-6%"]
  );

  return (
    <div
      className="relative w-screen h-full shrink-0 overflow-hidden flex items-center justify-center select-none"
      aria-label={`${item.name} special showcase`}
    >
      {/* Background Image with horizontal parallax */}
      <motion.div
        style={{ x: bgX }}
        className="absolute inset-y-0 -left-[10%] -right-[10%] w-[120%] h-full"
      >
        <Image
          src={imgError ? PLACEHOLDER_IMAGE : item.imageUrl || PLACEHOLDER_IMAGE}
          alt={item.name}
          fill
          priority={index === 0}
          placeholder="blur"
          blurDataURL={WARM_PLACEHOLDER_BLUR}
          onError={() => setImgError(true)}
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/75 to-espresso/60 z-10" />
      <div className="absolute inset-0 bg-black/25 z-10" />

      {/* Slide Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center">
        {/* Counter Badge: 01 / 08 */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-[11px] font-sans font-mono tracking-widest text-cream/60 uppercase">
            Special {String(index + 1).padStart(2, "0")} / {String(specials.length).padStart(2, "0")}
          </span>
          <span className="w-1 h-1 rounded-full bg-caramel" />
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-sans font-semibold tracking-wide uppercase bg-caramel text-warm-white shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-normal tracking-wide drop-shadow-md leading-tight max-w-2xl">
          {item.name}
        </h2>

        {/* Description */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-cream/90 font-sans max-w-xl leading-relaxed drop-shadow-xs">
          {item.description}
        </p>

        {/* Price & Accent */}
        <div className="mt-5 sm:mt-7 flex items-baseline gap-2.5">
          <span className="text-xs uppercase tracking-wider text-caramel font-semibold">
            Today&apos;s Feature
          </span>
          <span className="text-2xl sm:text-4xl font-serif text-warm-white font-medium">
            {CAFE_CONFIG.currencySymbol}
            {item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Total panels: 1 Intro Panel + N Specials = 9 panels
  const totalPanels = specials.length + 1;

  // Track vertical page scroll through this outer container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform vertical scroll progress (0 -> 1) into horizontal translation (0vw -> -(totalPanels-1)*100vw)
  const maxHorizontalShift = (totalPanels - 1) * 100;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion
      ? ["0vw", "0vw"]
      : ["0vw", `-${maxHorizontalShift}vw`]
  );

  // Active panel index for pagination indicator
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const panel = Math.min(
        Math.floor(latest * totalPanels + 0.3),
        totalPanels - 1
      );
      setActivePanel(panel);
    });
    return () => unsubscribe();
  }, [scrollYProgress, totalPanels]);

  // Prompt cue opacity on Intro panel: fades out as soon as scrolling starts
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Smooth scroll helper when clicking pagination dots
  const scrollToPanel = (panelIndex: number) => {
    if (!containerRef.current) return;
    const containerTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll =
      containerTop + (panelIndex / (totalPanels - 1)) * scrollDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      style={{ height: `${totalPanels * 100}vh` }}
      className="relative w-full"
      aria-label="Horizontal Café Specials Showcase"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-espresso">
        {/* ==================================================== */}
        {/* HORIZONTAL SLIDING TRACK                             */}
        {/* ==================================================== */}
        <motion.div
          style={{ x }}
          className="flex h-full will-change-transform"
        >
          {/* -------------------------------------------------- */}
          {/* PANEL 0: INTRO PANEL                               */}
          {/* -------------------------------------------------- */}
          <div className="relative w-screen h-full shrink-0 flex flex-col items-center justify-center text-center px-6 select-none bg-espresso">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-radial from-espresso/80 via-espresso to-[#22130C] z-0" />

            {/* Café Icon Badge */}
            <div className="relative z-10 mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-caramel/20 border border-caramel/30 flex items-center justify-center text-caramel mx-auto shadow-inner">
                <Coffee className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
              </div>
            </div>

            {/* Cafe Name */}
            <h1 className="relative z-10 font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-cream font-normal tracking-wide drop-shadow-md">
              {INTRO_CAFE_NAME}
            </h1>

            {/* Slogan */}
            <p className="relative z-10 mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl text-caramel font-serif italic max-w-xl">
              {INTRO_SLOGAN}
            </p>

            <p className="relative z-10 mt-2 text-xs sm:text-sm text-cream/70 font-sans tracking-widest uppercase">
              Handcrafted Coffee &amp; Artisan Bakehouse
            </p>

            {/* Horizontal Scroll Prompt at Bottom */}
            <motion.div
              style={{ opacity: cueOpacity }}
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { x: [0, 8, 0] }
                }
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-espresso/60 backdrop-blur-xs border border-caramel/30 shadow-lg"
              >
                <span className="text-[11px] sm:text-xs font-sans tracking-[0.2em] uppercase text-cream/90 font-medium">
                  Scroll down to explore specials
                </span>
                <ArrowRight className="w-4 h-4 text-caramel" />
              </motion.div>
            </motion.div>
          </div>

          {/* -------------------------------------------------- */}
          {/* PANELS 1 TO 8: SPECIALS MAPPED FROM data/specials   */}
          {/* -------------------------------------------------- */}
          {specials.map((item, idx) => (
            <HorizontalSpecialPanel
              key={item.id}
              item={item}
              index={idx}
              totalPanels={totalPanels}
              scrollYProgress={scrollYProgress}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>

        {/* ==================================================== */}
        {/* BOTTOM HORIZONTAL PROGRESS NAVIGATION BAR            */}
        {/* ==================================================== */}
        <aside
          aria-label="Specials horizontal navigation"
          className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso/70 backdrop-blur-md border border-caramel/25 shadow-xl select-none"
        >
          {Array.from({ length: totalPanels }).map((_, pIdx) => {
            const isActive = activePanel === pIdx;
            const label =
              pIdx === 0
                ? "Intro"
                : specials[pIdx - 1]?.name || `Special ${pIdx}`;

            return (
              <button
                key={pIdx}
                type="button"
                onClick={() => scrollToPanel(pIdx)}
                title={label}
                aria-label={`Jump to ${label}`}
                className="group relative p-1.5 focus:outline-none cursor-pointer"
              >
                {/* Tooltip on Hover */}
                <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-espresso border border-caramel/30 text-[10px] font-sans text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                  {label}
                </span>

                {/* Pill / Dot */}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-6 h-2 bg-caramel ring-2 ring-caramel/40"
                      : "w-2 h-2 bg-cream/35 hover:bg-cream/70"
                  }`}
                />
              </button>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
