import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea, Select, Checkbox } from "@/components/admin/ui";
import { SubmitButton, ActionButton } from "@/components/admin/FormButtons";
import { createAd, updateAd, deleteAd } from "./actions";
import { AD_PLACEMENTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Page() {
  const ads = await prisma.advertisement.findMany({ orderBy: [{ placement: "asc" }, { priority: "asc" }] });

  return (
    <div>
      <AdminPageHeader title="Advertisements" description="Manage advertisement placeholders. No ad network is connected in this release." />
      <div className="mb-6 rounded-md border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy">
        Placements render an image/HTML creative if provided, otherwise a clean labelled placeholder. Ads never overwhelm editorial content.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <form action={updateAd.bind(null, ad.id)} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-600">{ad.placement}</span>
                <span className={`text-xs font-medium ${ad.active ? "text-green-600" : "text-stone-400"}`}>{ad.active ? "Active" : "Inactive"}</span>
              </div>
              <Field label="Name"><Input name="name" defaultValue={ad.name} /></Field>
              <Field label="Image URL"><Input name="imageUrl" defaultValue={ad.imageUrl ?? ""} placeholder="https://…" /></Field>
              <Field label="Link URL"><Input name="linkUrl" defaultValue={ad.linkUrl ?? ""} placeholder="https://…" /></Field>
              <Field label="Custom HTML" hint="Optional. Overrides the image."><Textarea name="html" defaultValue={ad.html ?? ""} className="min-h-[60px] font-mono text-xs" /></Field>
              <div className="flex items-center gap-3">
                <div className="w-24"><Field label="Priority"><Input name="priority" type="number" defaultValue={ad.priority} /></Field></div>
                <label className="flex items-center gap-2 pt-5 text-sm">
                  <input type="checkbox" name="active" defaultChecked={ad.active} className="h-4 w-4 accent-[#00A99D]" /> Active
                </label>
              </div>
              <SubmitButton label="Save" />
            </form>
            <form action={deleteAd} className="mt-3 border-t border-stone-100 pt-3">
              <input type="hidden" name="id" value={ad.id} />
              <ActionButton label="Delete placement" icon="trash" className="text-sm text-stone-400 hover:text-navy" confirm="Delete this ad placement?" />
            </form>
          </Card>
        ))}

        <Card>
          <h3 className="mb-3 font-bold text-navy">Add Placement</h3>
          <form action={createAd} className="space-y-3">
            <Field label="Name"><Input name="name" placeholder="Homepage Placement" /></Field>
            <Field label="Placement">
              <Select name="placement" defaultValue="sidebar">
                {AD_PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Image URL"><Input name="imageUrl" placeholder="https://…" /></Field>
            <Field label="Link URL"><Input name="linkUrl" placeholder="https://…" /></Field>
            <SubmitButton label="Add Placement" />
          </form>
        </Card>
      </div>
    </div>
  );
}
