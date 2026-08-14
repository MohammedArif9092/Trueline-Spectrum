import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { parseJson, cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  interval: string | null;
  tagline: string | null;
  features: string;
  highlighted: boolean;
};

export function PlanGrid({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((p) => {
        const features = parseJson<string[]>(p.features, []);
        return (
          <div
            key={p.id}
            className={cn(
              "relative flex flex-col rounded-2xl border p-7",
              p.highlighted
                ? "border-green bg-navy text-white shadow-lift"
                : "border-stone-200 bg-white"
            )}
          >
            {p.highlighted && (
              <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                <Crown className="h-3 w-3" /> Most Popular
              </span>
            )}
            <h3 className={cn("text-lg font-bold", p.highlighted ? "text-white" : "text-navy")}>
              {p.name}
            </h3>
            {p.tagline && (
              <p className={cn("mt-1 text-sm", p.highlighted ? "text-white/70" : "text-stone-500")}>
                {p.tagline}
              </p>
            )}
            <div className="mt-5 flex items-end gap-1">
              <span className={cn("font-serif text-4xl font-bold", p.highlighted ? "text-white" : "text-navy")}>
                {p.priceLabel}
              </span>
              {p.interval && (
                <span className={cn("mb-1 text-sm", p.highlighted ? "text-white/60" : "text-stone-400")}>
                  /{p.interval}
                </span>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlighted ? "text-green" : "text-green-600")} />
                  <span className={p.highlighted ? "text-white/90" : "text-stone-600"}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/premium"
              className={cn(
                "btn mt-7 w-full",
                p.highlighted
                  ? "bg-green text-white hover:bg-green-600"
                  : "border border-navy/20 text-navy hover:bg-navy hover:text-white"
              )}
            >
              {p.priceLabel === "₹0" ? "Start Reading" : "Choose Plan"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
