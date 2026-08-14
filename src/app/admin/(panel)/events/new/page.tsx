import { AdminPageHeader } from "@/components/admin/ui";
import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "../actions";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="New Event" description="Add an event to the calendar." />
      <EventForm action={createEvent} />
    </div>
  );
}
