import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  kicker,
  title,
  href,
  linkLabel = "View all",
}: {
  kicker?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker && <span className="kicker-label">{kicker}</span>}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
