import Link from "next/link";
import Image from "next/image";
import { getArticlesBySection } from "@/lib/queries";
import { SectionHeading } from "@/components/content/SectionHeading";
import { ArticleCompact } from "@/components/content/ArticleCard";
import { formatDateShort, links } from "@/lib/utils";

/** Editorial spotlight for an article-backed section (Education, Industry, …). */
export async function SectionSpotlight({
  section,
  title,
  kicker,
  href,
}: {
  section: string;
  title: string;
  kicker: string;
  href: string;
}) {
  const articles = await getArticlesBySection(section, 4);
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;

  return (
    <section className="container-editorial mt-16">
      <SectionHeading kicker={kicker} title={title} href={href} />
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Lead */}
        <article className="group">
          <Link href={links.article(lead.slug)} className="img-hover relative block aspect-[16/9] overflow-hidden rounded-lg bg-stone-100">
            {lead.featuredImage && (
              <Image src={lead.featuredImage} alt={lead.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            )}
          </Link>
          {lead.category && <span className="badge-cat mt-4 inline-block">{lead.category.name}</span>}
          <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-navy">
            <Link href={links.article(lead.slug)} className="hover:text-green-700">{lead.title}</Link>
          </h3>
          {lead.subtitle && <p className="mt-2 text-stone-600 clamp-2">{lead.subtitle}</p>}
          <div className="meta mt-3">
            {lead.author && <span>{lead.author.name} · </span>}
            <time>{formatDateShort(lead.publishedAt)}</time>
          </div>
        </article>

        {/* Supporting */}
        <div className="flex flex-col justify-center gap-6">
          {rest.map((a) => (
            <ArticleCompact key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
