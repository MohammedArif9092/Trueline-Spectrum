"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, str } from "@/lib/admin";

export async function deleteSubscriber(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
