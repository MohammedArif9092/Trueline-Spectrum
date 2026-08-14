"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, str, optStr, bool, int } from "@/lib/admin";
import { audit } from "@/lib/audit";
import { AD_PLACEMENTS } from "@/lib/constants";

function rev() {
  revalidatePath("/");
  revalidatePath("/admin/ads");
}

export async function createAd(fd: FormData) {
  const s = await requireAdmin();
  let placement = str(fd, "placement");
  if (!AD_PLACEMENTS.includes(placement as never)) placement = "sidebar";
  const item = await prisma.advertisement.create({
    data: {
      name: str(fd, "name") || "Untitled Placement", placement,
      imageUrl: optStr(fd, "imageUrl"), linkUrl: optStr(fd, "linkUrl"),
      html: optStr(fd, "html"), active: true, priority: int(fd, "priority", 0),
    },
  });
  await audit({ adminId: s.sub, action: "CREATE", entity: "Advertisement", entityId: item.id });
  rev();
}

export async function updateAd(id: string, fd: FormData) {
  const s = await requireAdmin();
  await prisma.advertisement.update({
    where: { id },
    data: {
      name: str(fd, "name"), imageUrl: optStr(fd, "imageUrl"), linkUrl: optStr(fd, "linkUrl"),
      html: optStr(fd, "html"), active: bool(fd, "active"), priority: int(fd, "priority", 0),
    },
  });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "Advertisement", entityId: id });
  rev();
}

export async function deleteAd(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.advertisement.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "Advertisement", entityId: id });
  rev();
}
