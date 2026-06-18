"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/types/database";

export function ShopClient({ products }: { products: Product[] }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    async function loadCategories() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.from("categories").select("*");
        if (error) throw error;
        if (data) setCategories(data as Category[]);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    loadCategories();
  }, []);

  const filtered = useMemo(() => {
    const rows = products
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => category === "all" || product.category_id === category)
      .filter((product) => product.price <= maxPrice);

    if (sort === "price-asc") rows.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") rows.sort((a, b) => b.price - a.price);
    if (sort === "featured") rows.sort((a, b) => Number(b.featured) - Number(a.featured));
    return rows;
  }, [products, query, category, sort, maxPrice]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container-shell py-12">
      <div className="glass mb-8 grid gap-4 rounded-[8px] p-4 lg:grid-cols-[1fr_190px_190px_220px]">
        <label className="flex min-h-12 items-center gap-3 rounded-full bg-white px-4 text-[#4b328b]">
          <Search size={18} />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search products" className="w-full border-0 bg-transparent outline-none" />
        </label>
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="focus-ring rounded-full border border-[#4b328b]/10 bg-white px-4 text-sm text-[#4b328b]">
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option value={item.id} key={item.id}>{item.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="focus-ring rounded-full border border-[#4b328b]/10 bg-white px-4 text-sm text-[#4b328b]">
          <option value="newest">Newest</option>
          <option value="featured">Featured</option>
          <option value="price-asc">Price low</option>
          <option value="price-desc">Price high</option>
        </select>
        <label className="flex items-center gap-3 rounded-full bg-white px-4 text-sm text-[#4b328b]">
          <SlidersHorizontal size={18} />
          <input type="range" min="500" max="10000" step="250" value={maxPrice} onChange={(event) => { setMaxPrice(Number(event.target.value)); setPage(1); }} className="w-full accent-[#6e63b8]" />
          <span>{maxPrice}</span>
        </label>
      </div>
      {paginated.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-[8px] p-12 text-center text-[#6b6680]">No pieces match this edit yet.</div>
      )}
      <div className="mt-10 flex items-center justify-center gap-3">
        <Button variant="secondary" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
        <span className="text-sm text-[#6b6680]">Page {page} of {pages}</span>
        <Button variant="secondary" disabled={page === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>Next</Button>
      </div>
    </div>
  );
}
