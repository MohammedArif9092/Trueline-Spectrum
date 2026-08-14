"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, str, optStr } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/admin/media");
}

export async function addMedia(fd: FormData) {
  const s = await requireAdmin();
  const url = str(fd, "url");
  if (!url) return;
  let filename = str(fd, "filename");
  if (!filename) {
    try {
      filename = new URL(url).pathname.split("/").pop() || "asset";
    } catch {
      filename = "asset";
    }
  }
  const item = await prisma.mediaAsset.create({
    data: { url, filename, alt: optStr(fd, "alt"), mimeType: optStr(fd, "mimeType") },
  });
  await audit({ adminId: s.sub, action: "CREATE", entity: "MediaAsset", entityId: item.id, detail: filename });
  rev();
}

export async function deleteMedia(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.mediaAsset.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "MediaAsset", entityId: id });
  rev();
}
