"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, bool } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/organizations");
  revalidatePath("/startups");
  revalidatePath("/admin/organizations");
}

async function read(fd: FormData, ignoreId?: string) {
  const name = str(fd, "name");
  const slug = await uniqueSlug(str(fd, "slug") || name, async (s) => {
    const e = await prisma.organization.findUnique({ where: { slug: s } });
    return !!e && e.id !== ignoreId;
  }, "organization");
  return {
    name, slug,
    type: str(fd, "type") || "university",
    logo: optStr(fd, "logo"),
    coverImage: optStr(fd, "coverImage"),
    description: optStr(fd, "description"),
    location: optStr(fd, "location"),
    website: optStr(fd, "website"),
    contactEmail: optStr(fd, "contactEmail"),
    contactPhone: optStr(fd, "contactPhone"),
    founded: optStr(fd, "founded"),
    achievements: optStr(fd, "achievements"),
    status: str(fd, "status") || "PUBLISHED",
    featured: bool(fd, "featured"),
  };
}

export async function createOrganization(fd: FormData) {
  const s = await requireAdmin();
  const item = await prisma.organization.create({ data: await read(fd) });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Organization", entityId: item.id, detail: item.name });
  rev();
  redirect(`/admin/organizations/${item.id}/edit?saved=1`);
}
export async function updateOrganization(id: string, fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd, id);
  await prisma.organization.update({ where: { id }, data });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Organization", entityId: id, detail: data.name });
  rev();
  redirect(`/admin/organizations/${id}/edit?saved=1`);
}
export async function deleteOrganization(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.organization.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Organization", entityId: id });
  rev();
  redirect("/admin/organizations");
}
