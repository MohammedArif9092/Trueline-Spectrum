import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Card } from "./ui";
import { SubmitButton } from "./FormButtons";
import { EVENT_CATEGORIES, ARTICLE_STATUS, STATUS_LABELS } from "@/lib/constants";

type Data = {
  id: string; name: string; slug: string; startDate: Date; endDate: Date | null;
  time: string | null; location: string | null; mode: string; description: string;
  organizer: string | null; registrationUrl: string | null; image: string | null;
  category: string; status: string; featured: boolean;
};

function dt(d: Date | null) {
  if (!d) return "";
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function EventForm({ item, action }: { item?: Data; action: (fd: FormData) => void }) {
  const e = item;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Event Name" required><Input name="name" defaultValue={e?.name} required /></Field>
          <Field label="Slug" hint="Blank to auto-generate."><Input name="slug" defaultValue={e?.slug} placeholder="auto-generated" /></Field>
          <Field label="Description" required><Textarea name="description" defaultValue={e?.description} required className="min-h-[160px]" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date/time" required><Input type="datetime-local" name="startDate" defaultValue={dt(e?.startDate ?? null)} required /></Field>
            <Field label="End date/time"><Input type="datetime-local" name="endDate" defaultValue={dt(e?.endDate ?? null)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display time"><Input name="time" defaultValue={e?.time ?? ""} placeholder="09:30 AM IST" /></Field>
            <Field label="Location"><Input name="location" defaultValue={e?.location ?? ""} placeholder="City / Online" /></Field>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Category">
            <Select name="category" defaultValue={e?.category ?? "conference"}>
              {EVENT_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Mode">
            <Select name="mode" defaultValue={e?.mode ?? "in-person"}>
              <option value="in-person">In-person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={e?.status ?? "DRAFT"}>
              {ARTICLE_STATUS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </Select>
          </Field>
          <Checkbox name="featured" label="Featured" defaultChecked={e?.featured} />
          <div className="flex justify-end"><SubmitButton label={e ? "Save Changes" : "Create Event"} /></div>
        </Card>
        <Card className="space-y-4">
          <Field label="Organizer"><Input name="organizer" defaultValue={e?.organizer ?? ""} /></Field>
          <Field label="Registration URL"><Input name="registrationUrl" defaultValue={e?.registrationUrl ?? ""} placeholder="https://…" /></Field>
          <Field label="Image URL"><Input name="image" defaultValue={e?.image ?? ""} placeholder="https://…" /></Field>
        </Card>
        <Link href="/admin/events" className="btn-outline w-full">Cancel</Link>
      </div>
    </form>
  );
}
