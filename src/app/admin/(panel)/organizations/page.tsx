import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { deleteOrganization } from "./actions";
import { ORG_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await prisma.organization.findMany({ orderBy: { name: "asc" }, take: 200 });
  const label = (k: string) => ORG_TYPES.find((t) => t.key === k)?.label ?? k;
  return (
    <div>
      <AdminPageHeader title="Organizations" description="Universities, colleges, research centers, incubators, startups, companies and GCCs."
        action={<Link href="/admin/organizations/new" className="btn-primary"><Plus className="h-4 w-4" /> New Organization</Link>} />
      {items.length === 0 ? (
        <EmptyState title="No organizations yet" actionHref="/admin/organizations/new" actionLabel="New Organization" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Name</th><th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Location</th><th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3"><Link href={`/admin/organizations/${o.id}/edit`} className="font-medium text-navy hover:text-green-700 clamp-1">{o.name}</Link></td>
                  <td className="px-3 py-3 text-stone-500">{label(o.type)}</td>
                  <td className="px-3 py-3 text-stone-500">{o.location ?? "—"}</td>
                  <td className="px-3 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3"><div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/organizations/${o.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                    <form action={deleteOrganization}><input type="hidden" name="id" value={o.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this organization?" /></form>
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
