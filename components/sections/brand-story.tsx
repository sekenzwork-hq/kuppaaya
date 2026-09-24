"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";

export function BrandStory() {
  return (
    <section className="overflow-hidden py-24 bg-white relative">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">

        {/* Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Soft brand glow */}
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#5faedb]/15 via-[#eef2fb] to-[#6e63b8]/15 blur-sm" />

          {/* Image */}
          <div className="relative h-[460px] sm:h-[520px] lg:h-[560px] overflow-hidden rounded-[2rem] shadow-2xl shadow-[#4b328b]/15 border-4 border-white">
            <Image
              src="/images/brand.png"
              alt="Kuppaaya Brand Manifesto"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {/* Very subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#21183d]/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Narrative Block */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">
            Brand Manifesto
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight text-[#21183d] md:text-5xl tracking-tight">
            When Passion Meets Fashion
          </h2>

          <p className="mt-6 text-base leading-8 text-[#6b6680] font-normal">
            At Kuppaaya, we believe fashion is more than clothing—it is
            confidence, individuality, and self-expression. Every collection is
            thoughtfully curated to blend elegance, comfort, and contemporary
            style for women who embrace every moment with confidence.
          </p>

          <div className="mt-8 grid gap-3 grid-cols-3">
            {["Confidence", "Comfort", "Elegance"].map((value) => (
              <div
                key={value}
                className="glass rounded-xl p-3 sm:p-5 text-center font-display text-xs sm:text-lg font-bold text-[#4b328b]"
              >
                {value}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/about">
              Explore Our Story
            </ButtonLink>
          </div>
        </motion.div>

      </div>
    </section>
  );
}