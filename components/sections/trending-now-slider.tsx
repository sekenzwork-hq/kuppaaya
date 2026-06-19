"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/database";

export function TrendingNowSlider({ products }: { products: Product[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const scrollAmount = isMobile ? 210 : 340; // Approx card width + gap
    const target =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: target,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative group">
      {/* Scroll controls (hidden on touch devices) */}
      <button
        onClick={() => handleScroll("left")}
        className="absolute -left-5 top-[40%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#4b328b] shadow-lg border border-[#4b328b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#fafbfc]"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => handleScroll("right")}
        className="absolute -right-5 top-[40%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#4b328b] shadow-lg border border-[#4b328b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#fafbfc]"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Horizontal scrolling track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[170px] w-[170px] xs:min-w-[200px] xs:w-[200px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
