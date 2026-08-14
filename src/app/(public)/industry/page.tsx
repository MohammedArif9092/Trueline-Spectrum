import type { Metadata } from "next";
import { getArticlesBySection, getOrganizations } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { OrgCard } from "@/components/content/OrgCard";
import { SectionHeading } from "@/components/content/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Industry",
  description: "Manufacturing, GCCs, digital transformation and corporate innovation.",
};

export default async function Page() {
  const [articles, companies] = await Promise.all([
    getArticlesBySection("industry", 12),
    getOrganizations("company", 4),
  ]);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="Business & innovation"
        title="Industry"
        description="Manufacturing, global capability centres, digital transformation and corporate innovation."
        breadcrumb={[{ label: "Industry" }]}
      />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} emptyMessage="No industry stories published yet." />
        {companies.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Companies" title="Featured Companies" href="/organizations?type=company" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((o) => (
                <OrgCard key={o.id} org={o} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
