/**
 * Trueline Spectrum — application-layer enums & controlled vocabularies.
 * Kept in the app (not the DB) so the schema stays portable between SQLite and
 * PostgreSQL. Validate against these before writing enum-like string fields.
 */

export const SITE = {
  name: "Trueline Spectrum",
  tagline: "A Monthly Science & Technology Magazine",
  positioning:
    "The Professional Knowledge Ecosystem for Education, Research, Technology, Industry and Innovation.",
  description:
    "Trueline Spectrum is a professional digital magazine and media platform connecting education, research, technology, AI, industry, startups and innovation.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/brand/trueline-spectrum-logo.png",
} as const;

// Editorial workflow states
export const ARTICLE_STATUS = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
  "REJECTED",
] as const;
export type ArticleStatus = (typeof ARTICLE_STATUS)[number];

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Review",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
  REJECTED: "Rejected",
};

// Admin roles
export const ADMIN_ROLES = ["OWNER", "ADMIN", "EDITOR"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// Top-level navigation sections (used by Category.section + section pages)
export const SECTIONS = [
  { key: "news", label: "News", href: "/news" },
  { key: "technology", label: "Technology", href: "/technology" },
  { key: "ai", label: "AI", href: "/ai" },
  { key: "research", label: "Research", href: "/research" },
  { key: "education", label: "Education", href: "/education" },
  { key: "industry", label: "Industry", href: "/industry" },
  { key: "startups", label: "Startups", href: "/startups" },
] as const;
export type SectionKey = (typeof SECTIONS)[number]["key"];

// Primary controlled categories (section 27 of the brief)
export const PRIMARY_CATEGORIES: { name: string; section: string }[] = [
  { name: "Technology", section: "technology" },
  { name: "Artificial Intelligence", section: "ai" },
  { name: "Research", section: "research" },
  { name: "Science", section: "research" },
  { name: "Education", section: "education" },
  { name: "Universities", section: "education" },
  { name: "Industry", section: "industry" },
  { name: "Manufacturing", section: "industry" },
  { name: "GCC", section: "industry" },
  { name: "Startups", section: "startups" },
  { name: "Entrepreneurship", section: "startups" },
  { name: "Innovation", section: "research" },
  { name: "Patents", section: "research" },
  { name: "Incubation", section: "startups" },
  { name: "Events", section: "events" },
  { name: "Rankings", section: "education" },
  { name: "Accreditation", section: "education" },
  { name: "Student Achievements", section: "education" },
  { name: "Faculty Development", section: "education" },
];

export const RESEARCH_CATEGORIES = [
  { key: "research", label: "Research" },
  { key: "publication", label: "Publications" },
  { key: "patent", label: "Patents" },
  { key: "innovation", label: "Innovation" },
] as const;

export const EVENT_CATEGORIES = [
  { key: "conference", label: "Conference" },
  { key: "seminar", label: "Seminar" },
  { key: "workshop", label: "Workshop" },
  { key: "fdp", label: "FDP" },
  { key: "hackathon", label: "Hackathon" },
  { key: "webinar", label: "Webinar" },
  { key: "expo", label: "Project Expo" },
  { key: "innovation", label: "Innovation Event" },
] as const;

export const ORG_TYPES = [
  { key: "university", label: "University" },
  { key: "college", label: "College" },
  { key: "research-center", label: "Research Center" },
  { key: "incubation", label: "Incubation Center" },
  { key: "startup", label: "Startup" },
  { key: "company", label: "Company" },
  { key: "gcc", label: "GCC" },
] as const;

export const AD_PLACEMENTS = [
  "header",
  "homepage",
  "article",
  "sidebar",
  "magazine",
] as const;

// Homepage section registry — order + default titles
export const HOMEPAGE_SECTIONS = [
  { key: "hero", title: "Featured Story" },
  { key: "topStories", title: "Top Stories" },
  { key: "latest", title: "Latest News" },
  { key: "research", title: "Research & Innovation" },
  { key: "education", title: "Education" },
  { key: "industry", title: "Industry" },
  { key: "startups", title: "Startup Spotlight" },
  { key: "events", title: "Upcoming Events" },
  { key: "magazine", title: "The Digital Magazine" },
  { key: "premium", title: "Premium Plans" },
  { key: "newsletter", title: "Stay Updated" },
] as const;

export function sectionLabel(key: string): string {
  return SECTIONS.find((s) => s.key === key)?.label ?? key;
}
