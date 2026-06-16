import { getFeaturedProducts } from "@/lib/services/products";
import { TrendingNowSlider } from "./trending-now-slider";

export async function TrendingNow() {
  // Fetch featured products for the trending showcase
  const products = await getFeaturedProducts("featured");

  return (
    <section className="py-24 bg-[#fcfdff] overflow-hidden">
      <div className="container-shell">
        {/* Header Block */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Season Favorites</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#21183d] md:text-5xl">
              Trending This Season
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#6b6680] text-left md:text-right">
            See the standout looks turning heads and defining everyday elegance.
          </p>
        </div>

        {/* Scrollable Slider */}
        <TrendingNowSlider products={products} />
      </div>
    </section>
  );
}
