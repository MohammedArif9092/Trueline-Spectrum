import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Globe, Mail, Phone, Award, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";
import { links } from "@/lib/utils";
import { SmartImage } from "@/components/content/SmartImage";
import { SITE, ORG_TYPES } from "@/lib/constants";
import { PageHeader } from "@/components/content/PageHeader";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

async function getOrg(slug: string) {
  return prisma.organization.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const o = await getOrg(slug);
  if (!o) return { title: "Organization not found" };
  return {
    title: o.name,
    description: o.description || `${o.name} profile on ${SITE.name}.`,
    alternates: { canonical: `${SITE.url}${links.organization(o.slug)}` },
    openGraph: { title: o.name, description: o.description || undefined, images: o.coverImage ? [o.coverImage] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const o = await getOrg(slug);
  if (!o) notFound();
  const typeLabel = ORG_TYPES.find((t) => t.key === o.type)?.label ?? "Organization";
  const achievements = (o.achievements || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: o.name,
    description: o.description || undefined,
    url: o.website || `${SITE.url}${links.organization(o.slug)}`,
    logo: o.logo || undefined,
    address: o.location || undefined,
  };

  return (
    <div className="pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader kicker={typeLabel} title={o.name} breadcrumb={[{ label: "Organizations", href: "/organizations" }, { label: typeLabel }]} />

      <div className="container-editorial py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {o.coverImage && (
              <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-xl bg-stone-100">
                <SmartImage src={o.coverImage} alt={o.name} fill priority sizes="(max-width:1024px) 100vw, 720px" className="object-cover" />
              </div>
            )}
            {o.description && (
              <div className="prose-editorial">
                <h2>About</h2>
                <p>{o.description}</p>
              </div>
            )}
            {achievements.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-navy">Achievements</h2>
                <ul className="mt-4 space-y-2">
                  {achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-600">
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside>
            <div className="sticky top-40 rounded-xl border border-stone-100 bg-stone-50 p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white shadow-card">
                  {o.logo && <SmartImage src={o.logo} alt={o.name} fill sizes="64px" className="object-cover" />}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-600">{typeLabel}</p>
                  <p className="font-bold text-navy">{o.name}</p>
                </div>
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                {o.location && (
                  <div className="flex items-center gap-2 text-stone-600"><MapPin className="h-4 w-4 text-green-600" /> {o.location}</div>
                )}
                {o.founded && (
                  <div className="flex items-center gap-2 text-stone-600"><Calendar className="h-4 w-4 text-green-600" /> Founded {o.founded}</div>
                )}
                {o.website && (
                  <a href={o.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-600 hover:underline">
                    <Globe className="h-4 w-4" /> Visit website
                  </a>
                )}
                {o.contactEmail && (
                  <a href={`mailto:${o.contactEmail}`} className="flex items-center gap-2 text-stone-600 hover:text-green-600">
                    <Mail className="h-4 w-4 text-green-600" /> {o.contactEmail}
                  </a>
                )}
                {o.contactPhone && (
                  <div className="flex items-center gap-2 text-stone-600"><Phone className="h-4 w-4 text-green-600" /> {o.contactPhone}</div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
