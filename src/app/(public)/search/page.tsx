import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { searchContent, type SearchType } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ResearchCard } from "@/components/content/ResearchCard";
import { EventCard } from "@/components/content/EventCard";
import { OrgCard } from "@/components/content/OrgCard";
import { SectionHeading } from "@/components/content/SectionHeading";
import { links, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

const TYPES: { key: SearchType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "article", label: "Articles" },
  { key: "research", label: "Research" },
  { key: "event", label: "Events" },
  { key: "organization", label: "Organizations" },
  { key: "magazine", label: "Magazines" },
];

type Props = { searchParams: Promise<{ q?: string; type?: string }> };

export default async function Page({ searchParams }: Props) {
  const { q = "", type = "all" } = await searchParams;
  const activeType = (TYPES.find((t) => t.key === type)?.key ?? "all") as SearchType;
  const results = q.trim() ? await searchContent(q, activeType) : null;

  const total = results
    ? results.articles.length + results.research.length + results.events.length +
      results.organizations.length + results.magazines.length
    : 0;

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Site-wide search"
        title={q ? `Results for “${q}”` : "Search"}
        description={q ? `${total} result${total === 1 ? "" : "s"} across the platform.` : "Search articles, research, magazines, events and organizations."}
      />
      <div className="container-editorial py-10">
        {/* Search form */}
        <form action="/search" method="get" className="mb-6 flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2">
          <SearchIcon className="h-5 w-5 text-stone-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search the platform…"
            className="w-full bg-transparent py-1.5 text-navy placeholder:text-stone-400 focus:outline-none"
          />
          <input type="hidden" name="type" value={activeType} />
          <button type="submit" className="btn-primary py-1.5">Search</button>
        </form>

        {/* Type filters */}
        {q && (
          <div className="mb-8 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <Link
                key={t.key}
                href={`/search?q=${encodeURIComponent(q)}&type=${t.key}`}
                className={cn("rounded-full border px-4 py-1.5 text-sm font-medium",
                  activeType === t.key ? "border-green bg-green text-white" : "border-stone-200 text-stone-600 hover:border-green")}
              >
                {t.label}
              </Link>
            ))}
          </div>
        )}

        {!q && (
          <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center text-stone-500">
            Enter a search term to begin.
          </p>
        )}

        {q && total === 0 && (
          <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center text-stone-500">
            No results found for “{q}”. Try a different term.
          </p>
        )}

        {results && results.articles.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Editorial" title="Articles" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}

        {results && results.research.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Discovery" title="Research" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.research.map((r) => <ResearchCard key={r.id} item={r} />)}
            </div>
          </section>
        )}

        {results && results.events.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Calendar" title="Events" />
            <div className="grid gap-6 md:grid-cols-2">
              {results.events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}

        {results && results.organizations.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Directory" title="Organizations" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {results.organizations.map((o) => <OrgCard key={o.id} org={o} />)}
            </div>
          </section>
        )}

        {results && results.magazines.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Magazine" title="Editions" />
            <ul className="divide-y divide-stone-100">
              {results.magazines.map((m) => (
                <li key={m.id} className="py-3">
                  <Link href={links.magazine(m.slug)} className="font-semibold text-navy hover:text-green-700">
                    {m.editionTitle}
                  </Link>
                  {m.theme && <span className="text-stone-500"> — {m.theme}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
