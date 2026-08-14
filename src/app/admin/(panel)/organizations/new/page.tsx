import { AdminPageHeader } from "@/components/admin/ui";
import { OrganizationForm } from "@/components/admin/OrganizationForm";
import { createOrganization } from "../actions";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="New Organization" description="Add an institution or company profile." />
      <OrganizationForm action={createOrganization} />
    </div>
  );
}
