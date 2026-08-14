import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { deleteResearch } from "./actions";
import { formatDateShort } from "@/lib/utils";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await prisma.research.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });
  const label = (k: string) => RESEARCH_CATEGORIES.find((c) => c.key === k)?.label ?? k;

  return (
    <div>
      <AdminPageHeader title="Research" description="Research articles, publications, patents and innovation."
        action={<Link href="/admin/research/new" className="btn-primary"><Plus className="h-4 w-4" /> New Research</Link>} />
      {items.length === 0 ? (
        <EmptyState title="No research yet" actionHref="/admin/research/new" actionLabel="New Research" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3">Title</th><th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Status</th><th className="px-3 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3"><Link href={`/admin/research/${r.id}/edit`} className="font-medium text-navy hover:text-green-700 clamp-1">{r.title}</Link></td>
                  <td className="px-3 py-3 text-stone-500">{label(r.researchCategory)}</td>
                  <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-3 text-stone-500">{formatDateShort(r.updatedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/research/${r.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                      <form action={deleteResearch}><input type="hidden" name="id" value={r.id} />
                        <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this research entry?" /></form>
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
