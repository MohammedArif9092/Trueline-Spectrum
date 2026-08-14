import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Building2, Users, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, links } from "@/lib/utils";
import { SITE, RESEARCH_CATEGORIES } from "@/lib/constants";
import { PageHeader } from "@/components/content/PageHeader";
import { ShareButtons } from "@/components/content/ShareButtons";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

async function getItem(slug: string) {
  return prisma.research.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Research not found" };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `${SITE.url}${links.research(item.slug)}` },
    openGraph: { title: item.title, description: item.summary, images: item.featuredImage ? [item.featuredImage] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();
  const catLabel = RESEARCH_CATEGORIES.find((c) => c.key === item.researchCategory)?.label ?? "Research";

  return (
    <div className="pb-8">
      <PageHeader
        kicker={catLabel}
        title={item.title}
        breadcrumb={[{ label: "Research", href: "/research" }, { label: catLabel }]}
      />
      <div className="container-editorial py-10">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            {item.featuredImage && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl bg-stone-100">
                <Image src={item.featuredImage} alt={item.title} fill priority sizes="(max-width:1024px) 100vw, 720px" className="object-cover" />
              </div>
            )}
            <p className="text-lg leading-relaxed text-stone-700">{item.summary}</p>
            {item.content && (
              <div className="prose-editorial mt-6" dangerouslySetInnerHTML={{ __html: item.content }} />
            )}
            <div className="mt-8">
              <ShareButtons path={links.research(item.slug)} title={item.title} />
            </div>
          </div>

          <aside>
            <div className="sticky top-40 rounded-xl border border-stone-100 bg-stone-50 p-5 text-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-green-600">Research Details</h2>
              <dl className="space-y-3">
                {item.institution && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-stone-400"><Building2 className="h-3.5 w-3.5" /> Institution</dt>
                    <dd className="mt-0.5 text-navy">{item.institution}</dd>
                  </div>
                )}
                {item.researchers && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-stone-400"><Users className="h-3.5 w-3.5" /> Researchers</dt>
                    <dd className="mt-0.5 text-navy">{item.researchers}</dd>
                  </div>
                )}
                {item.publicationInfo && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-stone-400"><FileText className="h-3.5 w-3.5" /> Publication</dt>
                    <dd className="mt-0.5 text-navy">{item.publicationInfo}</dd>
                  </div>
                )}
                {item.publishedAt && (
                  <div>
                    <dt className="text-stone-400">Published</dt>
                    <dd className="mt-0.5 text-navy">{formatDate(item.publishedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
