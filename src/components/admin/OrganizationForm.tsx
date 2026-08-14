import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Card } from "./ui";
import { SubmitButton } from "./FormButtons";
import { ORG_TYPES } from "@/lib/constants";

type Data = {
  id: string; name: string; slug: string; type: string; logo: string | null;
  coverImage: string | null; description: string | null; location: string | null;
  website: string | null; contactEmail: string | null; contactPhone: string | null;
  founded: string | null; achievements: string | null; status: string; featured: boolean;
};

export function OrganizationForm({ item, action }: { item?: Data; action: (fd: FormData) => void }) {
  const o = item;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Name" required><Input name="name" defaultValue={o?.name} required /></Field>
          <Field label="Slug" hint="Blank to auto-generate."><Input name="slug" defaultValue={o?.slug} placeholder="auto-generated" /></Field>
          <Field label="Description"><Textarea name="description" defaultValue={o?.description ?? ""} className="min-h-[140px]" /></Field>
          <Field label="Achievements" hint="One per line."><Textarea name="achievements" defaultValue={o?.achievements ?? ""} className="min-h-[100px]" /></Field>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Type">
            <Select name="type" defaultValue={o?.type ?? "university"}>
              {ORG_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={o?.status ?? "PUBLISHED"}>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Checkbox name="featured" label="Featured" defaultChecked={o?.featured} />
          <div className="flex justify-end"><SubmitButton label={o ? "Save Changes" : "Create Organization"} /></div>
        </Card>
        <Card className="space-y-4">
          <Field label="Location"><Input name="location" defaultValue={o?.location ?? ""} /></Field>
          <Field label="Founded"><Input name="founded" defaultValue={o?.founded ?? ""} placeholder="2016" /></Field>
          <Field label="Website"><Input name="website" defaultValue={o?.website ?? ""} placeholder="https://…" /></Field>
          <Field label="Contact Email"><Input name="contactEmail" defaultValue={o?.contactEmail ?? ""} /></Field>
          <Field label="Contact Phone"><Input name="contactPhone" defaultValue={o?.contactPhone ?? ""} /></Field>
        </Card>
        <Card className="space-y-4">
          <Field label="Logo URL"><Input name="logo" defaultValue={o?.logo ?? ""} placeholder="https://…" /></Field>
          <Field label="Cover Image URL"><Input name="coverImage" defaultValue={o?.coverImage ?? ""} placeholder="https://…" /></Field>
        </Card>
        <Link href="/admin/organizations" className="btn-outline w-full">Cancel</Link>
      </div>
    </form>
  );
}
