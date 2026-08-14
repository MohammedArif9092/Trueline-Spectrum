"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, bool } from "@/lib/admin";
import { audit } from "@/lib/audit";

function revalidateSurfaces() {
  revalidatePath("/");
  revalidatePath("/research");
  revalidatePath("/admin/research");
}

async function read(fd: FormData, ignoreId?: string) {
  const title = str(fd, "title");
  const slug = await uniqueSlug(
    str(fd, "slug") || title,
    async (s) => {
      const e = await prisma.research.findUnique({ where: { slug: s } });
      return !!e && e.id !== ignoreId;
    },
    "research"
  );
  const status = str(fd, "status") || "DRAFT";
  const publishedRaw = str(fd, "publishedAt");
  return {
    title,
    slug,
    summary: str(fd, "summary"),
    content: optStr(fd, "content"),
    researchCategory: str(fd, "researchCategory") || "research",
    institution: optStr(fd, "institution"),
    researchers: optStr(fd, "researchers"),
    publicationInfo: optStr(fd, "publicationInfo"),
    featuredImage: optStr(fd, "featuredImage"),
    status,
    featured: bool(fd, "featured"),
    publishedAt: status === "PUBLISHED" ? (publishedRaw ? new Date(publishedRaw) : new Date()) : (publishedRaw ? new Date(publishedRaw) : null),
  };
}

export async function createResearch(fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd);
  const item = await prisma.research.create({ data });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Research", entityId: item.id, detail: item.title });
  revalidateSurfaces();
  redirect(`/admin/research/${item.id}/edit?saved=1`);
}

export async function updateResearch(id: string, fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd, id);
  await prisma.research.update({ where: { id }, data });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Research", entityId: id, detail: data.title });
  revalidateSurfaces();
  redirect(`/admin/research/${id}/edit?saved=1`);
}

export async function deleteResearch(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.research.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Research", entityId: id });
  revalidateSurfaces();
  redirect("/admin/research");
}
