import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

const productSelect = "*, product_images(*), product_variants(*), category:categories(*), subcategory:subcategories(*)";

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
  const supabase = await createClient();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from("products").select(productSelect, { count: "exact" }).eq("is_active", true);

  if (params?.query) query = query.ilike("name", `%${params.query}%`);
  if (params?.category) query = query.eq("category_id", params.category);
  if (params?.subcategory) query = query.eq("subcategory_id", params.subcategory);
  if (params?.min) query = query.gte("price", params.min);
  if (params?.max) query = query.lte("price", params.max);
  if (params?.sort === "price-asc") query = query.order("price", { ascending: true });
  else if (params?.sort === "price-desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, count, error } = await query.range(from, to);
  if (error) {
    throw error;
  }

  return { products: (data ?? []) as Product[], count: count ?? 0 };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("slug", slug).single();
  if (error) {
    return null;
  }
  return data as Product;
}

export async function getFeaturedProducts(filter?: "featured" | "new" | "best") {
  const { products } = await getProducts({ pageSize: 8 });
  if (filter === "new") return products.filter((product) => product.is_new);
  if (filter === "best") return products.filter((product) => product.is_best_seller);
  return products.filter((product) => product.featured).slice(0, 8);
}
