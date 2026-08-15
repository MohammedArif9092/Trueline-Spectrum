import { SectionHeading } from "@/components/content/SectionHeading";
import { ArticleListItem } from "@/components/content/ArticleCard";
import type { ArticleCardData } from "@/lib/queries";
import { AdSlot } from "@/components/content/AdSlot";

export function TopStories({ stories }: { stories: ArticleCardData[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="container-editorial mt-16">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading kicker="Editor's picks" title="This Month's Top Stories" href="/news" />
          <div>
            {stories.map((a, i) => (
              <ArticleListItem key={a.id} article={a} rank={i + 1} />
            ))}
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-40 space-y-4">
            <AdSlot placement="homepage" className="aspect-[4/5] w-full" label="Advertisement" />
          </div>
        </aside>
      </div>
    </section>
  );
}
