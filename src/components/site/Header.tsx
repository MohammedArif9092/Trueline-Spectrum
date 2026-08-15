"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown, Crown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Home → About → News → Technology → AI → Research → Education → Industry →
// Startups → Magazine → Events → More
const PRIMARY = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  ...SECTIONS.map((s) => ({ label: s.label, href: s.href })),
  { label: "Magazine", href: "/magazine" },
  { label: "Events", href: "/events" },
];

const MORE = [
  { label: "Organizations", href: "/organizations" },
  { label: "Innovation", href: "/category/innovation" },
  { label: "Patents", href: "/category/patents" },
  { label: "Science", href: "/category/science" },
  { label: "Rankings", href: "/category/rankings" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setQ("");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
      {/* Top row: logo + utility */}
      <div className="container-editorial flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo className="h-12 lg:h-14" priority />

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-2 text-navy hover:bg-navy-50"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/premium" className="btn-primary hidden sm:inline-flex">
            <Crown className="h-4 w-4" />
            Premium
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-navy hover:bg-navy-50 lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="border-t border-stone-100 bg-white">
          <div className="container-editorial py-3">
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <Search className="h-5 w-5 shrink-0 text-stone-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search articles, research, magazines, events, organizations…"
                className="w-full bg-transparent py-1.5 text-navy placeholder:text-stone-400 focus:outline-none"
              />
              <button type="submit" className="btn-primary py-1.5">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Desktop primary nav */}
      <nav className="hidden border-t border-stone-100 lg:block">
        <div className="container-editorial flex items-center gap-6">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative py-3 text-sm font-semibold tracking-tight transition-colors",
                isActive(item.href)
                  ? "text-green-600"
                  : "text-navy hover:text-green-600"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-green" />
              )}
            </Link>
          ))}

          {/* More dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 py-3 text-sm font-semibold text-navy hover:text-green-600">
              More <ChevronDown className="h-4 w-4" />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full z-50 w-56 rounded-md border border-stone-100 bg-white py-2 shadow-lift">
                {MORE.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="block px-4 py-2 text-sm text-navy hover:bg-navy-50 hover:text-green-600"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-100 bg-white lg:hidden">
          <div className="container-editorial py-4">
            <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2">
              <Search className="h-4 w-4 text-stone-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </form>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[...PRIMARY, ...MORE].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-semibold",
                    isActive(item.href) ? "text-green-600" : "text-navy"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/premium"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              <Crown className="h-4 w-4" /> Premium Plans
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
