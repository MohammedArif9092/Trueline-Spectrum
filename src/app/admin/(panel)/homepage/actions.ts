"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, str, optStr, bool, int } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function saveSection(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await prisma.homepageSection.update({
    where: { id },
    data: { title: str(fd, "title"), subtitle: optStr(fd, "subtitle"), order: int(fd, "order", 0), enabled: bool(fd, "enabled") },
  });
  rev();
}

export async function addTicker(fd: FormData) {
  await requireAdmin();
  const label = str(fd, "label");
  if (!label) return;
  const last = await prisma.tickerItem.findFirst({ orderBy: { order: "desc" } });
  await prisma.tickerItem.create({ data: { label, href: optStr(fd, "href"), order: (last?.order ?? -1) + 1 } });
  rev();
}

export async function toggleTicker(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const item = await prisma.tickerItem.findUnique({ where: { id } });
  if (item) await prisma.tickerItem.update({ where: { id }, data: { active: !item.active } });
  rev();
}

export async function deleteTicker(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.tickerItem.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "TickerItem", entityId: id });
  rev();
}
