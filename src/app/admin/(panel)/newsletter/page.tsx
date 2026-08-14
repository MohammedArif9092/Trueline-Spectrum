import { Trash2, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { deleteSubscriber } from "./actions";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [subs, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description="Subscribers captured from the site. No reader accounts are created."
        action={
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-700">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-semibold">{total} active</span>
          </div>
        }
      />
      {subs.length === 0 ? (
        <EmptyState title="No subscribers yet" hint="Submissions from the homepage and footer forms appear here." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Email</th><th className="px-3 py-3">Source</th>
              <th className="px-3 py-3">Subscribed</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3 font-medium text-navy">{s.email}</td>
                  <td className="px-3 py-3 text-stone-500">{s.source ?? "—"}</td>
                  <td className="px-3 py-3 text-stone-500">{formatDateShort(s.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <form action={deleteSubscriber} className="inline">
                      <input type="hidden" name="id" value={s.id} />
                      <ActionButton label="" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Remove this subscriber?"><Trash2 className="h-4 w-4" /></ActionButton>
                    </form>
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
