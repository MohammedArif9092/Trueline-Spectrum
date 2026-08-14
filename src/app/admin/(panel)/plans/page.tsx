import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea, Checkbox } from "@/components/admin/ui";
import { SubmitButton, ActionButton } from "@/components/admin/FormButtons";
import { createPlan, updatePlan, deletePlan } from "./actions";
import { parseJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const plans = await prisma.premiumPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Premium Plans" description="Display-only subscription plans. No payment/checkout is implemented in this release." />
      <div className="mb-6 rounded-md border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy">
        These plans are shown on the public <strong>/premium</strong> page for display only. Billing is intentionally not implemented — the architecture is future-ready for it.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((p) => (
          <Card key={p.id}>
            <form action={updatePlan.bind(null, p.id)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name"><Input name="name" defaultValue={p.name} /></Field>
                <Field label="Price Label"><Input name="priceLabel" defaultValue={p.priceLabel} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Interval" hint="month / year / blank"><Input name="interval" defaultValue={p.interval ?? ""} /></Field>
                <Field label="Order"><Input name="order" type="number" defaultValue={p.order} /></Field>
              </div>
              <Field label="Tagline"><Input name="tagline" defaultValue={p.tagline ?? ""} /></Field>
              <Field label="Features" hint="One per line.">
                <Textarea name="features" defaultValue={parseJson<string[]>(p.features, []).join("\n")} className="min-h-[120px]" />
              </Field>
              <div className="flex gap-2">
                <Checkbox name="highlighted" label="Highlighted" defaultChecked={p.highlighted} />
                <Checkbox name="active" label="Active" defaultChecked={p.active} />
              </div>
              <SubmitButton label="Save" />
            </form>
            <form action={deletePlan} className="mt-3 border-t border-stone-100 pt-3">
              <input type="hidden" name="id" value={p.id} />
              <ActionButton label="Delete plan" icon="trash" className="text-sm text-stone-400 hover:text-navy" confirm="Delete this plan?" />
            </form>
          </Card>
        ))}

        <Card>
          <h3 className="mb-3 font-bold text-navy">Add Plan</h3>
          <form action={createPlan} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" ><Input name="name" required /></Field>
              <Field label="Price Label"><Input name="priceLabel" placeholder="₹499" /></Field>
            </div>
            <Field label="Interval"><Input name="interval" placeholder="month" /></Field>
            <Field label="Tagline"><Input name="tagline" /></Field>
            <Field label="Features" hint="One per line."><Textarea name="features" className="min-h-[100px]" /></Field>
            <Checkbox name="highlighted" label="Highlighted" />
            <SubmitButton label="Add Plan" />
          </form>
        </Card>
      </div>
    </div>
  );
}
