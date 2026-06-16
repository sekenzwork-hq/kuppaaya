import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/services/products";

export async function FeaturedProducts({
  title,
  subtitle,
  filter
}: {
  title: string;
  subtitle?: string;
  filter: "featured" | "new" | "best";
}) {
  const products = await getFeaturedProducts(filter);

  return (
    <section className="py-24 bg-white">
      <div className="container-shell">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Kuppaaya Edit</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">{title}</h2>
            {subtitle ? <p className="mt-3 text-sm text-[#6b6680]">{subtitle}</p> : null}
          </div>
          <ButtonLink href={`/shop?sort=${filter}`} variant="ghost" className="self-start md:self-end">
            View All Collection
          </ButtonLink>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
