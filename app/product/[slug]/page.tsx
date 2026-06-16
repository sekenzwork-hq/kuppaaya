import { notFound } from "next/navigation";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { ProductDetail } from "@/components/shop/product-detail";
import { getProductBySlug } from "@/lib/services/products";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main>
      <ProductDetail product={product} />
      <FeaturedProducts title="Related Products" filter="featured" />
    </main>
  );
}
