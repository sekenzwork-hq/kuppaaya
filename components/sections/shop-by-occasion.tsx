"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const occasions = [
  {
    name: "Everyday Wear",
    href: "/shop?occasion=everyday",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    name: "Work Wear",
    href: "/shop?occasion=work",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    name: "College Wear",
    href: "/shop?occasion=college",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    name: "Party Wear",
    href: "/shop?occasion=party",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    name: "Festive Wear",
    href: "/shop?occasion=festive",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    name: "Weekend Styles",
    href: "/shop?occasion=weekend",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80",
    gridClass: "md:col-span-2 md:row-span-1"
  }
];

export function ShopByOccasion() {
  return (
    <section className="py-24 bg-[#fafbfc]">
      <div className="container-shell">
        {/* Header Block */}
        <div className="mb-14 text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Styled Moments</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
            Shop By Occasion
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6b6680]">
            Curated outfits styled for every moment of your day, from campus chic to celebratory sparkle.
          </p>
        </div>

        {/* Asymmetrical Grid Showcase */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {occasions.map((occ, index) => (
            <motion.div
              key={occ.name}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className={`relative rounded-2xl overflow-hidden shadow-md group ${occ.gridClass} bg-white`}
            >
              <Link href={occ.href} className="block relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                />
                
                {/* Overlay layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#21183d]/80 via-[#21183d]/20 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 bg-[#6e63b8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Card Title */}
                <div className="absolute bottom-6 left-6 text-left">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {occ.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5faedb]">
                    <span>View Edit</span>
                    <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
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
