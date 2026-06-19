"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, HeartHandshake, Gem, Eye } from "lucide-react";

const valueProps = [
  {
    title: "Premium Quality",
    description: "Crafted with carefully selected fabrics for comfort and durability.",
    icon: ShieldCheck,
    color: "#5faedb"
  },
  {
    title: "Modern Designs",
    description: "Fashion-forward collections inspired by contemporary trends.",
    icon: Eye,
    color: "#6e63b8"
  },
  {
    title: "Comfort First",
    description: "Designed to make you feel confident throughout the day.",
    icon: HeartHandshake,
    color: "#4b328b"
  },
  {
    title: "Affordable Luxury",
    description: "Premium fashion at accessible prices.",
    icon: Gem,
    color: "#5faedb"
  }
];

export function WhyKuppaaya() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute right-[5%] top-[10%] h-64 w-64 rounded-full bg-[#5faedb]/10 blur-3xl" />
      <div className="absolute left-[5%] bottom-[10%] h-64 w-64 rounded-full bg-[#6e63b8]/10 blur-3xl" />

      <div className="container-shell relative z-10 text-center">
        {/* Title Block */}
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">The Kuppaaya Philosophy</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
            Why Women Choose Kuppaaya
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6b6680]">
            We build collections around the daily needs of modern women, matching premium craftsmanship with functional grace.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-8 sm:mt-16 grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="glass relative rounded-2xl border border-[#4b328b]/5 p-4 sm:p-7 bg-slate-50/50 hover:bg-white hover:border-[#6e63b8]/15 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon wrapper */}
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm"
                  style={{ backgroundColor: `${prop.color}15`, color: prop.color }}
                >
                  <Icon className="w-5.5 h-5.5 sm:w-[22px] sm:h-[22px]" />
                </div>

                <h3 className="text-sm sm:text-lg font-bold text-[#21183d]">{prop.title}</h3>
                <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-5 sm:leading-6 text-[#6b6680] font-normal">{prop.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
