import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import { getProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the complete Kuppaaya collection of contemporary dresses, casual wear, festive sets, and jewelry accessories."
};

export default async function ShopPage() {
  const { products } = await getProducts({ pageSize: 48 });

  return (
    <main>
      <section className="bg-[#f8fafc] py-16">
        <div className="container-shell text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Shop Kuppaaya</p>
          <h1 className="mt-3 text-5xl text-[#21183d] md:text-6xl font-bold tracking-tight">The complete collection</h1>
          <p className="mt-5 max-w-2xl leading-8 text-[#6b6680]">Filter by category, search by name, refine price, and choose the piece that feels made for your occasion.</p>
        </div>
      </section>
      <ShopClient products={products} />
    </main>
  );
}
