import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedBots } from "@/components/home/featured-bots";
import { Features } from "@/components/home/features";
import { CopyEASection } from "@/components/home/copy-ea";
import { CTA } from "@/components/home/cta";
import {
  getFeaturedBots,
  getCategories,
  getCopyProviders,
  getPlatformStats,
} from "@/lib/data";

export default async function HomePage() {
  const [bots, categories, providers] = await Promise.all([
    getFeaturedBots(),
    getCategories(),
    getCopyProviders(),
  ]);

  return (
    <>
      <Hero stats={getPlatformStats()} />
      <Categories categories={categories} />
      <FeaturedBots bots={bots} />
      <Features />
      <CopyEASection providers={providers} />
      <CTA />
    </>
  );
}
