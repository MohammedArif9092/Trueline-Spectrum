import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ActionButton } from "@/components/admin/FormButtons";
import { updateArticle, deleteArticle } from "../../actions";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditArticlePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [article, categories, authors] = await Promise.all([
    prisma.article.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.author.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!article) notFound();

  const update = updateArticle.bind(null, id);

  return (
    <div>
      <AdminPageHeader
        title="Edit Article"
        description={article.title}
        action={
          <div className="flex items-center gap-2">
            {article.status === "PUBLISHED" && (
              <a href={links.article(article.slug)} target="_blank" rel="noreferrer" className="btn-outline">
                <ExternalLink className="h-4 w-4" /> View
              </a>
            )}
            <form action={deleteArticle}>
              <input type="hidden" name="id" value={article.id} />
              <ActionButton label="Delete" icon="trash" className="btn-outline" confirm="Delete this article permanently?" />
            </form>
          </div>
        }
      />

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> Changes saved.
        </div>
      )}

      <ArticleForm article={article} categories={categories} authors={authors} action={update} />

      <div className="mt-4">
        <Link href="/admin/articles" className="text-sm text-stone-500 hover:text-green-600">← Back to all articles</Link>
      </div>
    </div>
  );
}
