import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Checkbox } from "@/components/admin/ui";
import { SubmitButton, ActionButton } from "@/components/admin/FormButtons";
import { saveSection, addTicker, toggleTicker, deleteTicker } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [sections, ticker] = await Promise.all([
    prisma.homepageSection.findMany({ orderBy: { order: "asc" } }),
    prisma.tickerItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <AdminPageHeader title="Homepage" description="Control which sections appear on the homepage, their order, and the trending ticker." />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sections */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-navy">Sections</h2>
          <div className="space-y-3">
            {sections.map((s) => (
              <Card key={s.id}>
                <form action={saveSection} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={s.id} />
                  <div className="min-w-[160px] flex-1">
                    <Field label="Title"><Input name="title" defaultValue={s.title} /></Field>
                  </div>
                  <div className="w-20">
                    <Field label="Order"><Input name="order" type="number" defaultValue={s.order} /></Field>
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-sm">
                    <input type="checkbox" name="enabled" defaultChecked={s.enabled} className="h-4 w-4 accent-[#00A99D]" />
                    Enabled
                  </label>
                  <SubmitButton label="Save" className="btn-outline" />
                  <span className="w-full text-xs text-stone-400">Key: <code>{s.key}</code></span>
                </form>
              </Card>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-navy">Trending Ticker</h2>
          <Card className="mb-4">
            <form action={addTicker} className="space-y-3">
              <Field label="Ticker label" required><Input name="label" required placeholder="Breaking headline…" /></Field>
              <Field label="Link (optional)"><Input name="href" placeholder="/news" /></Field>
              <SubmitButton label="Add Ticker Item" />
            </form>
          </Card>
          <Card className="p-0">
            <ul className="divide-y divide-stone-100">
              {ticker.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className={`h-2 w-2 rounded-full ${t.active ? "bg-green" : "bg-stone-300"}`} />
                  <span className="min-w-0 flex-1 truncate text-sm text-navy">{t.label}</span>
                  <form action={toggleTicker}><input type="hidden" name="id" value={t.id} />
                    <ActionButton label={t.active ? "Disable" : "Enable"} className="text-xs font-medium text-stone-500 hover:text-green-600" /></form>
                  <form action={deleteTicker}><input type="hidden" name="id" value={t.id} />
                    <ActionButton label="" className="rounded p-1 text-stone-400 hover:text-navy" confirm="Delete this ticker item?" ><Trash2 className="h-4 w-4" /></ActionButton></form>
                </li>
              ))}
              {ticker.length === 0 && <li className="px-4 py-6 text-center text-sm text-stone-400">No ticker items.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
