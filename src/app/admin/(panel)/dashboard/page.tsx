import Link from "next/link";
import {
  FileText, FlaskConical, CalendarDays, Building2, BookOpen, Mail,
  Clock, CheckCircle2, PencilLine, Plus,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminPageHeader, Card, StatusBadge } from "@/components/admin/ui";
import { formatDateShort, links } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    publishedArticles, draftArticles, pendingArticles, scheduledArticles,
    research, events, orgs, magazines, subscribers, recent,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "PENDING" } }),
    prisma.article.count({ where: { status: "SCHEDULED" } }),
    prisma.research.count(),
    prisma.event.count(),
    prisma.organization.count(),
    prisma.magazine.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.article.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { category: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "Published", value: publishedArticles, icon: CheckCircle2, href: "/admin/articles?status=PUBLISHED" },
    { label: "Drafts", value: draftArticles, icon: PencilLine, href: "/admin/articles?status=DRAFT" },
    { label: "Pending Review", value: pendingArticles, icon: Clock, href: "/admin/articles?status=PENDING" },
    { label: "Scheduled", value: scheduledArticles, icon: CalendarDays, href: "/admin/articles?status=SCHEDULED" },
  ];

  const library = [
    { label: "Research", value: research, icon: FlaskConical, href: "/admin/research" },
    { label: "Events", value: events, icon: CalendarDays, href: "/admin/events" },
    { label: "Organizations", value: orgs, icon: Building2, href: "/admin/organizations" },
    { label: "Magazine Editions", value: magazines, icon: BookOpen, href: "/admin/magazines" },
    { label: "Subscribers", value: subscribers, icon: Mail, href: "/admin/newsletter" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your editorial operation."
        action={
          <Link href="/admin/articles/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New Article
          </Link>
        }
      />

      {/* Workflow stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{s.label}</span>
                <s.icon className="h-4 w-4 text-green-600" />
              </div>
              <p className="mt-2 font-serif text-3xl font-bold text-navy">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Library counts */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {library.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-lift">
              <s.icon className="h-5 w-5 text-navy" />
              <p className="mt-3 font-serif text-2xl font-bold text-navy">{s.value}</p>
              <p className="text-xs text-stone-500">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <FileText className="h-5 w-5 text-green-600" /> Recently Updated
          </h2>
          <Link href="/admin/articles" className="text-sm font-semibold text-green-600 hover:text-green-700">
            All articles →
          </Link>
        </div>
        <Card className="p-0">
          <div className="divide-y divide-stone-100">
            {recent.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/articles/${a.id}/edit`} className="font-medium text-navy hover:text-green-700 clamp-1">
                    {a.title}
                  </Link>
                  <p className="text-xs text-stone-400">
                    {a.category?.name ?? "Uncategorized"} · Updated {formatDateShort(a.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={a.status} />
                  {a.status === "PUBLISHED" && (
                    <a href={links.article(a.slug)} target="_blank" rel="noreferrer" className="text-xs text-stone-400 hover:text-green-600">
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
