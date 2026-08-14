import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { EventCard } from "@/components/content/EventCard";
import { SectionHeading } from "@/components/content/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Events",
  description: "Conferences, seminars, workshops, FDPs, hackathons, webinars and expos.",
};

export default async function Page() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(12), getPastEvents(9)]);
  return (
    <div className="pb-8">
      <PageHeader
        kicker="Mark your calendar"
        title="Events"
        description="Conferences, seminars, workshops, FDPs, hackathons, webinars and project expos across the ecosystem."
        breadcrumb={[{ label: "Events" }]}
      />
      <div className="container-editorial py-10">
        <SectionHeading kicker="Coming up" title="Upcoming Events" />
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-12 text-center text-stone-500">
            No upcoming events scheduled.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <SectionHeading kicker="Archive" title="Past Events" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
