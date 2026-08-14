import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/FormButtons";
import { updateAuthor } from "../../actions";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  const a = await prisma.author.findUnique({ where: { id } });
  if (!a) notFound();
  return (
    <div className="max-w-xl">
      <AdminPageHeader title="Edit Author" description={a.name} />
      <Card>
        <form action={updateAuthor.bind(null, id)} className="space-y-4">
          <Field label="Name" required><Input name="name" defaultValue={a.name} required /></Field>
          <Field label="Title"><Input name="title" defaultValue={a.title ?? ""} /></Field>
          <Field label="Email"><Input name="email" type="email" defaultValue={a.email ?? ""} /></Field>
          <Field label="Avatar URL"><Input name="avatar" defaultValue={a.avatar ?? ""} /></Field>
          <Field label="Bio"><Textarea name="bio" defaultValue={a.bio ?? ""} className="min-h-[100px]" /></Field>
          <div className="flex items-center gap-3">
            <SubmitButton label="Save Changes" />
            <Link href="/admin/authors" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
