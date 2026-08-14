import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { ActionButton, SubmitButton } from "@/components/admin/FormButtons";
import { updateMagazine, deleteMagazine, addMagazinePage, deleteMagazinePage } from "../../actions";
import { MagazineForm } from "@/components/admin/MagazineForm";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const item = await prisma.magazine.findUnique({
    where: { id },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Edition" description={`${item.editionTitle} · ${item.month} ${item.year}`}
        action={
          <div className="flex items-center gap-2">
            <a href={links.magazineRead(item.slug)} target="_blank" rel="noreferrer" className="btn-outline"><ExternalLink className="h-4 w-4" /> Reader</a>
            <form action={deleteMagazine}><input type="hidden" name="id" value={item.id} />
              <ActionButton label="Delete" icon="trash" className="btn-outline" confirm="Delete this edition and all pages?" /></form>
          </div>
        } />
      {saved && <div className="mb-6 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" /> Changes saved.</div>}

      <MagazineForm item={item} action={updateMagazine.bind(null, id)} />

      {/* Pages manager */}
      <div className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-navy">Reader Pages ({item.pages.length})</h2>
        <p className="mb-4 text-sm text-stone-500">
          Pages render in the online digital reader in order. Add a cover page and content pages — readers view them on the site (no downloads).
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Existing pages */}
          <Card className="p-0">
            {item.pages.length === 0 ? (
              <p className="p-6 text-sm text-stone-400">No pages yet. Add the first page on the right.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {item.pages.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="w-8 shrink-0 font-serif text-lg font-bold text-green-500">
                      {p.pageNumber < 10 ? `0${p.pageNumber}` : p.pageNumber}
                    </span>
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="h-14 w-11 shrink-0 rounded object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-navy clamp-1">{p.title || `Page ${p.pageNumber}`}</p>
                      {p.body && <p className="text-xs text-stone-400 clamp-1">{p.body}</p>}
                    </div>
                    <form action={deleteMagazinePage}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="magazineId" value={item.id} />
                      <ActionButton label="" icon="trash" className="rounded p-1.5 text-stone-400 hover:text-navy" confirm="Delete this page?" />
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Add page */}
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-navy"><Plus className="h-4 w-4 text-green-600" /> Add Page</h3>
            <form action={addMagazinePage} className="space-y-4">
              <input type="hidden" name="magazineId" value={item.id} />
              <Field label="Title" hint="Shown in the table of contents.">
                <Input name="title" placeholder="Cover / Editor's Note / …" />
              </Field>
              <Field label="Page Image URL"><Input name="image" placeholder="https://…" /></Field>
              <Field label="Body text" hint="Supports search & accessibility.">
                <Textarea name="body" className="min-h-[80px]" />
              </Field>
              <SubmitButton label="Add Page" pendingLabel="Adding…" />
            </form>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/magazines" className="text-sm text-stone-500 hover:text-green-600">← Back to editions</Link>
      </div>
    </div>
  );
}
