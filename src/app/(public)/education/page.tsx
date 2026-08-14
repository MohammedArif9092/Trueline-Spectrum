import type { Metadata } from "next";
import { getArticlesBySection, getOrganizations } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { OrgCard } from "@/components/content/OrgCard";
import { SectionHeading } from "@/components/content/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Education",
  description: "Universities, colleges, accreditation, rankings and academic achievements.",
};

export default async function Page() {
  const [articles, universities] = await Promise.all([
    getArticlesBySection("education", 12),
    getOrganizations("university", 4),
  ]);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="Universities & academia"
        title="Education"
        description="Universities, colleges, accreditation, rankings, and faculty & student achievements."
        breadcrumb={[{ label: "Education" }]}
      />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} emptyMessage="No education stories published yet." />

        {universities.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Institutions" title="Featured Universities" href="/organizations?type=university" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {universities.map((o) => (
                <OrgCard key={o.id} org={o} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
