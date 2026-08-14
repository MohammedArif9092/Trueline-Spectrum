import Link from "next/link";
import Image from "next/image";
import { Rocket, MapPin, ArrowUpRight } from "lucide-react";
import { getStartupOrganizations } from "@/lib/queries";
import { SectionHeading } from "@/components/content/SectionHeading";
import { links } from "@/lib/utils";

export async function StartupSpotlight() {
  const startups = await getStartupOrganizations(4);
  if (startups.length === 0) return null;

  return (
    <section className="container-editorial mt-16">
      <SectionHeading
        kicker={"Founders & ventures"}
        title="Startup Spotlight"
        href="/startups"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {startups.map((s) => (
          <Link
            key={s.id}
            href={links.organization(s.slug)}
            className="group flex flex-col rounded-xl border border-stone-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                {s.logo && <Image src={s.logo} alt={s.name} fill sizes="48px" className="object-cover" />}
              </div>
              <span className="rounded-full bg-green-50 p-1.5 text-green-600 transition-colors group-hover:bg-green group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-4 font-bold text-navy group-hover:text-green-700">{s.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
              <Rocket className="h-3 w-3 text-green-600" /> Startup
              {s.location && (
                <>
                  <span className="mx-1" aria-hidden>·</span>
                  <MapPin className="h-3 w-3" /> {s.location}
                </>
              )}
            </p>
            {s.description && (
              <p className="mt-3 text-sm leading-relaxed text-stone-500 clamp-3">{s.description}</p>
            )}
            <span className="mt-4 text-sm font-semibold text-green-600">View profile →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
