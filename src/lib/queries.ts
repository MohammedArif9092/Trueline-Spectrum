import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

/** Only surface content that is genuinely live. */
export function publishedArticleWhere(
  extra: Prisma.ArticleWhereInput = {}
): Prisma.ArticleWhereInput {
  return {
    status: "PUBLISHED",
    publishedAt: { lte: new Date() },
    ...extra,
  };
}

const articleCardSelect = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  excerpt: true,
  featuredImage: true,
  premium: true,
  readingMinutes: true,
  publishedAt: true,
  author: { select: { name: true, slug: true } },
  category: { select: { name: true, slug: true, section: true } },
} satisfies Prisma.ArticleSelect;

export type ArticleCardData = Prisma.ArticleGetPayload<{
  select: typeof articleCardSelect;
}>;

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: publishedArticleWhere({ featured: true }),
    orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
    include: {
      author: { select: { name: true, slug: true, title: true } },
      category: { select: { name: true, slug: true, section: true } },
    },
  });
}

export async function getTopStories(limit = 5, excludeIds: string[] = []) {
  return prisma.article.findMany({
    where: publishedArticleWhere(
      excludeIds.length ? { id: { notIn: excludeIds } } : {}
    ),
    orderBy: [{ priority: "desc" }, { views: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: articleCardSelect,
  });
}

export async function getLatestArticles(limit = 8, excludeIds: string[] = []) {
  return prisma.article.findMany({
    where: publishedArticleWhere(
      excludeIds.length ? { id: { notIn: excludeIds } } : {}
    ),
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function getTrendingArticles(limit = 6) {
  return prisma.article.findMany({
    where: publishedArticleWhere({ trending: true }),
    orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: articleCardSelect,
  });
}

export async function getArticlesBySection(section: string, limit = 4) {
  return prisma.article.findMany({
    where: publishedArticleWhere({ category: { section } }),
    orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: articleCardSelect,
  });
}

export async function getArticlesByCategorySlug(slug: string, limit = 12, skip = 0) {
  return prisma.article.findMany({
    where: publishedArticleWhere({ category: { slug } }),
    orderBy: { publishedAt: "desc" },
    take: limit,
    skip,
    select: articleCardSelect,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, ...publishedArticleWhere() },
    include: {
      author: { select: { name: true, slug: true, title: true, bio: true, avatar: true } },
      category: { select: { name: true, slug: true, section: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string | null,
  limit = 3
) {
  return prisma.article.findMany({
    where: publishedArticleWhere({
      id: { not: articleId },
      ...(categoryId ? { categoryId } : {}),
    }),
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function incrementArticleViews(id: string) {
  try {
    await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
  } catch {
    /* non-critical */
  }
}

export async function getResearch(limit = 4, category?: string) {
  return prisma.research.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { researchCategory: category } : {}),
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getUpcomingEvents(limit = 4) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", startDate: { gte: startOfToday() } },
    orderBy: { startDate: "asc" },
    take: limit,
  });
}

export async function getPastEvents(limit = 12) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", startDate: { lt: startOfToday() } },
    orderBy: { startDate: "desc" },
    take: limit,
  });
}

export async function getOrganizations(type?: string, limit = 12, featuredFirst = true) {
  return prisma.organization.findMany({
    where: { status: "PUBLISHED", ...(type ? { type } : {}) },
    orderBy: featuredFirst
      ? [{ featured: "desc" }, { name: "asc" }]
      : [{ name: "asc" }],
    take: limit,
  });
}

export async function getStartupOrganizations(limit = 4) {
  return getOrganizations("startup", limit);
}

export async function getCurrentMagazine() {
  return prisma.magazine.findFirst({
    where: { status: "PUBLISHED", isCurrent: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getMagazines(limit = 12) {
  return prisma.magazine.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getMagazineBySlug(slug: string) {
  return prisma.magazine.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  });
}

export async function getPremiumPlans() {
  return prisma.premiumPlan.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getHomepageSections() {
  const rows = await prisma.homepageSection.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  return rows;
}

export async function getAd(placement: string) {
  return prisma.advertisement.findFirst({
    where: { placement, active: true },
    orderBy: { priority: "asc" },
  });
}

export type SearchType = "all" | "article" | "research" | "event" | "organization" | "magazine";

export async function searchContent(q: string, type: SearchType = "all") {
  const term = q.trim();
  if (!term) {
    return { articles: [], research: [], events: [], organizations: [], magazines: [] };
  }
  // SQLite LIKE is case-insensitive for ASCII, which is sufficient here.
  const like = { contains: term };

  const wantArticles = type === "all" || type === "article";
  const wantResearch = type === "all" || type === "research";
  const wantEvents = type === "all" || type === "event";
  const wantOrgs = type === "all" || type === "organization";
  const wantMags = type === "all" || type === "magazine";

  const [articles, research, events, organizations, magazines] = await Promise.all([
    wantArticles
      ? prisma.article.findMany({
          where: publishedArticleWhere({
            OR: [{ title: like }, { subtitle: like }, { excerpt: like }, { content: like }],
          }),
          orderBy: { publishedAt: "desc" },
          take: 30,
          select: articleCardSelect,
        })
      : Promise.resolve([]),
    wantResearch
      ? prisma.research.findMany({
          where: { status: "PUBLISHED", OR: [{ title: like }, { summary: like }] },
          orderBy: { publishedAt: "desc" },
          take: 20,
        })
      : Promise.resolve([]),
    wantEvents
      ? prisma.event.findMany({
          where: { status: "PUBLISHED", OR: [{ name: like }, { description: like }, { location: like }] },
          orderBy: { startDate: "desc" },
          take: 20,
        })
      : Promise.resolve([]),
    wantOrgs
      ? prisma.organization.findMany({
          where: { status: "PUBLISHED", OR: [{ name: like }, { description: like }, { location: like }] },
          orderBy: { name: "asc" },
          take: 20,
        })
      : Promise.resolve([]),
    wantMags
      ? prisma.magazine.findMany({
          where: { status: "PUBLISHED", OR: [{ editionTitle: like }, { theme: like }, { description: like }] },
          orderBy: { year: "desc" },
          take: 12,
        })
      : Promise.resolve([]),
  ]);

  return { articles, research, events, organizations, magazines };
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
