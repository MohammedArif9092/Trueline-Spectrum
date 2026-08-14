import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { links } from "@/lib/utils";
import { ORG_TYPES } from "@/lib/constants";

type OrgData = {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo: string | null;
  description: string | null;
  location: string | null;
};

function typeLabel(key: string) {
  return ORG_TYPES.find((t) => t.key === key)?.label ?? "Organization";
}

export function OrgCard({ org }: { org: OrgData }) {
  return (
    <Link
      href={links.organization(org.slug)}
      className="group flex flex-col rounded-xl border border-stone-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
          {org.logo && <Image src={org.logo} alt={org.name} fill sizes="48px" className="object-cover" />}
        </div>
        <span className="rounded-full bg-green-50 p-1.5 text-green-600 transition-colors group-hover:bg-green group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <span className="mt-4 text-[11px] font-bold uppercase tracking-wider text-green-600">
        {typeLabel(org.type)}
      </span>
      <h3 className="mt-1 font-bold leading-snug text-navy group-hover:text-green-700 clamp-2">{org.name}</h3>
      {org.location && (
        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
          <MapPin className="h-3 w-3" /> {org.location}
        </p>
      )}
      {org.description && (
        <p className="mt-2 text-sm leading-relaxed text-stone-500 clamp-2">{org.description}</p>
      )}
    </Link>
  );
}
