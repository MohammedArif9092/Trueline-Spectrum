"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, uniqueSlug, str, optStr, bool, int } from "@/lib/admin";
import { audit } from "@/lib/audit";

function rev() {
  revalidatePath("/");
  revalidatePath("/premium");
  revalidatePath("/admin/plans");
}

function featuresJson(fd: FormData): string {
  const lines = str(fd, "features").split("\n").map((l) => l.trim()).filter(Boolean);
  return JSON.stringify(lines);
}

export async function createPlan(fd: FormData) {
  const s = await requireAdmin();
  const name = str(fd, "name");
  const slug = await uniqueSlug(name, async (x) => !!(await prisma.premiumPlan.findUnique({ where: { slug: x } })), "plan");
  const item = await prisma.premiumPlan.create({
    data: {
      name, slug, priceLabel: str(fd, "priceLabel") || "₹0", interval: optStr(fd, "interval"),
      tagline: optStr(fd, "tagline"), features: featuresJson(fd),
      highlighted: bool(fd, "highlighted"), order: int(fd, "order", 0), active: true,
    },
  });
  await audit({ adminId: s.sub, action: "CREATE", entity: "PremiumPlan", entityId: item.id, detail: name });
  rev();
  redirect("/admin/plans");
}

export async function updatePlan(id: string, fd: FormData) {
  const s = await requireAdmin();
  await prisma.premiumPlan.update({
    where: { id },
    data: {
      name: str(fd, "name"), priceLabel: str(fd, "priceLabel") || "₹0", interval: optStr(fd, "interval"),
      tagline: optStr(fd, "tagline"), features: featuresJson(fd),
      highlighted: bool(fd, "highlighted"), order: int(fd, "order", 0), active: bool(fd, "active"),
    },
  });
  await audit({ adminId: s.sub, action: "UPDATE", entity: "PremiumPlan", entityId: id });
  rev();
  redirect("/admin/plans");
}

export async function deletePlan(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, "id");
  await prisma.premiumPlan.delete({ where: { id } });
  await audit({ adminId: s.sub, action: "DELETE", entity: "PremiumPlan", entityId: id });
  rev();
}
