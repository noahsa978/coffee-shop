"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Product } from "@/data/menu";
import { ItemCard } from "@/components/ItemCard";

interface MenuSectionProps {
  category: Category;
  products: Product[];
}

export function MenuSection({ category, products }: MenuSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      id={`section-${category.id}`}
      ref={sectionRef}
      className="scroll-mt-20 sm:scroll-mt-24 pt-8 pb-4 sm:pt-12 sm:pb-6"
      aria-labelledby={`heading-${category.id}`}
    >
      {/* Section Header with Refined Caramel Divider */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-3">
          <h2
            id={`heading-${category.id}`}
            className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight"
          >
            {category.name}
          </h2>
          <div className="h-px bg-caramel/35 flex-1" />
          <span className="text-caramel/60 text-xs font-serif italic select-none">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Grid: 1 column on phone, 2 columns on tablet, 2-3 columns on desktop */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {products.map((product) => (
          <ItemCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
