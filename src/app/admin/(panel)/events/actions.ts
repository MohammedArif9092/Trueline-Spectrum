"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, bool } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

async function read(fd: FormData, ignoreId?: string) {
  const name = str(fd, "name");
  const slug = await uniqueSlug(str(fd, "slug") || name, async (s) => {
    const e = await prisma.event.findUnique({ where: { slug: s } });
    return !!e && e.id !== ignoreId;
  }, "event");
  const endRaw = str(fd, "endDate");
  return {
    name, slug,
    startDate: new Date(str(fd, "startDate") || new Date().toISOString()),
    endDate: endRaw ? new Date(endRaw) : null,
    time: optStr(fd, "time"),
    location: optStr(fd, "location"),
    mode: str(fd, "mode") || "in-person",
    description: str(fd, "description"),
    organizer: optStr(fd, "organizer"),
    registrationUrl: optStr(fd, "registrationUrl"),
    image: optStr(fd, "image"),
    category: str(fd, "category") || "conference",
    status: str(fd, "status") || "DRAFT",
    featured: bool(fd, "featured"),
  };
}

export async function createEvent(fd: FormData) {
  const s = await requireAdmin();
  const item = await prisma.event.create({ data: await read(fd) });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Event", entityId: item.id, detail: item.name });
  rev();
  redirect(`/admin/events/${item.id}/edit?saved=1`);
}
export async function updateEvent(id: string, fd: FormData) {
  const s = await requireAdmin();
  const data = await read(fd, id);
  await prisma.event.update({ where: { id }, data });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Event", entityId: id, detail: data.name });
  rev();
  redirect(`/admin/events/${id}/edit?saved=1`);
}
export async function deleteEvent(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.event.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Event", entityId: id });
  rev();
  redirect("/admin/events");
}
