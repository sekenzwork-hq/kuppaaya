"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(18px)"]);

  return (
    <motion.header
      style={{ backdropFilter: blur }}
      className="sticky top-0 z-50 border-b border-[#4b328b]/10 bg-white/78"
    >
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full" onClick={() => setMenuOpen(false)}>
          <Image src="/images/logo.png" alt="Kuppaaya" width={148} height={88} className="h-14 w-auto object-contain" priority />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4b328b] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#5faedb]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="focus-ring rounded-full p-3 text-[#4b328b] hover:bg-[#5faedb]/10" href="/shop" aria-label="Search products" onClick={() => setMenuOpen(false)}>
            <Search size={20} />
          </Link>
          <Link className="focus-ring rounded-full p-3 text-[#4b328b] hover:bg-[#5faedb]/10" href="/admin" aria-label="Admin account" onClick={() => setMenuOpen(false)}>
            <UserRound size={20} />
          </Link>
          <ButtonLink href="/shop" className="hidden px-5 md:inline-flex">
            <ShoppingBag size={18} />
            Shop Now
          </ButtonLink>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus-ring rounded-full p-3 text-[#4b328b] md:hidden relative z-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-20 z-40 border-b border-[#4b328b]/10 bg-white p-6 shadow-xl md:hidden"
        >
          <nav className="flex flex-col gap-4 text-base font-medium text-[#4b328b]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 border-b border-[#4b328b]/5 hover:text-[#5faedb] transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <ButtonLink href="/shop" className="w-full justify-center py-3" onClick={() => setMenuOpen(false)}>
                <ShoppingBag size={18} />
                Shop Now
              </ButtonLink>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
