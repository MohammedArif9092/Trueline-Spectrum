import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, EmptyState } from "@/components/admin/ui";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-green-50 text-green-700",
  UPDATE: "bg-navy-50 text-navy",
  PUBLISH: "bg-green-50 text-green-700",
  DELETE: "bg-stone-200 text-stone-700",
  LOGIN: "bg-stone-100 text-stone-500",
  LOGOUT: "bg-stone-100 text-stone-500",
};

export default async function Page() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: { select: { name: true } } },
  });

  return (
    <div>
      <AdminPageHeader title="Audit Log" description="A record of administrative actions across the platform." />
      {logs.length === 0 ? (
        <EmptyState title="No activity logged yet" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">When</th><th className="px-3 py-3">Admin</th>
              <th className="px-3 py-3">Action</th><th className="px-3 py-3">Entity</th>
              <th className="px-5 py-3">Detail</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50">
                  <td className="px-5 py-2.5 text-stone-500">{formatDateShort(l.createdAt)}</td>
                  <td className="px-3 py-2.5 text-navy">{l.admin?.name ?? "—"}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_STYLES[l.action] ?? "bg-stone-100 text-stone-600"}`}>{l.action}</span>
                  </td>
                  <td className="px-3 py-2.5 text-stone-500">{l.entity}</td>
                  <td className="px-5 py-2.5 text-stone-500 clamp-1">{l.detail ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
