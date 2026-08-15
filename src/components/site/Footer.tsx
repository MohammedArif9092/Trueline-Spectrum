import Link from "next/link";
import { Linkedin, Youtube, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SITE, SECTIONS } from "@/lib/constants";
import { getSiteSettings } from "@/lib/queries";
import { NewsletterForm } from "./NewsletterForm";

export async function Footer() {
  const s = await getSiteSettings();

  const explore = [
    ...SECTIONS.map((x) => ({ label: x.label, href: x.href })),
    { label: "Magazine", href: "/magazine" },
    { label: "Events", href: "/events" },
    { label: "Organizations", href: "/organizations" },
  ];

  const company = [
    { label: "About & Leadership", href: "/about" },
    { label: "Premium Plans", href: "/premium" },
    { label: "Search", href: "/search" },
    { label: "Advertise With Us", href: "/premium#advertise" },
    { label: "Admin", href: "/admin/login" },
  ];

  return (
    <footer className="mt-20 bg-navy text-white/80">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-editorial grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Stay Updated</h2>
            <p className="mt-2 max-w-md text-white/70">
              Subscribe to be notified when each new monthly edition of Trueline
              Spectrum goes live — technology, research, education and industry.
            </p>
          </div>
          <NewsletterForm source="footer" variant="dark" />
        </div>
      </div>

      {/* Link columns */}
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo className="h-14" onDark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {s.footerAbout || SITE.description}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {s.social_linkedin && (
              <a href={s.social_linkedin} target="_blank" rel="noreferrer"
                 aria-label="LinkedIn"
                 className="rounded-md border border-white/15 p-2 hover:border-green hover:text-green">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {s.social_youtube && (
              <a href={s.social_youtube} target="_blank" rel="noreferrer"
                 aria-label="YouTube"
                 className="rounded-md border border-white/15 p-2 hover:border-green hover:text-green">
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {s.contactEmail && (
              <a href={`mailto:${s.contactEmail}`} aria-label="Email"
                 className="rounded-md border border-white/15 p-2 hover:border-green hover:text-green">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-green">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-green">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">About</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {SITE.positioning}
          </p>
          {s.contactEmail && (
            <a href={`mailto:${s.contactEmail}`} className="mt-3 inline-block text-sm text-green hover:underline">
              {s.contactEmail}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
