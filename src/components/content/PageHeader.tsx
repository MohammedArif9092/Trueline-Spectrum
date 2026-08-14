import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  kicker,
  title,
  description,
  breadcrumb,
}: {
  kicker?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="border-b border-stone-100 bg-stone-50/60">
      <div className="container-editorial py-10 lg:py-12">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-green-600">Home</Link>
            {breadcrumb.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-green-600">{b.label}</Link>
                ) : (
                  <span className="text-navy">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {kicker && <span className="kicker-label">{kicker}</span>}
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-stone-600">{description}</p>
        )}
      </div>
    </div>
  );
}
