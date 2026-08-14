import type { Metadata } from "next";
import Link from "next/link";
import { getResearch } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ResearchCard } from "@/components/content/ResearchCard";
import { RESEARCH_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Research & Innovation",
  description: "Research breakthroughs, publications, patents and innovation stories.",
};

type Search = { params: Promise<{}>; searchParams: Promise<{ category?: string }> };

export default async function Page({ searchParams }: Search) {
  const { category } = await searchParams;
  const active = category && RESEARCH_CATEGORIES.some((c) => c.key === category) ? category : undefined;
  const items = await getResearch(24, active);

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Discovery & innovation"
        title="Research & Innovation"
        description="Breakthroughs, publications, patents and innovation from institutions and industry."
        breadcrumb={[{ label: "Research" }]}
      />
      <div className="container-editorial py-10">
        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/research"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              !active ? "border-green bg-green text-white" : "border-stone-200 text-stone-600 hover:border-green"
            )}
          >
            All
          </Link>
          {RESEARCH_CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/research?category=${c.key}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium",
                active === c.key ? "border-green bg-green text-white" : "border-stone-200 text-stone-600 hover:border-green"
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center text-stone-500">
            No research published in this category yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <ResearchCard key={r.id} item={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
