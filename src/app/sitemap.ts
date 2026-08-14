import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticRoutes = [
    "", "/news", "/technology", "/ai", "/research", "/education",
    "/industry", "/startups", "/magazine", "/events", "/organizations", "/premium",
  ].map((p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.7 }));

  const [articles, research, events, orgs, magazines, categories] = await Promise.all([
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.research.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.organization.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.magazine.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...articles.map((a) => ({ url: `${base}${links.article(a.slug)}`, lastModified: a.updatedAt })),
    ...research.map((r) => ({ url: `${base}${links.research(r.slug)}`, lastModified: r.updatedAt })),
    ...events.map((e) => ({ url: `${base}${links.event(e.slug)}`, lastModified: e.updatedAt })),
    ...orgs.map((o) => ({ url: `${base}${links.organization(o.slug)}`, lastModified: o.updatedAt })),
    ...magazines.map((m) => ({ url: `${base}${links.magazine(m.slug)}`, lastModified: m.updatedAt })),
    ...categories.map((c) => ({ url: `${base}${links.category(c.slug)}`, lastModified: c.updatedAt })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
