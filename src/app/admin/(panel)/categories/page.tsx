import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Select } from "@/components/admin/ui";
import { ActionButton, SubmitButton } from "@/components/admin/FormButtons";
import { createCategory, deleteCategory } from "./actions";
import { SECTIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cats = await prisma.category.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <AdminPageHeader title="Categories" description="Controlled category system. Each category rolls up to a navigation section." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Name</th><th className="px-3 py-3">Section</th>
              <th className="px-3 py-3">Articles</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {cats.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3"><span className="font-medium text-navy">{c.name}</span><p className="text-xs text-stone-400">/{c.slug}</p></td>
                  <td className="px-3 py-3 capitalize text-stone-500">{c.section}</td>
                  <td className="px-3 py-3 text-stone-500">{c._count.articles}</td>
                  <td className="px-5 py-3"><div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/categories/${c.id}/edit`} className="rounded p-1.5 text-stone-400 hover:text-green-600"><Pencil className="h-4 w-4" /></Link>
                    <form action={deleteCategory}><input type="hidden" name="id" value={c.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this category? Articles will be uncategorized." /></form>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="mb-4 font-bold text-navy">Add Category</h3>
          <form action={createCategory} className="space-y-4">
            <Field label="Name" required><Input name="name" required /></Field>
            <Field label="Slug" hint="Blank to auto-generate."><Input name="slug" placeholder="auto-generated" /></Field>
            <Field label="Section">
              <Select name="section" defaultValue="news">
                <option value="news">News</option>
                {SECTIONS.filter((s) => s.key !== "news").map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                <option value="events">Events</option>
                <option value="science">Science</option>
              </Select>
            </Field>
            <Field label="Order"><Input name="order" type="number" defaultValue={0} /></Field>
            <SubmitButton label="Add Category" />
          </form>
        </Card>
      </div>
    </div>
  );
}
