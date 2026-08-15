import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, List } from "lucide-react";
import { getMagazineBySlug } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { SmartImage } from "@/components/content/SmartImage";
import { links } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMagazineBySlug(slug);
  if (!m) return { title: "Edition not found" };
  return {
    title: `${m.editionTitle} — ${m.theme ?? "Digital Magazine"}`,
    description: m.description || `${m.month} ${m.year} edition of the ${SITE.name} digital magazine.`,
    alternates: { canonical: `${SITE.url}${links.magazine(m.slug)}` },
    openGraph: { title: m.editionTitle, description: m.description || undefined, images: [m.coverImage] },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const m = await getMagazineBySlug(slug);
  if (!m) notFound();

  return (
    <div className="pb-8">
      <PageHeader
        kicker={`${m.month} ${m.year} Edition`}
        title={m.theme || m.editionTitle}
        breadcrumb={[{ label: "Magazine", href: "/magazine" }, { label: m.editionTitle }]}
      />
      <div className="container-editorial py-10">
        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Cover + CTA */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100 shadow-lift">
              <SmartImage src={m.coverImage} alt={m.editionTitle} fill sizes="320px" className="object-cover" priority />
            </div>
            <Link href={links.magazineRead(m.slug)} className="btn-primary mt-5 w-full">
              <BookOpen className="h-4 w-4" /> Read Magazine
            </Link>
            <p className="mt-3 text-center text-xs text-stone-400">Read online — no downloads required.</p>
          </div>

          {/* Description + TOC */}
          <div>
            {m.description && <p className="text-lg leading-relaxed text-stone-700">{m.description}</p>}
            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-bold text-navy">
                <List className="h-5 w-5 text-green-600" /> Table of Contents
              </h2>
              <ol className="mt-4 divide-y divide-stone-100">
                {m.pages.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`${links.magazineRead(m.slug)}?page=${p.pageNumber}`}
                      className="flex items-center gap-4 py-3 text-navy hover:text-green-700"
                    >
                      <span className="w-8 font-serif text-lg font-bold text-green-500">
                        {p.pageNumber < 10 ? `0${p.pageNumber}` : p.pageNumber}
                      </span>
                      <span className="font-medium">{p.title || `Page ${p.pageNumber}`}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
