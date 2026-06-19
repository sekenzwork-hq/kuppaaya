"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  const image = product.product_images?.[0]?.image_url ?? "/images/logo.png";

  return (
    <motion.article whileHover={{ y: -6 }} className="group rounded-[8px] bg-white shadow-md sm:shadow-lg shadow-[#4b328b]/8 transition">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[8px] bg-[#f8fafc]">
          <Image src={image} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          {product.is_new || product.is_best_seller || product.featured ? (
            <div className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-white/86 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#4b328b] backdrop-blur">
              {product.is_new ? "New" : product.is_best_seller ? "Best Seller" : "Featured"}
            </div>
          ) : null}
          <button className="focus-ring absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white/86 p-1.5 sm:p-2 text-[#4b328b] backdrop-blur" aria-label={`Save ${product.name}`}>
            <Heart className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        <div className="p-3 sm:p-5">
          <h3 className="font-display text-sm sm:text-xl text-[#21183d] line-clamp-1 sm:line-clamp-none">{product.name}</h3>
          <p className="mt-1 line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm sm:leading-6 text-[#6b6680] sm:mt-2">{product.description}</p>
          <div className="mt-2 sm:mt-4 flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-base font-semibold text-[#4b328b]">{formatPrice(product.price)}</span>
              {product.compare_at_price ? <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm text-[#6b6680] line-through">{formatPrice(product.compare_at_price)}</span> : null}
            </div>
            <span className="brand-gradient rounded-full p-1.5 sm:p-2 text-white">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-[17px] sm:h-[17px]" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
