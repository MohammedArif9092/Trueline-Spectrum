import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Card } from "./ui";
import { SubmitButton } from "./FormButtons";

type Data = {
  id: string; editionTitle: string; slug: string; month: string; year: number;
  coverImage: string; description: string | null; theme: string | null;
  status: string; isCurrent: boolean; featured: boolean;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function MagazineForm({ item, action }: { item?: Data; action: (fd: FormData) => void }) {
  const m = item;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Edition Title" required><Input name="editionTitle" defaultValue={m?.editionTitle} placeholder="June 2026 Edition" required /></Field>
          <Field label="Theme" hint="Editorial theme line shown prominently."><Input name="theme" defaultValue={m?.theme ?? ""} placeholder="AI, Innovation & the Future of Industry" /></Field>
          <Field label="Slug" hint="Blank to auto-generate."><Input name="slug" defaultValue={m?.slug} placeholder="auto-generated" /></Field>
          <Field label="Description"><Textarea name="description" defaultValue={m?.description ?? ""} className="min-h-[120px]" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Month">
              <Select name="month" defaultValue={m?.month ?? "January"}>
                {MONTHS.map((mo) => <option key={mo} value={mo}>{mo}</option>)}
              </Select>
            </Field>
            <Field label="Year"><Input name="year" type="number" defaultValue={m?.year ?? new Date().getFullYear()} /></Field>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Status">
            <Select name="status" defaultValue={m?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Checkbox name="isCurrent" label="Current edition" hint="Featured as the current issue" defaultChecked={m?.isCurrent} />
          <Checkbox name="featured" label="Featured" defaultChecked={m?.featured} />
          <div className="flex justify-end"><SubmitButton label={m ? "Save Changes" : "Create Edition"} /></div>
        </Card>
        <Card className="space-y-4">
          <Field label="Cover Image URL" required><Input name="coverImage" defaultValue={m?.coverImage ?? ""} placeholder="https://…" required /></Field>
        </Card>
        <Link href="/admin/magazines" className="btn-outline w-full">Cancel</Link>
      </div>
    </form>
  );
}
