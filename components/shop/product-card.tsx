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
    <motion.article whileHover={{ y: -6 }} className="group rounded-[8px] bg-white shadow-lg shadow-[#4b328b]/8 transition">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[8px] bg-[#f8fafc]">
          <Image src={image} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <div className="absolute left-3 top-3 rounded-full bg-white/86 px-3 py-1 text-xs font-semibold text-[#4b328b] backdrop-blur">
            {product.is_new ? "New" : product.is_best_seller ? "Best Seller" : "Featured"}
          </div>
          <button className="focus-ring absolute right-3 top-3 rounded-full bg-white/86 p-2 text-[#4b328b] backdrop-blur" aria-label={`Save ${product.name}`}>
            <Heart size={18} />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl text-[#21183d]">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b6680]">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#4b328b]">{formatPrice(product.price)}</span>
              {product.compare_at_price ? <span className="ml-2 text-sm text-[#6b6680] line-through">{formatPrice(product.compare_at_price)}</span> : null}
            </div>
            <span className="brand-gradient rounded-full p-2 text-white">
              <ShoppingBag size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
