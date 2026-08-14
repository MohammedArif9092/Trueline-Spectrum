"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, FlaskConical, CalendarDays, Building2,
  BookOpen, Tags, LogOut, ExternalLink,
} from "lucide-react";
import { ADMIN_NAV } from "./nav";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, FileText, FlaskConical, CalendarDays, Building2, BookOpen, Tags,
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/admin/dashboard") return pathname === base;
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <div className="flex h-full flex-col bg-navy text-white/80">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <Link href="/admin/dashboard" onClick={onNavigate} className="inline-flex">
          <Image src={SITE.logo} alt={SITE.name} width={2000} height={853} className="h-9 w-auto [filter:brightness(0)_invert(1)]" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className={cn(
            "mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
            isActive("/admin/dashboard") ? "bg-green text-white" : "hover:bg-white/10 hover:text-white"
          )}
        >
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>

        {ADMIN_NAV.map((group) => {
          const Icon = ICONS[group.icon] ?? FileText;
          return (
            <div key={group.label} className="mt-5">
              <p className="flex items-center gap-2 px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                <Icon className="h-3.5 w-3.5" /> {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center rounded-md px-3 py-1.5 text-sm",
                    isActive(link.href) && !link.href.includes("?") && !link.href.endsWith("/new")
                      ? "bg-white/10 font-medium text-green"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
