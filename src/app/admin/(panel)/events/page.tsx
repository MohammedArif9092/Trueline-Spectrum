import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge, EmptyState } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/FormButtons";
import { deleteEvent } from "./actions";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await prisma.event.findMany({ orderBy: { startDate: "desc" }, take: 100 });
  return (
    <div>
      <AdminPageHeader title="Events" description="Upcoming and past events."
        action={<Link href="/admin/events/new" className="btn-primary"><Plus className="h-4 w-4" /> New Event</Link>} />
      {items.length === 0 ? (
        <EmptyState title="No events yet" actionHref="/admin/events/new" actionLabel="New Event" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Event</th><th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Location</th><th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3"><Link href={`/admin/events/${e.id}/edit`} className="font-medium text-navy hover:text-green-700 clamp-1">{e.name}</Link></td>
                  <td className="px-3 py-3 text-stone-500">{formatDateShort(e.startDate)}</td>
                  <td className="px-3 py-3 text-stone-500">{e.location ?? "—"}</td>
                  <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3"><div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/events/${e.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                    <form action={deleteEvent}><input type="hidden" name="id" value={e.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this event?" /></form>
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
