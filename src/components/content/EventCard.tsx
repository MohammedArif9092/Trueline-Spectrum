import Link from "next/link";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { links } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/constants";

type EventData = {
  id: string;
  name: string;
  slug: string;
  startDate: Date;
  location: string | null;
  mode: string;
  description: string;
  category: string;
  registrationUrl: string | null;
};

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function catLabel(key: string) {
  return EVENT_CATEGORIES.find((c) => c.key === key)?.label ?? "Event";
}

export function EventCard({ event }: { event: EventData }) {
  const d = new Date(event.startDate);
  return (
    <article className="flex gap-4 rounded-xl border border-stone-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-navy text-white">
        <span className="text-[10px] font-bold uppercase tracking-wider text-green">
          {MONTHS[d.getMonth()]}
        </span>
        <span className="text-2xl font-bold leading-none">{d.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-cat">{catLabel(event.category)}</span>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
            {event.mode}
          </span>
        </div>
        <h3 className="mt-1.5 font-semibold leading-snug text-navy">
          <Link href={links.event(event.slug)} className="hover:text-green-700 clamp-2">
            {event.name}
          </Link>
        </h3>
        <div className="meta mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {event.location}
            </span>
          )}
        </div>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700"
          >
            Register <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}
