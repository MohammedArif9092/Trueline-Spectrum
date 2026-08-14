import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticle } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.author.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <AdminPageHeader title="New Article" description="Create a new editorial article." />
      <ArticleForm categories={categories} authors={authors} action={createArticle} />
    </div>
  );
}
