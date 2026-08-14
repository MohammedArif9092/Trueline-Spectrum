import type { Metadata } from "next";
import Link from "next/link";
import { getOrganizations } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { OrgCard } from "@/components/content/OrgCard";
import { ORG_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Organizations",
  description: "A directory of universities, colleges, research centers, incubators, startups, companies and GCCs.",
};

type Props = { searchParams: Promise<{ type?: string }> };

export default async function Page({ searchParams }: Props) {
  const { type } = await searchParams;
  const active = type && ORG_TYPES.some((t) => t.key === type) ? type : undefined;
  const orgs = await getOrganizations(active, 48);

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Institutional directory"
        title="Organizations"
        description="Universities, colleges, research centers, incubation centers, startups, companies and GCCs — curated by our editorial team."
        breadcrumb={[{ label: "Organizations" }]}
      />
      <div className="container-editorial py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/organizations"
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium",
              !active ? "border-green bg-green text-white" : "border-stone-200 text-stone-600 hover:border-green")}
          >
            All
          </Link>
          {ORG_TYPES.map((t) => (
            <Link
              key={t.key}
              href={`/organizations?type=${t.key}`}
              className={cn("rounded-full border px-4 py-1.5 text-sm font-medium",
                active === t.key ? "border-green bg-green text-white" : "border-stone-200 text-stone-600 hover:border-green")}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {orgs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center text-stone-500">
            No organizations listed in this category yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {orgs.map((o) => (
              <OrgCard key={o.id} org={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
