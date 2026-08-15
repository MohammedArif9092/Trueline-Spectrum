import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

/**
 * Revalidation windows (seconds) for the public data cache.
 * Public content is read-heavy and changes infrequently (a monthly magazine),
 * so we serve it from Next.js' Data Cache and refresh in the background. This
 * removes the per-navigation Neon round-trips that made pages slow. None of the
 * admin/auth/session paths use these helpers, so they are never cached.
 */
const TTL = {
  content: 60, // articles, research, events — refreshed within a minute
  config: 300, // site settings, ticker, homepage sections, ads, orgs, magazines
  plans: 600, // premium plans (very static)
} as const;

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

export const getFeaturedArticle = unstable_cache(
  async () => {
    return prisma.article.findFirst({
      where: publishedArticleWhere({ featured: true }),
      orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
      include: {
        author: { select: { name: true, slug: true, title: true } },
        category: { select: { name: true, slug: true, section: true } },
      },
    });
  },
  ["featured-article"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export const getTopStories = unstable_cache(
  async (limit = 5, excludeIds: string[] = []) => {
    return prisma.article.findMany({
      where: publishedArticleWhere(
        excludeIds.length ? { id: { notIn: excludeIds } } : {}
      ),
      orderBy: [{ priority: "desc" }, { views: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: articleCardSelect,
    });
  },
  ["top-stories"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export const getLatestArticles = unstable_cache(
  async (limit = 8, excludeIds: string[] = []) => {
    return prisma.article.findMany({
      where: publishedArticleWhere(
        excludeIds.length ? { id: { notIn: excludeIds } } : {}
      ),
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: articleCardSelect,
    });
  },
  ["latest-articles"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export const getTrendingArticles = unstable_cache(
  async (limit = 6) => {
    return prisma.article.findMany({
      where: publishedArticleWhere({ trending: true }),
      orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: articleCardSelect,
    });
  },
  ["trending-articles"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export const getArticlesBySection = unstable_cache(
  async (section: string, limit = 4) => {
    return prisma.article.findMany({
      where: publishedArticleWhere({ category: { section } }),
      orderBy: [{ priority: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: articleCardSelect,
    });
  },
  ["articles-by-section"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export const getArticlesByCategorySlug = unstable_cache(
  async (slug: string, limit = 12, skip = 0) => {
    return prisma.article.findMany({
      where: publishedArticleWhere({ category: { slug } }),
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip,
      select: articleCardSelect,
    });
  },
  ["articles-by-category"],
  { revalidate: TTL.content, tags: ["articles"] }
);

/**
 * Detail fetch for a single article. Deduplicated per-request with React
 * `cache()` (NOT the Data Cache) so `generateMetadata` and the page component
 * share one query while `publishedAt`/`updatedAt` stay real Date objects for
 * `.toISOString()`. View counts must stay live, so this is not cross-request
 * cached.
 */
export const getArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findFirst({
    where: { slug, ...publishedArticleWhere() },
    include: {
      author: { select: { name: true, slug: true, title: true, bio: true, avatar: true } },
      category: { select: { name: true, slug: true, section: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });
});

export const getRelatedArticles = unstable_cache(
  async (articleId: string, categoryId: string | null, limit = 3) => {
    return prisma.article.findMany({
      where: publishedArticleWhere({
        id: { not: articleId },
        ...(categoryId ? { categoryId } : {}),
      }),
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: articleCardSelect,
    });
  },
  ["related-articles"],
  { revalidate: TTL.content, tags: ["articles"] }
);

export async function incrementArticleViews(id: string) {
  try {
    await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
  } catch {
    /* non-critical */
  }
}

export const getResearch = unstable_cache(
  async (limit = 4, category?: string) => {
    return prisma.research.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { researchCategory: category } : {}),
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });
  },
  ["research-list"],
  { revalidate: TTL.content, tags: ["research"] }
);

export const getUpcomingEvents = unstable_cache(
  async (limit = 4) => {
    return prisma.event.findMany({
      where: { status: "PUBLISHED", startDate: { gte: startOfToday() } },
      orderBy: { startDate: "asc" },
      take: limit,
    });
  },
  ["upcoming-events"],
  { revalidate: TTL.content, tags: ["events"] }
);

export const getPastEvents = unstable_cache(
  async (limit = 12) => {
    return prisma.event.findMany({
      where: { status: "PUBLISHED", startDate: { lt: startOfToday() } },
      orderBy: { startDate: "desc" },
      take: limit,
    });
  },
  ["past-events"],
  { revalidate: TTL.content, tags: ["events"] }
);

export const getOrganizations = unstable_cache(
  async (type?: string, limit = 12, featuredFirst = true) => {
    return prisma.organization.findMany({
      where: { status: "PUBLISHED", ...(type ? { type } : {}) },
      orderBy: featuredFirst
        ? [{ featured: "desc" }, { name: "asc" }]
        : [{ name: "asc" }],
      take: limit,
    });
  },
  ["organizations"],
  { revalidate: TTL.config, tags: ["organizations"] }
);

export async function getStartupOrganizations(limit = 4) {
  return getOrganizations("startup", limit);
}

export const getCurrentMagazine = unstable_cache(
  async () => {
    return prisma.magazine.findFirst({
      where: { status: "PUBLISHED", isCurrent: true },
      orderBy: { publishedAt: "desc" },
    });
  },
  ["current-magazine"],
  { revalidate: TTL.config, tags: ["magazines"] }
);

export const getMagazines = unstable_cache(
  async (limit = 12) => {
    return prisma.magazine.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });
  },
  ["magazine-list"],
  { revalidate: TTL.config, tags: ["magazines"] }
);

export async function getMagazineBySlug(slug: string) {
  return prisma.magazine.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  });
}

export const getPremiumPlans = unstable_cache(
  async () => {
    return prisma.premiumPlan.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  },
  ["premium-plans"],
  { revalidate: TTL.plans, tags: ["plans"] }
);

export const getHomepageSections = unstable_cache(
  async () => {
    return prisma.homepageSection.findMany({
      where: { enabled: true },
      orderBy: { order: "asc" },
    });
  },
  ["homepage-sections"],
  { revalidate: TTL.config, tags: ["homepage"] }
);

export const getAd = unstable_cache(
  async (placement: string) => {
    return prisma.advertisement.findFirst({
      where: { placement, active: true },
      orderBy: { priority: "asc" },
    });
  },
  ["advertisement"],
  { revalidate: TTL.config, tags: ["ads"] }
);

/**
 * Site settings and ticker items are read by the shared layout (Footer,
 * TrendingTicker) and the About page on every navigation. Cache them so those
 * layout queries do not hit Neon on each request. Both are date-free key/value
 * style rows, so serialization is safe.
 */
export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
      string,
      string
    >;
  },
  ["site-settings"],
  { revalidate: TTL.config, tags: ["settings"] }
);

export const getTickerItems = unstable_cache(
  async () => {
    return prisma.tickerItem.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      take: 12,
    });
  },
  ["ticker-items"],
  { revalidate: TTL.config, tags: ["ticker"] }
);

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
