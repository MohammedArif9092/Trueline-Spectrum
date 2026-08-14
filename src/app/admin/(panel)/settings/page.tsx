import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/FormButtons";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await prisma.siteSetting.findMany();
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Settings" description="Global site configuration." />
      <form action={saveSettings}>
        <Card className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">General</h3>
          <Field label="Site Name"><Input name="siteName" defaultValue={s.siteName ?? ""} /></Field>
          <Field label="Tagline"><Input name="tagline" defaultValue={s.tagline ?? ""} /></Field>
          <Field label="Contact Email"><Input name="contactEmail" type="email" defaultValue={s.contactEmail ?? ""} /></Field>
          <Field label="Footer About"><Textarea name="footerAbout" defaultValue={s.footerAbout ?? ""} className="min-h-[90px]" /></Field>
        </Card>
        <Card className="mt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Social Links</h3>
          <Field label="LinkedIn URL"><Input name="social_linkedin" defaultValue={s.social_linkedin ?? ""} /></Field>
          <Field label="X (Twitter) URL"><Input name="social_x" defaultValue={s.social_x ?? ""} /></Field>
          <Field label="YouTube URL"><Input name="social_youtube" defaultValue={s.social_youtube ?? ""} /></Field>
        </Card>
        <div className="mt-6"><SubmitButton label="Save Settings" /></div>
      </form>
    </div>
  );
}
