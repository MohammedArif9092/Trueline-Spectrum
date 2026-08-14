"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, bool, int } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/magazine");
  revalidatePath("/admin/magazines");
}

async function read(fd: FormData, ignoreId?: string) {
  const title = str(fd, "editionTitle");
  const month = str(fd, "month");
  const year = int(fd, "year", new Date().getFullYear());
  const slug = await uniqueSlug(str(fd, "slug") || `${month}-${year}-edition`, async (s) => {
    const e = await prisma.magazine.findUnique({ where: { slug: s } });
    return !!e && e.id !== ignoreId;
  }, "edition");
  const status = str(fd, "status") || "DRAFT";
  const publishedRaw = str(fd, "publishedAt");
  return {
    editionTitle: title, slug, month, year,
    coverImage: str(fd, "coverImage"),
    description: optStr(fd, "description"),
    theme: optStr(fd, "theme"),
    status,
    isCurrent: bool(fd, "isCurrent"),
    featured: bool(fd, "featured"),
    publishedAt: status === "PUBLISHED" ? (publishedRaw ? new Date(publishedRaw) : new Date()) : (publishedRaw ? new Date(publishedRaw) : null),
  };
}

async function ensureSingleCurrent(id: string, isCurrent: boolean) {
  if (isCurrent) {
    await prisma.magazine.updateMany({ where: { id: { not: id }, isCurrent: true }, data: { isCurrent: false } });
  }
}

export async function createMagazine(fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd);
  const item = await prisma.magazine.create({ data });
  await ensureSingleCurrent(item.id, data.isCurrent);
  await audit({ adminId: s.sub, action: "CREATE", entity: "Magazine", entityId: item.id, detail: item.editionTitle });
  rev();
  redirect(`/admin/magazines/${item.id}/edit?saved=1`);
}
export async function updateMagazine(id: string, fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd, id);
  await prisma.magazine.update({ where: { id }, data });
  await ensureSingleCurrent(id, data.isCurrent);
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Magazine", entityId: id, detail: data.editionTitle });
  rev();
  redirect(`/admin/magazines/${id}/edit?saved=1`);
}
export async function deleteMagazine(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.magazine.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Magazine", entityId: id });
  rev();
  redirect("/admin/magazines");
}

export async function addMagazinePage(fd: FormData) {
  await requireAdmin();
  const magazineId = str(fd, "magazineId");
  const last = await prisma.magazinePage.findFirst({ where: { magazineId }, orderBy: { pageNumber: "desc" } });
  const pageNumber = (last?.pageNumber ?? 0) + 1;
  await prisma.magazinePage.create({
    data: { magazineId, pageNumber, title: optStr(fd, "title"), image: optStr(fd, "image"), body: optStr(fd, "body") },
  });
  rev();
  revalidatePath(`/admin/magazines/${magazineId}/edit`);
}
export async function deleteMagazinePage(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const magazineId = str(fd, "magazineId");
  await prisma.magazinePage.delete({ where: { id } });
  rev();
  revalidatePath(`/admin/magazines/${magazineId}/edit`);
}
