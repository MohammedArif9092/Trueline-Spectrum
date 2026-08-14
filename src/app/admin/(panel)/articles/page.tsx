import Link from "next/link";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { setArticleStatus, deleteArticle } from "./actions";
import { formatDateShort, links, cn } from "@/lib/utils";
import { ARTICLE_STATUS, STATUS_LABELS } from "@/lib/constants";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function ArticlesPage({ searchParams }: Props) {
  const { status, q } = await searchParams;
  const activeStatus = status && ARTICLE_STATUS.includes(status as never) ? status : undefined;

  const where: Prisma.ArticleWhereInput = {
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(q ? { title: { contains: q } } : {}),
  };

  const articles = await prisma.article.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { category: { select: { name: true } }, author: { select: { name: true } } },
  });

  const tabs = [{ key: undefined, label: "All" }, ...ARTICLE_STATUS.map((s) => ({ key: s, label: STATUS_LABELS[s] }))];

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description="Manage all editorial content and the publishing workflow."
        action={<Link href="/admin/articles/new" className="btn-primary"><Plus className="h-4 w-4" /> New Article</Link>}
      />

      {/* Status tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/articles?status=${t.key}` : "/admin/articles"}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium",
              (activeStatus ?? undefined) === t.key
                ? "border-green bg-green text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-green"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form action="/admin/articles" method="get" className="mb-5 flex max-w-md gap-2">
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        <input name="q" defaultValue={q} placeholder="Search titles…"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green" />
        <button className="btn-outline">Search</button>
      </form>

      {articles.length === 0 ? (
        <EmptyState title="No articles found" hint="Try a different filter or create a new article." actionHref="/admin/articles/new" actionLabel="New Article" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/articles/${a.id}/edit`} className="font-medium text-navy hover:text-green-700 clamp-1">
                      {a.title}
                    </Link>
                    <div className="mt-0.5 flex gap-1.5 text-[11px] text-stone-400">
                      {a.featured && <span className="rounded bg-green-50 px-1.5 text-green-700">Featured</span>}
                      {a.trending && <span className="rounded bg-navy-50 px-1.5 text-navy">Trending</span>}
                      {a.premium && <span className="rounded bg-stone-100 px-1.5">Premium</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-stone-500">{a.category?.name ?? "—"}</td>
                  <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-3 text-stone-500">{formatDateShort(a.updatedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {a.status !== "PUBLISHED" && (
                        <form action={setArticleStatus}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="status" value="PUBLISHED" />
                          <ActionButton label="Publish" className="btn-ghost px-2 py-1 text-xs text-green-600" />
                        </form>
                      )}
                      {a.status === "PUBLISHED" && (
                        <>
                          <a href={links.article(a.slug)} target="_blank" rel="noreferrer" className="rounded p-1.5 text-stone-400 hover:text-green-600" title="View">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <form action={setArticleStatus}>
                            <input type="hidden" name="id" value={a.id} />
                            <input type="hidden" name="status" value="ARCHIVED" />
                            <ActionButton label="Archive" className="btn-ghost px-2 py-1 text-xs text-stone-500" />
                          </form>
                        </>
                      )}
                      <Link href={`/admin/articles/${a.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteArticle}>
                        <input type="hidden" name="id" value={a.id} />
                        <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this article permanently?" />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
