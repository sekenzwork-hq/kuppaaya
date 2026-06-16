"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rhea K.",
    role: "Regular Customer",
    quote: "The premium quality of the fabrics is unmatched. It fits beautifully and feels incredibly elegant."
  },
  {
    name: "Mira J.",
    role: "Fashion Enthusiast",
    quote: "Kuppaaya has become my absolute go-to for contemporary fashion. I receive compliments every time I wear their festive collection."
  },
  {
    name: "Priya S.",
    role: "Verified Buyer",
    quote: "Effortless elegance combined with real comfort. The pieces are beautifully stitched and feel like everyday luxury."
  }
];

export function Testimonials() {
  return (
    <section className="bg-[#f8fafc] py-24 relative overflow-hidden">
      <div className="container-shell text-center">
        {/* Title block */}
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Customer Love</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
            Loved By Women Everywhere
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6b6680]">
            Hear from our community of modern women styling their everyday elegance.
          </p>
        </div>

        {/* Grid review cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className="glass rounded-2xl border border-[#4b328b]/5 p-8 bg-white/60 hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col justify-between"
            >
              <blockquote className="text-base leading-8 text-[#21183d] font-normal italic">
                “{t.quote}”
              </blockquote>
              <div className="mt-8 border-t border-[#4b328b]/5 pt-4">
                <figcaption className="text-sm font-bold text-[#4b328b]">{t.name}</figcaption>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6b6680] mt-0.5 block">
                  {t.role}
                </span>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
