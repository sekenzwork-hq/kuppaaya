import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://kuppaaya.com";
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select("slug");
  if (error) {
    throw error;
  }

  return [
    "",
    "/shop",
    "/about",
    "/contact",
    ...(products || []).map((product) => `/product/${product.slug}`)
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8
  }));
}
