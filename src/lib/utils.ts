/** Small, dependency-light helpers used across the app. */

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

export function relativeTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateShort(d);
}

export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerptFrom(html: string, length = 180): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Remote hosts that next/image is allowed to OPTIMIZE.
 * MUST stay in sync with `images.remotePatterns` in next.config.mjs.
 *
 * Note: an image URL does NOT need to be on this list to be displayed. Any
 * other valid direct http(s) image URL is still shown — just served
 * un-optimized (see `resolveImage`), so we never reject a legitimate URL merely
 * for being on an un-configured host, and we never 500 the page.
 */
export const OPTIMIZABLE_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "picsum.photos",
  "lh3.googleusercontent.com", // Google Drive image content endpoint
]);

/** Local placeholder shown when an image URL is missing, malformed or unsupported. */
export const FALLBACK_IMAGE = "/placeholder.svg";

/** Google Images thumbnail / cached-thumbnail hosts — never a permanent source. */
const GOOGLE_THUMBNAIL_HOST = /(^|\.)gstatic\.com$/i;

/**
 * Turn a shared Google Drive file URL into a direct image-serving URL, or return
 * null if it is not a recognisable Drive file link.
 *
 * Handles the common public forms:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?export=view&id=FILE_ID
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *
 * The result points at Google's public content host (lh3.googleusercontent.com),
 * which streams the file bytes directly for *publicly shared* files. Private
 * files simply fail to load and fall back to the placeholder — they are never
 * exposed.
 */
export function googleDriveImageUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.hostname.toLowerCase() !== "drive.google.com") return null;
  const fromPath = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = fromPath?.[1] ?? url.searchParams.get("id");
  if (!id) return null;
  return `https://lh3.googleusercontent.com/d/${id}`;
}

export type ResolvedImage = { src: string; unoptimized: boolean };

/**
 * Resolve a raw (possibly CMS-entered) image URL into something safe to hand to
 * next/image, plus whether it must be rendered un-optimized.
 *
 * Rules:
 *  - empty / malformed / non-http(s)            → local placeholder
 *  - Google Images thumbnail (gstatic)          → local placeholder (unsupported)
 *  - Google Drive share link                    → converted content URL (optimized)
 *  - known optimizable host                      → optimized
 *  - any other valid direct image URL            → shown, but UN-optimized so it
 *      needs no remotePatterns entry and can never 500 the page
 */
export function resolveImage(
  src: string | null | undefined,
  fallback: string = FALLBACK_IMAGE
): ResolvedImage {
  if (!src) return { src: fallback, unoptimized: false };
  const s = src.trim();
  if (!s) return { src: fallback, unoptimized: false };
  // Local/relative paths are optimizable; inline data URIs are served as-is.
  if (s.startsWith("/")) return { src: s, unoptimized: false };
  if (s.startsWith("data:")) return { src: s, unoptimized: true };

  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return { src: fallback, unoptimized: false };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { src: fallback, unoptimized: false };
  }
  const host = url.hostname.toLowerCase();

  // Google Images thumbnails are not stable sources — refuse and fall back.
  if (GOOGLE_THUMBNAIL_HOST.test(host)) return { src: fallback, unoptimized: false };

  // Google Drive share links → direct content URL (optimizable host).
  const drive = googleDriveImageUrl(s);
  if (drive) return { src: drive, unoptimized: false };

  // Trusted, pre-configured hosts get optimized via next/image.
  if (OPTIMIZABLE_IMAGE_HOSTS.has(host)) return { src: s, unoptimized: false };

  // Any other valid direct http(s) image URL is accepted, but rendered
  // un-optimized so it does not require a next.config remotePatterns entry.
  return { src: s, unoptimized: true };
}

/**
 * Return only the resolved src string (back-compat helper). Prefer the
 * `SmartImage` component, which also applies the optimize/error-fallback logic.
 */
export function safeImage(
  src: string | null | undefined,
  fallback: string = FALLBACK_IMAGE
): string {
  return resolveImage(src, fallback).src;
}

/** Canonical URL builders (single source of truth for content routes). */
export const links = {
  article: (slug: string) => `/news/${slug}`,
  research: (slug: string) => `/research/${slug}`,
  event: (slug: string) => `/events/${slug}`,
  organization: (slug: string) => `/organizations/${slug}`,
  magazine: (slug: string) => `/magazine/${slug}`,
  magazineRead: (slug: string) => `/magazine/${slug}/read`,
  category: (slug: string) => `/category/${slug}`,
  section: (section: string) => `/${section}`,
};

/** Safe JSON parse for the JSON-encoded string columns (e.g. PremiumPlan.features). */
export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
