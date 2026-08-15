import Link from "next/link";
import { Building2 } from "lucide-react";
import { links } from "@/lib/utils";
import { SmartImage } from "@/components/content/SmartImage";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

type ResearchData = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  researchCategory: string;
  institution: string | null;
  featuredImage: string | null;
};

function catLabel(key: string) {
  return RESEARCH_CATEGORIES.find((c) => c.key === key)?.label ?? "Research";
}

export function ResearchCard({ item }: { item: ResearchData }) {
  return (
    <article className="group flex flex-col">
      <Link href={links.research(item.slug)} className="img-hover relative block aspect-[16/10] overflow-hidden rounded-lg bg-stone-100">
        {item.featuredImage && (
          <SmartImage src={item.featuredImage} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        )}
        <span className="absolute left-3 top-3 rounded bg-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          {catLabel(item.researchCategory)}
        </span>
      </Link>
      <h3 className="mt-4 text-lg font-bold leading-snug text-navy">
        <Link href={links.research(item.slug)} className="hover:text-green-700 clamp-2">{item.title}</Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500 clamp-3">{item.summary}</p>
      {item.institution && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-stone-400">
          <Building2 className="h-3.5 w-3.5" /> {item.institution}
        </p>
      )}
    </article>
  );
}
