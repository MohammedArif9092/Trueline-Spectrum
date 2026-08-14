import { getUpcomingEvents } from "@/lib/queries";
import { SectionHeading } from "@/components/content/SectionHeading";
import { EventCard } from "@/components/content/EventCard";

export async function EventsSection() {
  const events = await getUpcomingEvents(4);
  if (events.length === 0) return null;

  return (
    <section className="container-editorial mt-16">
      <SectionHeading kicker="Mark your calendar" title="Upcoming Events" href="/events" />
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
