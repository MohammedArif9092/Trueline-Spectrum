import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { formatDateShort, links, cn } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/queries";

function PremiumTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-navy px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
      <Lock className="h-2.5 w-2.5" /> Premium
    </span>
  );
}

/** Standard vertical grid card. */
export function ArticleCard({
  article,
  className,
  imagePriority = false,
}: {
  article: ArticleCardData;
  className?: string;
  imagePriority?: boolean;
}) {
  const href = links.article(article.slug);
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="img-hover relative block aspect-[16/10] overflow-hidden rounded-lg bg-stone-100">
        {article.featuredImage && (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={imagePriority}
            className="object-cover"
          />
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          {article.category && (
            <Link href={links.category(article.category.slug)} className="badge-cat hover:text-green-700">
              {article.category.name}
            </Link>
          )}
          {article.premium && <PremiumTag />}
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug text-navy">
          <Link href={href} className="hover:text-green-700 clamp-3">
            {article.title}
          </Link>
        </h3>
        {article.subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500 clamp-2">
            {article.subtitle}
          </p>
        )}
        <div className="meta mt-3 flex items-center gap-2">
          {article.author && <span>{article.author.name}</span>}
          {article.author && <span aria-hidden>·</span>}
          <time>{formatDateShort(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}

/** Horizontal list row, optionally numbered (Top Stories). */
export function ArticleListItem({
  article,
  rank,
}: {
  article: ArticleCardData;
  rank?: number;
}) {
  const href = links.article(article.slug);
  return (
    <article className="group flex items-start gap-4 border-b border-stone-100 py-4 last:border-0">
      {typeof rank === "number" && (
        <span className="w-8 shrink-0 font-serif text-2xl font-bold text-green-500">
          {rank < 10 ? `0${rank}` : rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {article.category && <span className="badge-cat">{article.category.name}</span>}
          {article.premium && <PremiumTag />}
        </div>
        <h3 className="mt-1 font-semibold leading-snug text-navy">
          <Link href={href} className="hover:text-green-700 clamp-2">
            {article.title}
          </Link>
        </h3>
        <div className="meta mt-1">
          <time>{formatDateShort(article.publishedAt)}</time>
          <span className="mx-1.5" aria-hidden>·</span>
          <span>{article.readingMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}

/** Compact card with side thumbnail (used in section columns). */
export function ArticleCompact({ article }: { article: ArticleCardData }) {
  const href = links.article(article.slug);
  return (
    <article className="group flex items-start gap-3">
      <Link href={href} className="img-hover relative block h-20 w-28 shrink-0 overflow-hidden rounded-md bg-stone-100">
        {article.featuredImage && (
          <Image src={article.featuredImage} alt={article.title} fill sizes="112px" className="object-cover" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        {article.category && <span className="badge-cat">{article.category.name}</span>}
        <h3 className="mt-1 text-sm font-semibold leading-snug text-navy">
          <Link href={href} className="hover:text-green-700 clamp-2">
            {article.title}
          </Link>
        </h3>
        <div className="meta mt-1 text-xs">
          <time>{formatDateShort(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
