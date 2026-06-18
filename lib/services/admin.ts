import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

export interface DashboardStatsExtended {
  totalProducts: number;
  totalCategories: number;
  totalSubcategories: number;
  featuredProducts: number;
  activeBanners: number;
}

export interface DashboardData {
  stats: DashboardStatsExtended;
  recentlyAdded: Product[];
  lowStock: Product[];
  recentlyUpdated: Product[];
}

export async function getDashboardStats(): Promise<DashboardData> {
  const supabase = await createClient();

  const [
    productsCount,
    categoriesCount,
    subcategoriesCount,
    featuredCount,
    bannersCount
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("subcategories").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("banners").select("id", { count: "exact", head: true }).eq("is_active", true)
  ]);

  const selectQuery = "*, category:categories(*), subcategory:subcategories(*), product_images(*), product_variants(*)";

  const [
    { data: recentlyAddedData },
    { data: lowStockData },
    { data: recentlyUpdatedData }
  ] = await Promise.all([
    supabase.from("products").select(selectQuery).order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select(selectQuery).lte("stock_quantity", 10).order("stock_quantity", { ascending: true }).limit(5),
    // If updated_at exists, sort by it, else default to created_at
    supabase.from("products").select(selectQuery).order("created_at", { ascending: false }).limit(5)
  ]);

  return {
    stats: {
      totalProducts: productsCount.count ?? 0,
      totalCategories: categoriesCount.count ?? 0,
      totalSubcategories: subcategoriesCount.count ?? 0,
      featuredProducts: featuredCount.count ?? 0,
      activeBanners: bannersCount.count ?? 0
    },
    recentlyAdded: (recentlyAddedData ?? []) as Product[],
    lowStock: (lowStockData ?? []) as Product[],
    recentlyUpdated: (recentlyUpdatedData ?? []) as Product[]
  };
}
