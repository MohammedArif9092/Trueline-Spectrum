import { AdminPageHeader } from "@/components/admin/ui";
import { ResearchForm } from "@/components/admin/ResearchForm";
import { createResearch } from "../actions";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="New Research" description="Add a research, publication, patent or innovation entry." />
      <ResearchForm action={createResearch} />
    </div>
  );
}
