import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/ui";
import { ResearchForm } from "@/components/admin/ResearchForm";
import { ActionButton } from "@/components/admin/FormButtons";
import { updateResearch, deleteResearch } from "../../actions";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const item = await prisma.research.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Research" description={item.title}
        action={
          <form action={deleteResearch}><input type="hidden" name="id" value={item.id} />
            <ActionButton label="Delete" icon="trash" className="btn-outline" confirm="Delete this research entry?" /></form>
        } />
      {saved && <div className="mb-6 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" /> Changes saved.</div>}
      <ResearchForm item={item} action={updateResearch.bind(null, id)} />
    </div>
  );
}
