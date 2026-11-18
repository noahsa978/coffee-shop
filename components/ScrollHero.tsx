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
import { ChevronDown, Sparkles, Coffee } from "lucide-react";
import { specials, PLACEHOLDER_IMAGE, type SpecialItem } from "@/data/specials";
import { CAFE_CONFIG, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

// Constant for café name in intro frame as required
const INTRO_CAFE_NAME = "Your Cafe Name";
const INTRO_SLOGAN = "Where every cup feels like home.";

interface SpecialFrameProps {
  item: SpecialItem;
  index: number;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
  shouldReduceMotion: boolean;
}

function SpecialFrame({
  item,
  index,
  totalSections,
  scrollYProgress,
  shouldReduceMotion,
}: SpecialFrameProps) {
  const [imgError, setImgError] = useState(false);

  // Calculate timing intervals for this frame with guaranteed ascending order
  const isFirst = index === 0;
  const isLast = index === specials.length - 1;

  const segmentSize = 1 / totalSections;
  const startFadeIn = (index + 0.2) * segmentSize;
  const fullIn = (index + 0.6) * segmentSize;
  const startFadeOut = (index + 1.2) * segmentSize;
  const fullOut = Math.min(1, (index + 1.6) * segmentSize);

  const metaStartFadeIn = (index + 0.3) * segmentSize;
  const metaFullIn = (index + 0.7) * segmentSize;

  // Frame visibility opacity
  const frameOpacity = useTransform(
    scrollYProgress,
    isLast
      ? [startFadeIn, fullIn, 1]
      : [startFadeIn, fullIn, startFadeOut, fullOut],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Parallax: Background Image moves slowest, slight zoom-in
  const bgY = useTransform(
    scrollYProgress,
    [startFadeIn, isLast ? 1 : fullOut],
    shouldReduceMotion ? ["0%", "0%"] : ["-4%", "4%"]
  );
  const bgScale = useTransform(
    scrollYProgress,
    [startFadeIn, isLast ? 1 : fullOut],
    shouldReduceMotion ? [1, 1] : [1.05, 1.15]
  );

  // Parallax: Title moves faster, slides up and fades in
  const titleY = useTransform(
    scrollYProgress,
    isLast
      ? [startFadeIn, fullIn, 1]
      : [startFadeIn, fullIn, startFadeOut, fullOut],
    isLast
      ? shouldReduceMotion
        ? [0, 0, 0]
        : [40, 0, 0]
      : shouldReduceMotion
      ? [0, 0, 0, 0]
      : [40, 0, 0, -25]
  );
  const titleOpacity = useTransform(
    scrollYProgress,
    isLast
      ? [startFadeIn, fullIn, 1]
      : [startFadeIn, fullIn, startFadeOut, fullOut],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Parallax: Description, price, and tag badge: medium speed, slightly delayed
  const metaY = useTransform(
    scrollYProgress,
    isLast
      ? [metaStartFadeIn, metaFullIn, 1]
      : [metaStartFadeIn, metaFullIn, startFadeOut, fullOut],
    isLast
      ? shouldReduceMotion
        ? [0, 0, 0]
        : [30, 0, 0]
      : shouldReduceMotion
      ? [0, 0, 0, 0]
      : [30, 0, 0, -15]
  );
  const metaOpacity = useTransform(
    scrollYProgress,
    isLast
      ? [metaStartFadeIn, metaFullIn, 1]
      : [metaStartFadeIn, metaFullIn, startFadeOut, fullOut],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity: frameOpacity }}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden={false}
    >
      {/* Background Image (slightly larger for parallax zoom) */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
        }}
        className="absolute inset-[-6%] w-[112%] h-[112%]"
      >
        <Image
          src={imgError ? PLACEHOLDER_IMAGE : item.imageUrl || PLACEHOLDER_IMAGE}
          alt={item.name}
          fill
          priority={isFirst}
          placeholder="blur"
          blurDataURL={WARM_PLACEHOLDER_BLUR}
          onError={() => setImgError(true)}
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark gradient overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/70 to-espresso/60 z-10" />
      <div className="absolute inset-0 bg-black/25 z-10" />

      {/* Frame Content */}
      <div className="relative z-20 h-full max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center">
        {/* Special Tag Badge */}
        <motion.div
          style={{ y: metaY, opacity: metaOpacity }}
          className="mb-3"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wide uppercase bg-caramel text-warm-white shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            {item.tag}
          </span>
        </motion.div>

        {/* Title: Slides up & fades in */}
        <motion.h2
          style={{ y: titleY, opacity: titleOpacity }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-normal tracking-wide drop-shadow-md leading-tight max-w-2xl"
        >
          {item.name}
        </motion.h2>

        {/* Description: Medium speed, slightly delayed */}
        <motion.p
          style={{ y: metaY, opacity: metaOpacity }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-cream/90 font-sans max-w-xl leading-relaxed drop-shadow-xs"
        >
          {item.description}
        </motion.p>

        {/* Price & Accent */}
        <motion.div
          style={{ y: metaY, opacity: metaOpacity }}
          className="mt-4 sm:mt-6 flex items-baseline gap-2"
        >
          <span className="text-xs uppercase tracking-wider text-caramel font-semibold">
            Today&apos;s Feature
          </span>
          <span className="text-2xl sm:text-3xl font-serif text-warm-white font-medium">
            {CAFE_CONFIG.currencySymbol}
            {item.price.toFixed(2)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Total sections: 1 Intro Frame + N Specials
  const totalSections = specials.length + 1;

  // useScroll on outer section with offset ["start start", "end end"]
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active frame index for progress indicator
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map 0..1 to 0..totalSections - 1
      const frame = Math.min(
        Math.floor(latest * totalSections),
        totalSections - 1
      );
      setActiveFrame(frame);
    });
    return () => unsubscribe();
  }, [scrollYProgress, totalSections]);

  // Frame 0 (Intro): Opacity fades out as scrolling progresses
  const introFadeThreshold = 0.85 / totalSections;
  const introOpacity = useTransform(
    scrollYProgress,
    [0, introFadeThreshold * 0.5, introFadeThreshold],
    [1, 0.8, 0]
  );
  const introScale = useTransform(
    scrollYProgress,
    [0, introFadeThreshold],
    shouldReduceMotion ? [1, 1] : [1, 0.96]
  );

  // Bobbing cue at bottom center: fades out as soon as scrolling starts
  const cueOpacity = useTransform(scrollYProgress, [0, 0.035], [1, 0]);

  // Smooth scroll helper when clicking right progress indicator
  const scrollToFrame = (frameIndex: number) => {
    if (!containerRef.current) return;
    const containerTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY;
    const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll =
      containerTop + (frameIndex / (totalSections - 1)) * containerHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      style={{ height: `${totalSections * 100}vh` }}
      className="relative w-full"
      aria-label="Interactive Café Specials Showcase"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-espresso">
        {/* ==================================================== */}
        {/* FRAME 0: INTRO FRAME                                 */}
        {/* ==================================================== */}
        <motion.div
          style={{ opacity: introOpacity, scale: introScale }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 select-none"
        >
          {/* Subtle Café Ambient Background */}
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

          {/* Bobbing "Scroll to see specials" cue at bottom center */}
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, 8, 0] }
              }
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-[11px] sm:text-xs font-sans tracking-[0.2em] uppercase text-cream/80 font-medium">
                Scroll to see specials
              </span>
              <ChevronDown className="w-5 h-5 text-caramel" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ==================================================== */}
        {/* FRAMES 1 TO 8: SPECIALS MAPPED FROM data/specials.ts */}
        {/* ==================================================== */}
        {specials.map((item, idx) => (
          <SpecialFrame
            key={item.id}
            item={item}
            index={idx}
            totalSections={totalSections}
            scrollYProgress={scrollYProgress}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}

        {/* ==================================================== */}
        {/* RIGHT SIDE PROGRESS INDICATOR                        */}
        {/* ==================================================== */}
        <aside
          aria-label="Specials carousel progress"
          className="absolute right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 p-2 rounded-full bg-espresso/50 backdrop-blur-xs border border-caramel/20 shadow-lg"
        >
          {Array.from({ length: totalSections }).map((_, fIdx) => {
            const isActive = activeFrame === fIdx;
            const label =
              fIdx === 0
                ? "Intro"
                : specials[fIdx - 1]?.name || `Special ${fIdx}`;

            return (
              <button
                key={fIdx}
                type="button"
                onClick={() => scrollToFrame(fIdx)}
                title={label}
                aria-label={`Go to ${label}`}
                className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              >
                {/* Tooltip on Hover */}
                <span className="pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-md bg-espresso/90 border border-caramel/30 text-[10px] font-sans text-cream whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                  {label}
                </span>

                {/* Dot */}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-2.5 h-6 bg-caramel ring-2 ring-caramel/40"
                      : "w-2 h-2 bg-cream/40 hover:bg-cream/80"
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
