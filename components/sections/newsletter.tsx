"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="pb-24 bg-white relative">
      <div className="container-shell overflow-hidden rounded-2xl brand-gradient p-8 text-white shadow-2xl shadow-[#6e63b8]/20 md:p-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Newsletter Signup</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Stay In Style</h2>
            <p className="mt-4 max-w-xl text-white/80 text-sm leading-6">
              Be the first to know about new arrivals, exclusive collections, and special offers.
            </p>
          </div>
          <form className="glass flex flex-col gap-3 rounded-xl p-3 sm:flex-row border border-white/10" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="email">Email address</label>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 text-[#4b328b]">
              <Mail size={18} className="text-[#6e63b8]" />
              <input 
                id="email" 
                type="email" 
                required 
                placeholder="Your email address" 
                className="min-h-12 flex-1 border-0 bg-transparent outline-none placeholder:text-[#6b6680] text-sm text-[#21183d]" 
              />
            </div>
            <Button type="submit" className="bg-[#4b328b] hover:bg-[#21183d] text-white font-bold px-6 shadow-none rounded-full min-h-12">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
