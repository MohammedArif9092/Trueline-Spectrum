import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { getMagazines } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { SectionHeading } from "@/components/content/SectionHeading";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Digital Magazine",
  description: "Read the current edition and browse the archive of the Trueline Spectrum digital magazine online.",
};

export default async function Page() {
  const mags = await getMagazines(24);
  const current = mags.find((m) => m.isCurrent) ?? mags[0];
  const previous = mags.filter((m) => m.id !== current?.id);

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Read online — no downloads"
        title="The Digital Magazine"
        description="Our monthly editorial edition, read directly in your browser through the Trueline Spectrum digital reader."
        breadcrumb={[{ label: "Magazine" }]}
      />

      <div className="container-editorial py-10">
        {/* Current edition */}
        {current && (
          <div className="overflow-hidden rounded-2xl border border-stone-100 bg-stone-50">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="flex items-center justify-center bg-navy p-8 lg:p-12">
                <Link href={links.magazineRead(current.slug)} className="img-hover relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-lg shadow-lift">
                  <Image src={current.coverImage} alt={current.editionTitle} fill sizes="320px" className="object-cover" priority />
                </Link>
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green-600">
                  <BookOpen className="h-4 w-4" /> Current Edition
                </span>
                <p className="mt-2 text-sm font-medium text-stone-500">{current.month} {current.year}</p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-navy">{current.theme || current.editionTitle}</h2>
                {current.description && <p className="mt-4 max-w-lg text-stone-600">{current.description}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={links.magazineRead(current.slug)} className="btn-primary">
                    <BookOpen className="h-4 w-4" /> Read Magazine
                  </Link>
                  <Link href={links.magazine(current.slug)} className="btn-outline">
                    View Contents <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive */}
        {previous.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Archive" title="Previous Editions" />
            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {previous.map((m) => (
                <article key={m.id} className="group">
                  <Link href={links.magazine(m.slug)} className="img-hover relative block aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-card">
                    <Image src={m.coverImage} alt={m.editionTitle} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                  </Link>
                  <p className="mt-3 text-xs font-medium text-stone-500">{m.month} {m.year}</p>
                  <h3 className="mt-1 font-semibold leading-snug text-navy">
                    <Link href={links.magazine(m.slug)} className="hover:text-green-700 clamp-2">{m.theme || m.editionTitle}</Link>
                  </h3>
                  <Link href={links.magazineRead(m.slug)} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700">
                    Read <BookOpen className="h-3.5 w-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
