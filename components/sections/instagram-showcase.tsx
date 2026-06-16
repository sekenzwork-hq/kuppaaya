"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  "/assets/1.jpeg",
  "/assets/2.jpeg",
  "/assets/3.jpeg",
  "/assets/4.jpeg",
];

export function InstagramShowcase() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container-shell">
        {/* Header Block */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Instagram Edit</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
              Join The Kuppaaya Community
            </h2>
            <p className="mt-2 text-sm text-[#6b6680] text-left">
                Follow us on Instagram for new arrivals, styling inspiration, and exclusive updates.
            </p>
          </div>
          <a
          href="https://www.instagram.com/kuppaaya_/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-[#4b328b] hover:text-[#5faedb] transition"
        >
          @kuppaaya_
        </a>
        </div>

        {/* Image Grid with Smooth Lift */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {images.map((image, index) => (
            <motion.div 
              key={image} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <Image 
                src={image} 
                alt={`Kuppaaya community look ${index + 1}`} 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 50vw" 
              />
              <div className="absolute inset-0 bg-[#6e63b8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
