import { BrandStory } from "@/components/sections/brand-story";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { HeroSection } from "@/components/sections/hero-section";
import { InstagramShowcase } from "@/components/sections/instagram-showcase";
import { Newsletter } from "@/components/sections/newsletter";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyKuppaaya } from "@/components/sections/why-kuppaaya";
import { TrendingNow } from "@/components/sections/trending-now";
import { ShopByOccasion } from "@/components/sections/shop-by-occasion";

export default function HomePage() {
  return (
    <main className="bg-[#fcfdff]">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. FEATURED COLLECTIONS (Category Cards Showcase) */}
      <CategoryShowcase />

      {/* 3. WHY KUPPAAYA SECTION */}
      <WhyKuppaaya />

      {/* 4. TRENDING NOW SECTION (Horizontal Showcase) */}
      <TrendingNow />

      {/* 5. SHOP BY OCCASION SECTION */}
      <ShopByOccasion />

      {/* 6. BRAND STORY SECTION */}
      <BrandStory />

      {/* 7. TESTIMONIALS SECTION */}
      <Testimonials />

      {/* 8. INSTAGRAM SECTION */}
      <InstagramShowcase />

      {/* 9. NEWSLETTER SECTION */}
      <Newsletter />
    </main>
  );
}
