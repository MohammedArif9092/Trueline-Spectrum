import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Card } from "./ui";
import { SubmitButton } from "./FormButtons";
import { RESEARCH_CATEGORIES, ARTICLE_STATUS, STATUS_LABELS } from "@/lib/constants";

type Data = {
  id: string; title: string; slug: string; summary: string; content: string | null;
  researchCategory: string; institution: string | null; researchers: string | null;
  publicationInfo: string | null; featuredImage: string | null; status: string; featured: boolean;
};

export function ResearchForm({ item, action }: { item?: Data; action: (fd: FormData) => void }) {
  const r = item;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Title" htmlFor="title" required>
            <Input id="title" name="title" defaultValue={r?.title} required />
          </Field>
          <Field label="Slug" hint="Blank to auto-generate.">
            <Input name="slug" defaultValue={r?.slug} placeholder="auto-generated" />
          </Field>
          <Field label="Summary" required hint="Shown on cards and the research page.">
            <Textarea name="summary" defaultValue={r?.summary} required className="min-h-[90px]" />
          </Field>
          <Field label="Content" hint="Optional full body. HTML supported.">
            <Textarea name="content" defaultValue={r?.content ?? ""} className="min-h-[220px] font-mono text-xs" />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Type">
            <Select name="researchCategory" defaultValue={r?.researchCategory ?? "research"}>
              {RESEARCH_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={r?.status ?? "DRAFT"}>
              {ARTICLE_STATUS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </Select>
          </Field>
          <Checkbox name="featured" label="Featured" hint="Lead the Research section" defaultChecked={r?.featured} />
          <div className="flex justify-end"><SubmitButton label={r ? "Save Changes" : "Create Research"} /></div>
        </Card>
        <Card className="space-y-4">
          <Field label="Institution"><Input name="institution" defaultValue={r?.institution ?? ""} /></Field>
          <Field label="Researchers"><Input name="researchers" defaultValue={r?.researchers ?? ""} /></Field>
          <Field label="Publication Info"><Input name="publicationInfo" defaultValue={r?.publicationInfo ?? ""} /></Field>
          <Field label="Featured Image URL"><Input name="featuredImage" defaultValue={r?.featuredImage ?? ""} placeholder="https://…" /></Field>
        </Card>
        <Link href="/admin/research" className="btn-outline w-full">Cancel</Link>
      </div>
    </form>
  );
}
