import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { deleteMagazine } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await prisma.magazine.findMany({
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
    include: { _count: { select: { pages: true } } },
  });
  return (
    <div>
      <AdminPageHeader title="Magazine Editions" description="Manage digital magazine editions and their reader pages."
        action={<Link href="/admin/magazines/new" className="btn-primary"><Plus className="h-4 w-4" /> New Edition</Link>} />
      {items.length === 0 ? (
        <EmptyState title="No editions yet" actionHref="/admin/magazines/new" actionLabel="New Edition" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Edition</th><th className="px-3 py-3">Pages</th>
              <th className="px-3 py-3">Current</th><th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/magazines/${m.id}/edit`} className="font-medium text-navy hover:text-green-700">{m.editionTitle}</Link>
                    <p className="text-xs text-stone-400">{m.month} {m.year}{m.theme ? ` · ${m.theme}` : ""}</p>
                  </td>
                  <td className="px-3 py-3 text-stone-500">{m._count.pages}</td>
                  <td className="px-3 py-3">{m.isCurrent ? <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">Current</span> : <span className="text-stone-300">—</span>}</td>
                  <td className="px-3 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-5 py-3"><div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/magazines/${m.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                    <form action={deleteMagazine}><input type="hidden" name="id" value={m.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this edition and all its pages?" /></form>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
