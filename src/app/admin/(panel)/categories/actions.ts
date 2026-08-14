"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, int } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function createCategory(fd: FormData) {
  const s = await requireAdmin();
  const name = str(fd, "name");
  if (!name) return;
  const slug = await uniqueSlug(str(fd, "slug") || name, async (x) => !!(await prisma.category.findUnique({ where: { slug: x } })), "category");
  const item = await prisma.category.create({
    data: { name, slug, section: str(fd, "section") || "news", description: optStr(fd, "description"), order: int(fd, "order", 0) },
  });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Category", entityId: item.id, detail: name });
  rev();
}

export async function updateCategory(id: string, fd: FormData) {
  const s = await requireAdmin();
  await prisma.category.update({
    where: { id },
    data: { name: str(fd, "name"), section: str(fd, "section") || "news", description: optStr(fd, "description"), order: int(fd, "order", 0) },
  });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Category", entityId: id });
  rev();
  redirect("/admin/categories");
}

export async function deleteCategory(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.category.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Category", entityId: id });
  rev();
}
