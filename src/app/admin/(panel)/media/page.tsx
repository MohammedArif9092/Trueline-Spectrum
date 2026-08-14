import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, Field, Input, EmptyState } from "@/components/admin/ui";
import { SubmitButton, ActionButton } from "@/components/admin/FormButtons";
import { addMedia, deleteMedia } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <AdminPageHeader title="Media Library" description="Reference images by URL for use across content. Paste an image URL to register it here." />
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit">
          <h3 className="mb-3 font-bold text-navy">Add Media</h3>
          <form action={addMedia} className="space-y-3">
            <Field label="Image URL" required><Input name="url" placeholder="https://…" required /></Field>
            <Field label="Filename" hint="Optional. Derived from URL if blank."><Input name="filename" /></Field>
            <Field label="Alt text"><Input name="alt" /></Field>
            <SubmitButton label="Add to Library" />
          </form>
        </Card>

        <div>
          {assets.length === 0 ? (
            <EmptyState title="No media yet" hint="Add an image URL to get started." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((m) => (
                <Card key={m.id} className="p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 truncate text-xs font-medium text-navy" title={m.filename}>{m.filename}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <a href={m.url} target="_blank" rel="noreferrer" className="truncate text-[11px] text-stone-400 hover:text-green-600">Open</a>
                    <form action={deleteMedia}>
                      <input type="hidden" name="id" value={m.id} />
                      <ActionButton label="" className="rounded p-1 text-stone-400 hover:text-navy" confirm="Remove this media item?"><Trash2 className="h-3.5 w-3.5" /></ActionButton>
                    </form>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
