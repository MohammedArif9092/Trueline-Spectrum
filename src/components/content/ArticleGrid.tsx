import { ArticleCard } from "./ArticleCard";
import type { ArticleCardData } from "@/lib/queries";

export function ArticleGrid({
  articles,
  emptyMessage = "No articles published in this section yet.",
}: {
  articles: ArticleCardData[];
  emptyMessage?: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
