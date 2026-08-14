import { SectionHeading } from "@/components/content/SectionHeading";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { ArticleCardData } from "@/lib/queries";

export function LatestNews({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="container-editorial mt-16">
      <SectionHeading kicker="Fresh from the newsroom" title="Latest News" href="/news" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
