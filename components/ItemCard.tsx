"use client";

import Image from "next/image";
import { type Product, WARM_PLACEHOLDER_BLUR, CAFE_CONFIG } from "@/data/menu";

interface ItemCardProps {
  product: Product;
}

export function ItemCard({ product }: ItemCardProps) {
  const isSoldOut = !product.isAvailable;

  return (
    <article
      className={`group relative flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-warm-white border border-caramel/15 shadow-xs transition-all duration-300 ${
        isSoldOut
          ? "opacity-55 saturate-50 bg-warm-white/70"
          : "[@media(hover:hover)]:hover:border-caramel/40 [@media(hover:hover)]:hover:shadow-md"
      }`}
      aria-label={`${product.name}, ${CAFE_CONFIG.currencySymbol}${product.price.toFixed(2)}${
        isSoldOut ? " (Sold out)" : ""
      }`}
    >
      {/* Square Photo with Rounded Corners */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-cream aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          placeholder="blur"
          blurDataURL={WARM_PLACEHOLDER_BLUR}
          sizes="(max-width: 640px) 80px, 96px"
          className={`object-cover object-center ${
            !isSoldOut
              ? "transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-108"
              : ""
          }`}
        />

        {/* Optional Tag (New / Popular) */}
        {product.tag && !isSoldOut && (
          <span
            className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold tracking-wide uppercase shadow-xs ${
              product.tag === "Popular"
                ? "bg-caramel text-warm-white"
                : "bg-espresso text-cream"
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Sold Out Overlay Badge on Photo */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-espresso/50 flex items-center justify-center p-1 text-center">
            <span className="text-[10px] sm:text-xs font-sans font-medium uppercase tracking-wider text-cream bg-espresso/80 px-2 py-0.5 rounded">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Item Details: Name, Price, Sold-out State */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base sm:text-lg text-espresso font-normal leading-snug truncate">
            {product.name}
          </h3>
        </div>

        {/* Price & State */}
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-sans text-sm sm:text-base font-semibold text-caramel tracking-tight">
            {CAFE_CONFIG.currencySymbol}
            {product.price.toFixed(2)}
          </span>

          {isSoldOut && (
            <span className="text-xs font-sans text-mocha italic">
              Currently unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
