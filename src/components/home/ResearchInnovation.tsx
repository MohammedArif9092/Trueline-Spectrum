import Link from "next/link";
import Image from "next/image";
import { FlaskConical, Building2 } from "lucide-react";
import { getResearch } from "@/lib/queries";
import { SectionHeading } from "@/components/content/SectionHeading";
import { links } from "@/lib/utils";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

function catLabel(key: string) {
  return RESEARCH_CATEGORIES.find((c) => c.key === key)?.label ?? "Research";
}

export async function ResearchInnovation() {
  const items = await getResearch(4);
  if (items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <section className="mt-16 bg-navy py-14 text-white">
      <div className="container-editorial">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green">
              <FlaskConical className="h-4 w-4" /> Discovery & Innovation
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Research &amp; Innovation</h2>
          </div>
          <Link href="/research" className="text-sm font-semibold text-green hover:text-white">
            View all research →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Lead research story */}
          <Link href={links.research(lead.slug)} className="group block">
            <div className="img-hover relative aspect-[16/9] overflow-hidden rounded-xl bg-navy-600">
              {lead.featuredImage && (
                <Image src={lead.featuredImage} alt={lead.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              )}
            </div>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-green">
              {catLabel(lead.researchCategory)}
            </span>
            <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-white group-hover:text-green">
              {lead.title}
            </h3>
            <p className="mt-2 text-white/70 clamp-3">{lead.summary}</p>
            {lead.institution && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/60">
                <Building2 className="h-3.5 w-3.5" /> {lead.institution}
              </p>
            )}
          </Link>

          {/* Supporting research */}
          <div className="space-y-6">
            {rest.map((r) => (
              <Link
                key={r.id}
                href={links.research(r.slug)}
                className="group flex gap-4 border-b border-white/10 pb-6 last:border-0"
              >
                <div className="img-hover relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-navy-600">
                  {r.featuredImage && (
                    <Image src={r.featuredImage} alt={r.title} fill sizes="128px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-green">
                    {catLabel(r.researchCategory)}
                  </span>
                  <h4 className="mt-1 font-semibold leading-snug text-white group-hover:text-green clamp-2">
                    {r.title}
                  </h4>
                  <p className="mt-1 text-sm text-white/60 clamp-2">{r.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
