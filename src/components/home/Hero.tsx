import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Lock } from "lucide-react";
import { formatDate, links } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/queries";
import { ArticleListItem } from "@/components/content/ArticleCard";

type Featured = Awaited<
  ReturnType<typeof import("@/lib/queries").getFeaturedArticle>
>;

export function Hero({
  featured,
  side,
}: {
  featured: NonNullable<Featured>;
  side: ArticleCardData[];
}) {
  const href = links.article(featured.slug);
  return (
    <section className="container-editorial pt-8 lg:pt-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Hero story */}
        <div className="lg:col-span-2">
          <Link href={href} className="img-hover relative block aspect-[16/9] overflow-hidden rounded-xl bg-stone-100">
            {featured.featuredImage && (
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            )}
          </Link>
          <div className="mt-5">
            <div className="flex items-center gap-3">
              {featured.category && (
                <Link href={links.category(featured.category.slug)} className="badge-cat text-sm hover:text-green-700">
                  {featured.category.name}
                </Link>
              )}
              {featured.premium && (
                <span className="inline-flex items-center gap-1 rounded bg-navy px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  <Lock className="h-3 w-3" /> Premium
                </span>
              )}
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              <Link href={href} className="hover:text-green-700">
                {featured.title}
              </Link>
            </h1>
            {featured.subtitle && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
                {featured.subtitle}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
              {featured.author && (
                <span className="font-medium text-navy">{featured.author.name}</span>
              )}
              <span aria-hidden>·</span>
              <time>{formatDate(featured.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {featured.readingMinutes} min read
              </span>
            </div>
            <Link href={href} className="btn-primary mt-6">
              Read Full Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Side rail — more headlines */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-5">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-green-600">
              More Headlines
            </h2>
            <div className="mt-2">
              {side.slice(0, 5).map((a) => (
                <ArticleListItem key={a.id} article={a} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
