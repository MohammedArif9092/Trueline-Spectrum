import {
  getHomepageSections,
  getFeaturedArticle,
  getTopStories,
  getLatestArticles,
} from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { TopStories } from "@/components/home/TopStories";
import { LatestNews } from "@/components/home/LatestNews";
import { ResearchInnovation } from "@/components/home/ResearchInnovation";
import { SectionSpotlight } from "@/components/home/SectionSpotlight";
import { StartupSpotlight } from "@/components/home/StartupSpotlight";
import { EventsSection } from "@/components/home/EventsSection";
import { MagazineTeaser } from "@/components/home/MagazineTeaser";
import { PremiumTeaser } from "@/components/home/PremiumTeaser";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sections = await getHomepageSections();

  // Shared article pools (fetched once, de-duplicated across the top sections).
  const featured = await getFeaturedArticle();
  const featuredId = featured?.id ? [featured.id] : [];
  const topStories = await getTopStories(5, featuredId);
  const usedIds = [...featuredId, ...topStories.map((a) => a.id)];
  const latest = await getLatestArticles(8, usedIds);

  // Map each CMS section key to its rendered node.
  const registry: Record<string, React.ReactNode> = {
    hero: featured ? <Hero key="hero" featured={featured} side={topStories} /> : null,
    topStories: <TopStories key="topStories" stories={topStories} />,
    latest: <LatestNews key="latest" articles={latest} />,
    research: <ResearchInnovation key="research" />,
    education: (
      <SectionSpotlight
        key="education"
        section="education"
        title="Education"
        kicker="Universities & academia"
        href="/education"
      />
    ),
    industry: (
      <SectionSpotlight
        key="industry"
        section="industry"
        title="Industry"
        kicker="Business & innovation"
        href="/industry"
      />
    ),
    startups: <StartupSpotlight key="startups" />,
    events: <EventsSection key="events" />,
    magazine: <MagazineTeaser key="magazine" />,
    premium: <PremiumTeaser key="premium" />,
    newsletter: <NewsletterSection key="newsletter" />,
  };

  return (
    <div className="pb-8">
      {sections.map((s) => registry[s.key]).filter(Boolean)}
    </div>
  );
}
