import type { MetadataRoute } from "next";
import { products } from "@/lib/sample-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kuppaaya.com";
  return [
    "",
    "/shop",
    "/about",
    "/contact",
    ...products.map((product) => `/product/${product.slug}`)
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8
  }));
}
