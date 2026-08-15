import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getCurrentMagazine } from "@/lib/queries";
import { SmartImage } from "@/components/content/SmartImage";
import { links } from "@/lib/utils";

export async function MagazineTeaser() {
  const mag = await getCurrentMagazine();
  if (!mag) return null;

  return (
    <section className="container-editorial mt-16">
      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-stone-50">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Cover */}
          <div className="relative flex items-center justify-center bg-navy p-8 lg:p-12">
            <div className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-lg shadow-lift">
              <SmartImage
                src={mag.coverImage}
                alt={`${mag.editionTitle} cover`}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
          {/* Details */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green-600">
              <BookOpen className="h-4 w-4" /> The Digital Magazine
            </span>
            <p className="mt-2 text-sm font-medium text-stone-500">
              {mag.month} {mag.year} Edition
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-navy">
              {mag.theme || mag.editionTitle}
            </h2>
            {mag.description && (
              <p className="mt-4 max-w-lg text-stone-600">{mag.description}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={links.magazineRead(mag.slug)} className="btn-primary">
                <BookOpen className="h-4 w-4" /> Read Magazine
              </Link>
              <Link href="/magazine" className="btn-outline">
                Browse Archive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-400">
              Read online in our digital reader — no downloads required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
