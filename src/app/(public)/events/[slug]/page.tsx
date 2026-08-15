import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, User, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, links } from "@/lib/utils";
import { SmartImage } from "@/components/content/SmartImage";
import { SITE, EVENT_CATEGORIES } from "@/lib/constants";
import { PageHeader } from "@/components/content/PageHeader";
import { ShareButtons } from "@/components/content/ShareButtons";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

async function getItem(slug: string) {
  return prisma.event.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const e = await getItem(slug);
  if (!e) return { title: "Event not found" };
  return {
    title: e.name,
    description: e.description,
    alternates: { canonical: `${SITE.url}${links.event(e.slug)}` },
    openGraph: { title: e.name, description: e.description, images: e.image ? [e.image] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const e = await getItem(slug);
  if (!e) notFound();
  const catLabel = EVENT_CATEGORIES.find((c) => c.key === e.category)?.label ?? "Event";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString(),
    eventAttendanceMode:
      e.mode === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: e.location ? { "@type": "Place", name: e.location } : undefined,
    description: e.description,
    organizer: e.organizer ? { "@type": "Organization", name: e.organizer } : undefined,
    image: e.image ? [e.image] : undefined,
  };

  return (
    <div className="pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        kicker={catLabel}
        title={e.name}
        breadcrumb={[{ label: "Events", href: "/events" }, { label: catLabel }]}
      />
      <div className="container-editorial py-10">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {e.image && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl bg-stone-100">
                <SmartImage src={e.image} alt={e.name} fill priority sizes="(max-width:1024px) 100vw, 720px" className="object-cover" />
              </div>
            )}
            <div className="prose-editorial">
              <p>{e.description}</p>
            </div>
            <div className="mt-8">
              <ShareButtons path={links.event(e.slug)} title={e.name} />
            </div>
          </div>

          <aside>
            <div className="sticky top-40 rounded-xl border border-stone-100 bg-stone-50 p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <div><dt className="text-stone-400">Date</dt><dd className="text-navy">{formatDate(e.startDate)}</dd></div>
                </div>
                {e.time && (
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <div><dt className="text-stone-400">Time</dt><dd className="text-navy">{e.time}</dd></div>
                  </div>
                )}
                {e.location && (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <div><dt className="text-stone-400">Location</dt><dd className="text-navy">{e.location} · <span className="capitalize">{e.mode}</span></dd></div>
                  </div>
                )}
                {e.organizer && (
                  <div className="flex gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <div><dt className="text-stone-400">Organizer</dt><dd className="text-navy">{e.organizer}</dd></div>
                  </div>
                )}
              </dl>
              {e.registrationUrl && (
                <a href={e.registrationUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">
                  Register <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
