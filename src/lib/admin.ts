import "server-only";
import { getSession, type Session } from "./auth";

/** Ensure the caller is an authenticated admin inside a Server Action. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

/** Only OWNER/ADMIN may perform destructive or configuration operations. */
export async function requireRole(roles: string[]): Promise<Session> {
  const session = await requireAdmin();
  if (!roles.includes(session.role)) {
    throw new Error("Insufficient permissions");
  }
  return session;
}

import { slugify } from "./utils";

/** Generate a slug unique per an entity, given an existence check. */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
  fallback = "item"
): Promise<string> {
  const root = slugify(base) || fallback;
  let slug = root;
  let n = 2;
  while (await exists(slug)) slug = `${root}-${n++}`;
  return slug;
}

export function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? "").toString().trim();
}
export function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v.length ? v : null;
}
export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
export function int(fd: FormData, key: string, fallback = 0): number {
  const n = parseInt(str(fd, key), 10);
  return isNaN(n) ? fallback : n;
}
