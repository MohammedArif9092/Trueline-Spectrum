import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Lock, Tag as TagIcon } from "lucide-react";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/queries";
import { formatDate, links } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { ArticleCard } from "@/components/content/ArticleCard";
import { ShareButtons } from "@/components/content/ShareButtons";
import { AdSlot } from "@/components/content/AdSlot";
import { SectionHeading } from "@/components/content/SectionHeading";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.subtitle || article.excerpt || SITE.description;
  const url = `${SITE.url}${links.article(article.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: article.featuredImage ? [{ url: article.featuredImage }] : undefined,
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author ? [article.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  await incrementArticleViews(article.id);
  const related = await getRelatedArticles(article.id, article.categoryId, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.subtitle || article.excerpt || undefined,
    image: article.featuredImage ? [article.featuredImage] : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: article.author
      ? { "@type": "Person", name: article.author.name }
      : { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.logo}` },
    },
    mainEntityOfPage: `${SITE.url}${links.article(article.slug)}`,
  };

  return (
    <article className="pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="container-editorial pt-10">
        <div className="mx-auto max-w-reading">
          <div className="flex items-center gap-3 text-sm">
            {article.category && (
              <Link href={links.category(article.category.slug)} className="badge-cat text-sm hover:text-green-700">
                {article.category.name}
              </Link>
            )}
            {article.premium && (
              <span className="inline-flex items-center gap-1 rounded bg-navy px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <Lock className="h-3 w-3" /> Premium
              </span>
            )}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-[2.6rem]">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="mt-4 text-xl leading-relaxed text-stone-600">{article.subtitle}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-stone-100 py-4">
            <div className="flex items-center gap-3">
              {article.author?.avatar && (
                <Image src={article.author.avatar} alt={article.author.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              )}
              <div className="text-sm">
                {article.author && <p className="font-semibold text-navy">{article.author.name}</p>}
                <p className="flex items-center gap-2 text-stone-500">
                  <time>{formatDate(article.publishedAt)}</time>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} min read
                  </span>
                </p>
              </div>
            </div>
            <ShareButtons path={links.article(article.slug)} title={article.title} />
          </div>
        </div>
      </header>

      {/* Featured image */}
      {article.featuredImage && (
        <figure className="container-editorial mt-8">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-xl bg-stone-100">
            <Image src={article.featuredImage} alt={article.title} fill priority sizes="(max-width:1024px) 100vw, 896px" className="object-cover" />
          </div>
          {article.imageCaption && (
            <figcaption className="mx-auto mt-2 max-w-4xl text-center text-xs text-stone-400">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Body + rail */}
      <div className="container-editorial mt-10">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div
              className="prose-editorial mx-auto max-w-reading"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mx-auto mt-10 max-w-reading">
                <div className="flex flex-wrap items-center gap-2">
                  <TagIcon className="h-4 w-4 text-stone-400" />
                  {article.tags.map(({ tag }) => (
                    <Link
                      key={tag.slug}
                      href={`/search?q=${encodeURIComponent(tag.name)}`}
                      className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600 hover:border-green hover:text-green-600"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            {article.author?.bio && (
              <div className="mx-auto mt-10 max-w-reading rounded-xl border border-stone-100 bg-stone-50 p-6">
                <div className="flex items-start gap-4">
                  {article.author.avatar && (
                    <Image src={article.author.avatar} alt={article.author.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-bold text-navy">{article.author.name}</p>
                    {article.author.title && <p className="text-sm text-green-600">{article.author.title}</p>}
                    <p className="mt-2 text-sm text-stone-600">{article.author.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <AdSlot placement="article" className="aspect-[4/5] w-full" />
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-editorial mt-16">
          <SectionHeading kicker="Keep reading" title="Related Stories" />
          <div className="grid gap-8 sm:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
