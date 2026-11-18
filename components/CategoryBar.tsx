"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@/data/menu";

interface CategoryBarProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export function CategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryBarProps) {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    categories[0]?.id || ""
  );
  const barRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeId = activeCategoryId || internalActiveId;

  // Track sections via IntersectionObserver to update active tab on scroll
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the visible section nearest to top
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - 80) -
            Math.abs(b.boundingClientRect.top - 80)
        );
        const currentActiveId = visibleEntries[0].target.id.replace("section-", "");
        setInternalActiveId(currentActiveId);
      }
    };

    // Root margin offsets account for the sticky header
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-90px 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    });

    categories.forEach((cat) => {
      const el = document.getElementById(`section-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  // Keep the active button visible horizontally when activeId changes on mobile
  useEffect(() => {
    const activeButton = buttonRefs.current[activeId];
    if (activeButton && barRef.current) {
      const container = barRef.current;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTarget = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  const handleCategoryClick = (id: string) => {
    setInternalActiveId(id);
    onSelectCategory?.(id);

    const sectionEl = document.getElementById(`section-${id}`);
    if (sectionEl) {
      // Smooth-scroll into view with clearance for sticky category bar
      sectionEl.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-30 w-full bg-cream/95 backdrop-blur-md border-b border-caramel/25 shadow-xs transition-shadow duration-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={barRef}
          className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-2.5 scroll-smooth"
        >
          {categories.map((category) => {
            const isActive = activeId === category.id;
            return (
              <button
                key={category.id}
                ref={(el) => {
                  buttonRefs.current[category.id] = el;
                }}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-sans whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel ${
                  isActive
                    ? "bg-caramel text-warm-white font-medium shadow-xs scale-[1.02]"
                    : "text-espresso hover:text-caramel hover:bg-caramel/10 active:bg-caramel/20 font-normal"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
