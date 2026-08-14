"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, str } from "@/lib/admin";
import { audit } from "@/lib/audit";

const KEYS = [
  "siteName", "tagline", "contactEmail", "footerAbout",
  "social_linkedin", "social_x", "social_youtube",
];

export async function saveSettings(fd: FormData) {
  const s = await requireAdmin();
  for (const key of KEYS) {
    const value = str(fd, key);
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  await audit({ adminId: s.sub, action: "UPDATE", entity: "SiteSetting", detail: "settings saved" });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
