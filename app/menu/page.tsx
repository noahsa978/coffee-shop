import type { Metadata } from "next";
import {
  CAFE_CONFIG,
  mockCategories,
  mockProducts,
  featuredProducts,
} from "@/data/menu";
import { Hero } from "@/components/Hero";
import { CategoryBar } from "@/components/CategoryBar";
import { MenuSection } from "@/components/MenuSection";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: `Menu | ${CAFE_CONFIG.name}`,
  description: `Browse the digital menu for ${CAFE_CONFIG.name}. Fresh artisan coffees, teas, daily baked cakes, pastries, and savory delights.`,
};

export default function MenuPage() {
  const sortedCategories = [...mockCategories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col selection:bg-caramel selection:text-warm-white">
      {/* 1. Hero Banner with auto-playing featured specials slideshow */}
      <Hero featuredItems={featuredProducts} />

      {/* 2. Sticky Category Bar */}
      <CategoryBar categories={sortedCategories} />

      {/* 3. Menu Content Sections with ample calming whitespace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Intro notice or subtle warm welcome */}
        <div className="text-center pt-8 pb-4 max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-caramel font-medium">
            Daily Selection
          </p>
          <p className="font-serif text-xl sm:text-2xl text-espresso mt-1 font-normal">
            Prepared fresh in our kitchen
          </p>
        </div>

        {/* Category Sections */}
        <div className="divide-y divide-caramel/15">
          {sortedCategories.map((category) => {
            const items = mockProducts.filter(
              (p) => p.categoryId === category.id
            );
            return (
              <MenuSection
                key={category.id}
                category={category}
                products={items}
              />
            );
          })}
        </div>

        {/* Footer / Warm Café Sign-off */}
        <footer className="mt-16 sm:mt-24 pt-8 border-t border-caramel/25 text-center text-xs sm:text-sm text-mocha flex flex-col items-center gap-2">
          <p className="font-serif italic text-base text-espresso">
            Thank you for dining with {CAFE_CONFIG.name}
          </p>
          <p className="max-w-md text-xs leading-relaxed text-mocha/90">
            Please inform our team of any allergies or dietary requirements before ordering. Prices include applicable taxes.
          </p>
        </footer>
      </main>

      {/* 4. Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}
