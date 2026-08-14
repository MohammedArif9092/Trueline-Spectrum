import type { Metadata } from "next";
import { getArticlesBySection, getOrganizations } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { OrgCard } from "@/components/content/OrgCard";
import { SectionHeading } from "@/components/content/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Startups",
  description: "Startup profiles, founders and venture stories across the innovation ecosystem.",
};

export default async function Page() {
  const [startups, incubators, articles] = await Promise.all([
    getOrganizations("startup", 8),
    getOrganizations("incubation", 4),
    getArticlesBySection("startups", 9),
  ]);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="Founders & ventures"
        title="Startups"
        description="Startup profiles, founders and the ventures building the deep-tech economy."
        breadcrumb={[{ label: "Startups" }]}
      />
      <div className="container-editorial py-10">
        <SectionHeading kicker="Profiles" title="Startup Directory" href="/organizations?type=startup" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {startups.map((o) => (
            <OrgCard key={o.id} org={o} />
          ))}
        </div>

        {articles.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Reporting" title="Startup Stories" />
            <ArticleGrid articles={articles} />
          </div>
        )}

        {incubators.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Ecosystem" title="Incubation Centres" href="/organizations?type=incubation" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {incubators.map((o) => (
                <OrgCard key={o.id} org={o} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
