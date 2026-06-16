import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";
import { getLocalDb } from "./local-db";

const productSelect = "*, product_images(*), product_variants(*), category:categories(*), subcategory:subcategories(*)";

function getLocalProducts(): Product[] {
  const db = getLocalDb();
  return db.products.map((p) => {
    return {
      ...p,
      product_images: db.product_images.filter((img) => String(img.product_id) === String(p.id)),
      product_variants: db.product_variants.filter((v) => String(v.product_id) === String(p.id)),
      category: db.categories.find((c) => String(c.id) === String(p.category_id)) || null,
      subcategory: db.subcategories.find((sc) => String(sc.id) === String(p.subcategory_id)) || null
    } as unknown as Product;
  });
}

export async function getProducts(params?: {
  query?: string;
  category?: string;
  subcategory?: string;
  min?: number;
  max?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return filterFallback(params);
  }

  const supabase = await createClient();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from("products").select(productSelect, { count: "exact" }).eq("status", "active");

  if (params?.query) query = query.ilike("name", `%${params.query}%`);
  if (params?.category) query = query.eq("category_id", params.category);
  if (params?.subcategory) query = query.eq("subcategory_id", params.subcategory);
  if (params?.min) query = query.gte("price", params.min);
  if (params?.max) query = query.lte("price", params.max);
  if (params?.sort === "price-asc") query = query.order("price", { ascending: true });
  else if (params?.sort === "price-desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, count, error } = await query.range(from, to);
  if (error) return filterFallback(params);
  return { products: (data ?? []) as Product[], count: count ?? 0 };
}

export async function getProductBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getLocalProducts().find((product) => product.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("slug", slug).single();
  if (error) return getLocalProducts().find((product) => product.slug === slug) ?? null;
  return data as Product;
}

export async function getFeaturedProducts(filter?: "featured" | "new" | "best") {
  const { products } = await getProducts({ pageSize: 8 });
  if (filter === "new") return products.filter((product) => product.is_new);
  if (filter === "best") return products.filter((product) => product.is_best_seller);
  return products.filter((product) => product.is_featured).slice(0, 8);
}

function filterFallback(params?: Parameters<typeof getProducts>[0]) {
  let rows = getLocalProducts();
  if (params?.query) rows = rows.filter((product) => product.name.toLowerCase().includes(params.query!.toLowerCase()));
  if (params?.category) rows = rows.filter((product) => product.category_id === params.category);
  if (params?.min) rows = rows.filter((product) => product.price >= params.min!);
  if (params?.max) rows = rows.filter((product) => product.price <= params.max!);
  if (params?.sort === "price-asc") rows.sort((a, b) => a.price - b.price);
  if (params?.sort === "price-desc") rows.sort((a, b) => b.price - a.price);
  return { products: rows, count: rows.length };
}
