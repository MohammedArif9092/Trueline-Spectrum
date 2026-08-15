import type { Metadata } from "next";
import { getLatestArticles } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { AdSlot } from "@/components/content/AdSlot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description:
    "Science and technology news across AI, research, education, industry and startups, from the Trueline Spectrum monthly edition.",
};

export default async function NewsPage() {
  const articles = await getLatestArticles(24);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="This month in news"
        title="News"
        description="Science and technology reporting across AI, research, education, industry and startups — curated for this month's edition."
        breadcrumb={[{ label: "News" }]}
      />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} />
        <AdSlot placement="homepage" className="mt-12 h-24 w-full" />
      </div>
    </div>
  );
}
