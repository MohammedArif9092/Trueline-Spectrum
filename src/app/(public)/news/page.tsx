import type { Metadata } from "next";
import { getLatestArticles } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { AdSlot } from "@/components/content/AdSlot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description:
    "The latest news across technology, AI, research, education, industry and startups from Trueline Spectrum.",
};

export default async function NewsPage() {
  const articles = await getLatestArticles(24);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="From the newsroom"
        title="News"
        description="The latest reporting across technology, AI, research, education, industry and startups."
        breadcrumb={[{ label: "News" }]}
      />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} />
        <AdSlot placement="homepage" className="mt-12 h-24 w-full" />
      </div>
    </div>
  );
}
