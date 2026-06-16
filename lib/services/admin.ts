import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";
import { getLocalDb } from "./local-db";

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
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!hasSupabase) {
    const db = getLocalDb();
    
    // Map relations locally
    const getFullProduct = (p: any): Product => {
      const cat = db.categories.find(c => String(c.id) === String(p.category_id));
      const subcat = db.subcategories.find(sc => String(sc.id) === String(p.subcategory_id));
      const imgs = db.product_images.filter(img => String(img.product_id) === String(p.id));
      const variants = db.product_variants.filter(v => String(v.product_id) === String(p.id));
      
      return {
        ...p,
        category: cat || undefined,
        subcategory: subcat || undefined,
        product_images: imgs,
        product_variants: variants
      };
    };

    const allProducts = db.products.map(getFullProduct);
    const totalProducts = db.products.length;
    const totalCategories = db.categories.length;
    const totalSubcategories = db.subcategories.length;
    const featuredProducts = db.products.filter(p => p.is_featured).length;
    const activeBanners = db.banners.filter(b => b.is_active).length;

    // Recently added (sort by created_at desc)
    const recentlyAdded = [...allProducts]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5);

    // Low stock (stock <= 10)
    const lowStock = [...allProducts]
      .filter(p => p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // Recently updated (fallback to recently added or order by created_at desc)
    const recentlyUpdated = [...allProducts]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5);

    return {
      stats: {
        totalProducts,
        totalCategories,
        totalSubcategories,
        featuredProducts,
        activeBanners
      },
      recentlyAdded,
      lowStock,
      recentlyUpdated
    };
  }

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
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("banners").select("id", { count: "exact", head: true }).eq("is_active", true)
  ]);

  const selectQuery = "*, category:categories(*), subcategory:subcategories(*), product_images(*), product_variants(*)";

  const [
    { data: recentlyAddedData },
    { data: lowStockData },
    { data: recentlyUpdatedData }
  ] = await Promise.all([
    supabase.from("products").select(selectQuery).order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select(selectQuery).lte("stock", 10).order("stock", { ascending: true }).limit(5),
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
