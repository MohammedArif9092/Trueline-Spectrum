import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getArticlesByCategorySlug } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return { title: "Category not found" };
  return {
    title: cat.name,
    description: cat.description || `${cat.name} coverage from ${SITE.name}.`,
    alternates: { canonical: `${SITE.url}/category/${cat.slug}` },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) notFound();
  const articles = await getArticlesByCategorySlug(slug, 24);

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Category"
        title={cat.name}
        description={cat.description || undefined}
        breadcrumb={[{ label: "Categories" }, { label: cat.name }]}
      />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} emptyMessage={`No articles in ${cat.name} yet.`} />
      </div>
    </div>
  );
}
