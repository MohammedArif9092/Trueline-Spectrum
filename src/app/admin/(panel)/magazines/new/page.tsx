import { AdminPageHeader } from "@/components/admin/ui";
import { MagazineForm } from "@/components/admin/MagazineForm";
import { createMagazine } from "../actions";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="New Edition" description="Create a magazine edition, then add reader pages." />
      <MagazineForm action={createMagazine} />
    </div>
  );
}
