"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

export function CategoryShowcase() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (error) {
          console.error("Failed to load categories:", error);
          return;
        }

        setCategories((data || []) as Category[]);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#fafbfc] py-24">
        <div className="container-shell">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">
              Curated Edits
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
              Featured Collections
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-[#eeeef4]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#fafbfc] py-24">
      <div className="container-shell">
        {/* Title block */}
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">
              Curated Edits
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
              Featured Collections
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#6b6680]">
            Explore our collections, thoughtfully selected for modern style,
            comfort, and everyday elegance.
          </p>
        </div>

        {/* Database Categories */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: index * 0.06,
                duration: 0.6,
              }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <Link
                href={`/shop?category=${encodeURIComponent(category.slug)}`}
                className="relative block aspect-[4/5] overflow-hidden"
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={category.image_url || "/images/logo.png"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#21183d]/90 via-[#21183d]/30 to-[#21183d]/10 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6e63b8]/40 to-[#5faedb]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute inset-x-3 bottom-3 z-10 text-left text-white sm:inset-x-6 sm:bottom-6">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5faedb] sm:text-[10px]">
                    Collection
                  </span>

                  <h3 className="mt-0.5 text-base font-bold tracking-tight text-white sm:mt-1 sm:text-2xl">
                    {category.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/90 sm:mt-4 sm:gap-2 sm:text-[11px]">
                    <span>Explore Shop</span>
                    <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
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