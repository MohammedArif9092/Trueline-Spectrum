import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { ActionButton, SubmitButton } from "@/components/admin/FormButtons";
import { createAuthor, deleteAuthor } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
  return (
    <div>
      <AdminPageHeader title="Authors" description="Editorial bylines used across articles." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Author</th><th className="px-3 py-3">Articles</th>
              <th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {authors.map((a) => (
                <tr key={a.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3"><span className="font-medium text-navy">{a.name}</span>{a.title && <p className="text-xs text-stone-400">{a.title}</p>}</td>
                  <td className="px-3 py-3 text-stone-500">{a._count.articles}</td>
                  <td className="px-5 py-3"><div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/authors/${a.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                    <form action={deleteAuthor}><input type="hidden" name="id" value={a.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this author?" /></form>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h3 className="mb-4 font-bold text-navy">Add Author</h3>
          <form action={createAuthor} className="space-y-4">
            <Field label="Name" required><Input name="name" required /></Field>
            <Field label="Title"><Input name="title" placeholder="Senior Editor, Research" /></Field>
            <Field label="Email"><Input name="email" type="email" /></Field>
            <Field label="Avatar URL"><Input name="avatar" placeholder="https://…" /></Field>
            <Field label="Bio"><Textarea name="bio" className="min-h-[80px]" /></Field>
            <SubmitButton label="Add Author" />
          </form>
        </Card>
      </div>
    </div>
  );
}
