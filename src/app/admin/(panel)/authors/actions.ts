"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/admin/authors");
}

export async function createAuthor(fd: FormData) {
  const s = await requireAdmin();
  const name = str(fd, "name");
  if (!name) return;
  const slug = await uniqueSlug(name, async (x) => !!(await prisma.author.findUnique({ where: { slug: x } })), "author");
  const item = await prisma.author.create({
    data: { name, slug, title: optStr(fd, "title"), bio: optStr(fd, "bio"), avatar: optStr(fd, "avatar"), email: optStr(fd, "email") },
  });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Author", entityId: item.id, detail: name });
  rev();
}

export async function updateAuthor(id: string, fd: FormData) {
  const s = await requireAdmin();
  await prisma.author.update({
    where: { id },
    data: { name: str(fd, "name"), title: optStr(fd, "title"), bio: optStr(fd, "bio"), avatar: optStr(fd, "avatar"), email: optStr(fd, "email") },
  });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Author", entityId: id });
  rev();
  redirect("/admin/authors");
}

export async function deleteAuthor(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.author.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Author", entityId: id });
  rev();
}
