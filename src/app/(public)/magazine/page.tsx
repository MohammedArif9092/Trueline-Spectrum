import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, CalendarDays } from "lucide-react";
import { getMagazines } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { SectionHeading } from "@/components/content/SectionHeading";
import { SmartImage } from "@/components/content/SmartImage";
import { SITE } from "@/lib/constants";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Monthly Magazine Archive",
  description:
    "Browse the month-wise archive of the Trueline Spectrum monthly edition — research, technology, innovation, education, industry and startups, read online.",
};

export default async function Page() {
  const mags = await getMagazines(60);
  const current = mags.find((m) => m.isCurrent) ?? mags[0];

  // Newest → oldest, keyed by year + calendar month.
  const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const archive = [...mags].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return MONTH_ORDER.indexOf(b.month) - MONTH_ORDER.indexOf(a.month);
  });

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Monthly Edition — read online, no downloads"
        title="Magazine"
        description="Explore our monthly editions covering research, technology, innovation, education, industry and startups — read directly in your browser through the Trueline Spectrum digital reader."
        breadcrumb={[{ label: "Magazine" }]}
      />

      <div className="container-editorial py-10">
        {/* Current edition spotlight */}
        {current && (
          <div className="overflow-hidden rounded-2xl border border-stone-100 bg-stone-50">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="flex items-center justify-center bg-navy p-8 lg:p-12">
                <Link
                  href={links.magazine(current.slug)}
                  className="img-hover relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-lg shadow-lift"
                >
                  <SmartImage src={current.coverImage} alt={current.editionTitle} fill sizes="320px" className="object-cover" priority />
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
                    <BookOpen className="h-4 w-4" /> Read Issue
                  </Link>
                  <Link href={links.magazine(current.slug)} className="btn-outline">
                    View Contents <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick issue switcher — browse by month */}
        {archive.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {archive.map((m) => (
                <Link
                  key={m.id}
                  href={links.magazine(m.slug)}
                  className={
                    m.isCurrent || m.id === current?.id
                      ? "shrink-0 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                      : "shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-green hover:text-green-700"
                  }
                >
                  {m.isCurrent || m.id === current?.id ? "Current Issue — " : ""}
                  {m.month} {m.year}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Month-wise archive */}
        {archive.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Archive" title="Browse by Month" />
            <div className="grid gap-5">
              {archive.map((m) => (
                <article
                  key={m.id}
                  className="group flex flex-col gap-5 rounded-xl border border-stone-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lift sm:flex-row sm:items-center"
                >
                  {/* Cover thumbnail */}
                  <Link
                    href={links.magazine(m.slug)}
                    className="img-hover relative hidden aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-md bg-stone-100 shadow-card sm:block"
                  >
                    <SmartImage src={m.coverImage} alt={m.editionTitle} fill sizes="80px" className="object-cover" />
                  </Link>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-green-600">
                        <CalendarDays className="h-3.5 w-3.5" /> {m.month} {m.year}
                      </span>
                      {m.isCurrent && (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug text-navy">
                      <Link href={links.magazine(m.slug)} className="hover:text-green-700">
                        {m.editionTitle || `${SITE.name} — ${m.month} ${m.year}`}
                      </Link>
                    </h3>
                    {m.theme && <p className="mt-1 text-sm text-stone-600 clamp-2">{m.theme}</p>}
                  </div>

                  {/* CTA */}
                  <div className="shrink-0">
                    <Link
                      href={links.magazine(m.slug)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-navy/15 px-4 py-2 text-sm font-semibold text-navy transition-colors group-hover:border-green group-hover:bg-green group-hover:text-white"
                    >
                      Read Issue
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
