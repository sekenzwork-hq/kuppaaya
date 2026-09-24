"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, Play } from "lucide-react";

const values = [
  "Quality First",
  "Customer Happiness",
  "Timeless Style",
  "Comfort Everyday",
];



export default function AboutPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-[#f8f7fa] text-[#21183d]">

      {/* ========================================================= */}
      {/* HERO / OUR STORY */}
      {/* ========================================================= */}

      <section
        id="story"
        className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#21183d]"
      >
        {/* Background Image */}
        <Image
          src="/images/about.png"
          alt="Kuppaaya"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120d25]/95 via-[#21183d]/65 to-[#21183d]/15" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#120d25]/80 via-transparent to-[#120d25]/20" />

        {/* Decorative glow */}
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#6e63b8]/20 blur-[140px]" />

        <div className="container-shell relative z-10 flex min-h-[calc(100vh-64px)] items-center py-24">

          <div className="grid w-full items-end gap-16 lg:grid-cols-[1fr_320px]">

            {/* Main Story */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#8fd0f0]">
                About Kuppaaya
              </p>

              <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-[82px]">
                Designed for
                <br />
                <span className="italic font-normal">
                  Every Chapter
                </span>
                <br />
                of You.
              </h1>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                Kuppaaya is a women's fashion brand dedicated to bringing
                together timeless style, comfort, and quality. Our collections
                are thoughtfully curated for women who want to feel confident,
                comfortable, and effortlessly stylish in every moment.
              </p>

            </motion.div>

          

          </div>
        </div>



      </section>


      {/* ========================================================= */}
      {/* VISION */}
      {/* ========================================================= */}

      <section
        id="vision"
        className="relative overflow-hidden bg-white py-24 sm:py-32"
      >
        <div className="container-shell">

          <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5faedb]">
                01 — Our Vision
              </p>

              <h2 className="mt-5 font-display text-4xl leading-tight text-[#21183d] sm:text-5xl lg:text-6xl">
                A future where
                <br />
                <span className="italic font-normal">
                  style feels personal.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -left-8 top-0 h-full w-px bg-gradient-to-b from-[#5faedb] to-[#6e63b8]/10" />

              <p className="max-w-2xl text-lg leading-9 text-[#6b6680]">
                To become a trusted premium modest fashion label known for
                elegant silhouettes and meaningful detail.
              </p>

              <div className="mt-10 h-px w-full bg-[#4b328b]/10" />

              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#6b6680]">
                <span>Kuppaaya</span>
                <span>01 / 04</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* MISSION */}
      {/* ========================================================= */}

      <section
        id="mission"
        className="relative overflow-hidden bg-[#21183d] py-24 text-white sm:py-32"
      >

        {/* Background decoration */}
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#6e63b8]/30 blur-[140px]" />

        <div className="container-shell relative">

          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fd0f0]">
                02 — Our Mission
              </p>

              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Fashion that
                <br />
                <span className="italic font-normal text-white/80">
                  moves with you.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <p className="text-lg leading-9 text-white/65">
                To make elevated, comfortable clothing easy to discover,
                style, and order through a personal digital experience.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">

                {[
                  "Elevated",
                  "Comfortable",
                  "Personal",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm"
                  >
                    <span className="text-sm font-medium text-white/80">
                      {item}
                    </span>
                  </div>
                ))}

              </div>
            </motion.div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* FOUNDER MESSAGE */}
      {/* ========================================================= */}

      <section className="bg-[#f8f7fa] py-24 sm:py-32">

        <div className="container-shell">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5faedb]">
              03 — Founder Message
            </p>

            <blockquote className="mt-8 font-display text-3xl leading-relaxed text-[#21183d] sm:text-4xl lg:text-5xl">
              “Kuppaaya was created from a passion for fashion and a desire
              to bring elegant, wearable styles to women who value both beauty
              and comfort.”
            </blockquote>

            <div className="mx-auto mt-8 h-px w-16 bg-[#6e63b8]" />

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#6b6680]">
              The Kuppaaya Story
            </p>

          </motion.div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* VALUES */}
      {/* ========================================================= */}

      <section
        id="values"
        className="bg-white py-24 sm:py-32"
      >

        <div className="container-shell">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5faedb]">
              04 — Our Values
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <h2 className="font-display text-4xl text-[#21183d] sm:text-5xl">
                What we believe in.
              </h2>

              <p className="max-w-md text-sm leading-7 text-[#6b6680]">
                The principles that shape every collection and every
                experience we create.
              </p>

            </div>
          </motion.div>


          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((value, index) => (

              <motion.div
                key={value}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-[#4b328b]/10 bg-[#f8f7fa] p-7 transition duration-500 hover:-translate-y-2 hover:bg-[#21183d]"
              >

                <div className="flex items-start justify-between">

                  <span className="text-xs font-semibold tracking-[0.2em] text-[#6e63b8] group-hover:text-[#8fd0f0]">
                    0{index + 1}
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4b328b]/10 group-hover:border-white/20">
                    <Check
                      size={14}
                      className="text-[#4b328b] group-hover:text-white"
                    />
                  </div>

                </div>

                <h3 className="mt-16 font-display text-2xl text-[#21183d] group-hover:text-white">
                  {value}
                </h3>

                <div className="mt-5 h-px w-0 bg-white/20 transition-all duration-500 group-hover:w-full" />

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-[#21183d] py-24 text-center sm:py-32">

        <div className="absolute inset-0 bg-gradient-to-br from-[#21183d] via-[#302457] to-[#4b328b]" />

        <div className="relative container-shell">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8fd0f0]">
              Kuppaaya
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Designed for confidence.
              <br />
              <span className="italic font-normal text-white/70">
                Made for you.
              </span>
            </h2>

            <button
              onClick={() => (window.location.href = "/shop")}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#21183d] transition hover:bg-[#f2efff]"
            >
              Explore the Collection
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </motion.div>

        </div>

      </section>

    </main>
  );
}