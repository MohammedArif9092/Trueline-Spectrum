import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea, Select } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/FormButtons";
import { updateCategory } from "../../actions";
import { SECTIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) notFound();
  return (
    <div className="max-w-xl">
      <AdminPageHeader title="Edit Category" description={c.name} />
      <Card>
        <form action={updateCategory.bind(null, id)} className="space-y-4">
          <Field label="Name" required><Input name="name" defaultValue={c.name} required /></Field>
          <Field label="Section">
            <Select name="section" defaultValue={c.section}>
              <option value="news">News</option>
              {SECTIONS.filter((s) => s.key !== "news").map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              <option value="events">Events</option>
              <option value="science">Science</option>
            </Select>
          </Field>
          <Field label="Description"><Textarea name="description" defaultValue={c.description ?? ""} className="min-h-[80px]" /></Field>
          <Field label="Order"><Input name="order" type="number" defaultValue={c.order} /></Field>
          <div className="flex items-center gap-3">
            <SubmitButton label="Save Changes" />
            <Link href="/admin/categories" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
