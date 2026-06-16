"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Heart, Compass } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for elegant mouse-based parallax (accelerated on GPU)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // range: -0.5 to 0.5
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Animate smoothly back to center
    animate(mouseX, 0, { type: "spring", stiffness: 120, damping: 20 });
    animate(mouseY, 0, { type: "spring", stiffness: 120, damping: 20 });
  };

  // Transform outputs for layered depth feel
  const bgParallaxX = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const bgParallaxY = useTransform(mouseY, [-0.5, 0.5], [-25, 25]);

  const imageParallaxX = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);
  const imageParallaxY = useTransform(mouseY, [-0.5, 0.5], [-18, 18]);

  const elementParallaxX = useTransform(mouseX, [-0.5, 0.5], [-35, 35]);
  const elementParallaxY = useTransform(mouseY, [-0.5, 0.5], [-35, 35]);

  const tagParallaxX = useTransform(mouseX, [-0.5, 0.5], [-45, 45]);
  const tagParallaxY = useTransform(mouseY, [-0.5, 0.5], [-45, 45]);

  // Entrance variants for cinematic loading sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

const slideUpVariants: any = {
hidden: {
opacity: 0,
y: 40
},
visible: {
opacity: 1,
y: 0
}
};


  const featureCards = [
    { title: "Premium Quality", desc: "Curated, high-grade fabrics", icon: Shield },
    { title: "Contemporary Fashion", desc: "Modern, forward-looking edits", icon: Compass },
    { title: "Designed for Confidence", desc: "Tailored to empower presence", icon: Sparkles }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100vh] xl:min-h-[105vh] flex items-center overflow-hidden pt-28 pb-24 md:py-32 select-none"
      style={{
        background: "linear-gradient(155deg, #f3f7fb 0%, #f1eef8 40%, #f6f3fa 75%, #ffffff 100%)"
      }}
    >
      {/* 1. BACKGROUND EFFECTS: Animated aurora blobs & floating light particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dynamic Aurora blobs */}
        <motion.div
          style={{ x: bgParallaxX, y: bgParallaxY }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[-10%] h-[750px] w-[750px] rounded-full bg-gradient-to-tr from-[#5faedb]/35 to-[#6e63b8]/20 blur-[130px] opacity-90"
        />
        <motion.div
          style={{ x: bgParallaxX, y: bgParallaxY }}
          animate={{
            y: [0, 60, 0],
            x: [0, -60, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-15%] h-[850px] w-[850px] rounded-full bg-gradient-to-br from-[#6e63b8]/35 to-[#4b328b]/22 blur-[150px] opacity-80"
        />
        <motion.div
          animate={{
            y: [-30, 30, -30],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] top-[20%] h-[550px] w-[550px] rounded-full bg-[#5faedb]/25 blur-[110px] opacity-65"
        />

        {/* Floating Light Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 500,
              y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 400,
              opacity: 0.1 + Math.random() * 0.4,
              scale: 0.4 + Math.random() * 0.8
            }}
            animate={{
              y: ["0px", "-120px", "0px"],
              x: ["0px", "40px", "0px"],
              opacity: [0.15, 0.5, 0.15]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute w-4 h-4 rounded-full bg-white blur-[2px] shadow-glow"
          />
        ))}
      </div>

      {/* 2. 3D VISUAL DECORATIONS (Floating circles & glass shapes in bg/midground) */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Glowing glass circle top center */}
        <motion.div
          style={{ x: elementParallaxX, y: elementParallaxY }}
          animate={{ y: [0, -25, 0], rotate: 360 }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" }
          }}
          className="absolute left-[40%] top-[10%] w-32 h-32 rounded-full border border-white/30 bg-white/5 backdrop-blur-[6px] shadow-2xl"
        />
        {/* Gradient sphere bottom left */}
        <motion.div
          style={{ x: elementParallaxX, y: elementParallaxY }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[5%] bottom-[15%] w-20 h-20 rounded-full bg-gradient-to-tr from-[#5faedb]/50 to-[#6e63b8]/40 blur-[4px] shadow-xl"
        />
        {/* Floating Ring around the hero text */}
        <motion.div
          style={{ x: elementParallaxX, y: elementParallaxY }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute left-[45%] top-[60%] w-72 h-72 rounded-full border-2 border-dashed border-[#6e63b8]/15"
        />
      </div>

      <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] relative z-10">

        {/* Left Side: Brand Narrative & Sequential Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col text-left relative z-20"
        >
          {/* Tagline Fade */}
          <motion.div
            variants={slideUpVariants}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="h-[1px] w-8 bg-[#5faedb]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#5faedb] flex items-center gap-1">
              <Sparkles size={13} className="text-[#5faedb] animate-spin-slow" />
              The New Era of Fashion
            </span>
          </motion.div>

          {/* Sequential Headline Slide Up */}
          <h1 className="text-5xl leading-[1.08] font-bold text-[#21183d] sm:text-6xl lg:text-[84px] tracking-tight">
            <motion.span variants={slideUpVariants} className="block overflow-hidden">
              Fashion That
            </motion.span>
            <motion.span
              variants={slideUpVariants}
              className="text-gradient font-extrabold block mt-2 pb-2"
            >
              Moves With You
            </motion.span>
          </h1>

          {/* Subtext Reveal */}
          <motion.p
            variants={slideUpVariants}
            className="mt-6 max-w-xl text-base leading-8 text-[#6b6680] font-normal"
          >
            Discover thoughtfully crafted collections designed for confidence, comfort, and effortless style. Designed for modern women who embrace every moment.
          </motion.p>

          {/* Call to Actions with Magnetic & Shimmer Hover */}
          <motion.div
            variants={slideUpVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative group overflow-hidden rounded-full p-[1px] transition-all duration-300 shadow-lg shadow-[#6e63b8]/20"
            >
              {/* Shimmer Border background */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#5faedb] via-[#6e63b8] to-[#4b328b] opacity-80 group-hover:opacity-100 transition-opacity" />
              <ButtonLink
                href="/shop"
                className="relative bg-[#21183d] hover:bg-[#21183d]/90 text-white min-h-12 px-8 rounded-full flex items-center justify-center gap-2 border-0 w-full"
              >
                {/* Internal Shimmer Shifting bar */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span>Shop Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </ButtonLink>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonLink
                href="/shop?sort=newest"
                variant="secondary"
                className="min-h-12 px-8 rounded-full border border-[#4b328b]/10 hover:border-[#6e63b8]/20 bg-white/70 hover:bg-white text-[#21183d]"
              >
                New Arrivals
              </ButtonLink>
            </motion.div>
          </motion.div>

          {/* Quick Metrics: Transformed to Glass Cards */}
          <motion.div
            variants={slideUpVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#4b328b]/5 pt-8"
          >
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  className="glass rounded-xl p-4 text-left border border-white/50 bg-white/40 shadow-sm transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#6e63b8]/10 text-[#6e63b8] mb-3">
                    <Icon size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-[#21183d]">{card.title}</h4>
                  <p className="text-[10px] text-[#6b6680] mt-1 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Side: Interactive Parallax Image & Floating Fashion Tags */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="relative flex justify-center lg:justify-end z-10"
        >
          {/* Animated Halo behind image */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.06, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-8 bottom-0 top-12 rounded-t-[200px] rounded-b-2xl bg-gradient-to-tr from-[#5faedb]/25 via-[#6e63b8]/25 to-[#4b328b]/15 blur-3xl opacity-80"
          />

          {/* Portrait Image Frame with Parallax and Zoom */}
          <motion.div
            style={{ x: imageParallaxX, y: imageParallaxY }}
            whileHover={{ scale: 1.02 }}
            className="relative w-full max-w-[460px] aspect-[4/5] overflow-hidden rounded-t-[230px] rounded-b-[24px] shadow-2xl border-4 border-white bg-slate-100 group transition-shadow duration-500 hover:shadow-[0_24px_50px_rgba(75,50,139,0.18)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=86"
              alt="Premium women's fashion look"
              fill
              priority
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-106"
              sizes="(min-width: 1024px) 40vw, 90vw"
            />

            {/* Shimmer overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6e63b8]/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Floating Fashion Tags around the image container */}

          {/* Tag 1: NEW ARRIVAL */}
          <motion.div
            style={{ x: tagParallaxX, y: tagParallaxY }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-20px] top-[15%] z-20"
          >
            <div className="glass rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#5faedb] animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#21183d]">
                New Arrival
              </span>
            </div>
          </motion.div>

          {/* Tag 2: TRENDING */}
          <motion.div
            style={{ x: tagParallaxX, y: tagParallaxY }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-[-15px] top-[40%] z-20"
          >
            <div className="glass rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Heart size={10} className="text-[#6e63b8] fill-[#6e63b8]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#21183d]">
                Trending Now
              </span>
            </div>
          </motion.div>

          {/* Tag 3: BEST SELLER */}
          <motion.div
            style={{ x: tagParallaxX, y: tagParallaxY }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[10px] bottom-[5%] z-20"
          >
            <div className="glass rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles size={10} className="text-[#4b328b]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#21183d]">
                Best Seller
              </span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
