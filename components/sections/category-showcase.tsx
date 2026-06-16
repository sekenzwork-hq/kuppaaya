"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const collections = [
  {
    title: "New Arrivals",
    subtitle: "Just Dropped",
    href: "/shop?sort=newest",
    image: "/assets/11.jpeg"
  },
  {
    title: "Casual Wear",
    subtitle: "Everyday Ease",
    href: "/shop?category=casual-wear",
    image: "/assets/4.jpeg"
  },
  {
    title: "Ethnic Collection",
    subtitle: "Timeless Heritage",
    href: "/shop?category=ethnic-wear",
    image: "/assets/2.jpeg"
  },
  {
    title: "Festive Collection",
    subtitle: "Stellar Celebrations",
    href: "/shop?category=festive",
    image: "/assets/7.jpeg"
  },
  {
    title: "Best Sellers",
    subtitle: "Most Loved",
    href: "/shop?sort=featured",
    image: "/assets/3.jpeg"
  },
  {
    title: "Trending Now",
    subtitle: "Hot This Season",
    href: "/shop?sort=newest",
    image: "/assets/8.jpeg"
  }
];

export function CategoryShowcase() {
  return (
    <section className="py-24 bg-[#fafbfc]">
      <div className="container-shell">
        {/* Title block */}
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Curated Edits</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">Featured Collections</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#6b6680]">
            Explore our thoughtfully structured collections, blending comfort, modern designs, and elegant style.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col, index) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.6 }}
              className="relative group rounded-2xl overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white"
            >
              <Link href={col.href} className="block relative aspect-[4/5] overflow-hidden">
                {/* Image zoom effect */}
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>

                {/* Gradient overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#21183d]/90 via-[#21183d]/30 to-[#21183d]/10 opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Brand Logo Watermark Gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6e63b8]/40 to-[#5faedb]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-x-6 bottom-6 text-left text-white z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5faedb]">
                    {col.subtitle}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-white group-hover:text-white transition-colors duration-300">
                    {col.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/90">
                    <span>Explore Shop</span>
                    <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
