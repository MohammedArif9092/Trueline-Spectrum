import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getTickerItems } from "@/lib/queries";

export async function TrendingTicker() {
  const items = await getTickerItems();

  if (items.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="border-b border-navy-600 bg-navy text-white">
      <div className="container-editorial flex items-center gap-4 py-2.5">
        <span className="z-10 flex shrink-0 items-center gap-1.5 bg-navy pr-3 text-xs font-bold uppercase tracking-widest text-green">
          <TrendingUp className="h-4 w-4" />
          This Month
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-8 hover:[animation-play-state:paused]">
            {loop.map((t, i) => (
              <Link
                key={`${t.id}-${i}`}
                href={t.href || "/news"}
                className="whitespace-nowrap text-sm text-white/90 transition-colors hover:text-green"
              >
                <span className="mr-2 text-green">›</span>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
