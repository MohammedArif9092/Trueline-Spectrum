"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, str, optStr, bool, int } from "@/lib/admin";
import { audit } from "@/lib/audit";
import { slugify, readingTime } from "@/lib/utils";
import { ARTICLE_STATUS } from "@/lib/constants";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "article";
  let slug = root;
  let n = 2;
  // Ensure uniqueness against other rows.
  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${n++}`;
  }
}

function revalidateArticleSurfaces() {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
}

async function readForm(fd: FormData, ignoreId?: string) {
  const title = str(fd, "title");
  const providedSlug = str(fd, "slug");
  const slug = await uniqueSlug(providedSlug || title, ignoreId);
  const content = str(fd, "content");
  let status = str(fd, "status") || "DRAFT";
  if (!ARTICLE_STATUS.includes(status as never)) status = "DRAFT";

  const publishDateRaw = str(fd, "publishedAt");
  const scheduledRaw = str(fd, "scheduledFor");

  return {
    title,
    slug,
    subtitle: optStr(fd, "subtitle"),
    excerpt: optStr(fd, "excerpt"),
    content,
    featuredImage: optStr(fd, "featuredImage"),
    imageCaption: optStr(fd, "imageCaption"),
    authorId: optStr(fd, "authorId"),
    categoryId: optStr(fd, "categoryId"),
    status,
    featured: bool(fd, "featured"),
    trending: bool(fd, "trending"),
    premium: bool(fd, "premium"),
    priority: int(fd, "priority", 0),
    readingMinutes: content ? readingTime(content) : 4,
    seoTitle: optStr(fd, "seoTitle"),
    seoDescription: optStr(fd, "seoDescription"),
    publishedAt:
      status === "PUBLISHED"
        ? publishDateRaw
          ? new Date(publishDateRaw)
          : new Date()
        : publishDateRaw
          ? new Date(publishDateRaw)
          : null,
    scheduledFor: scheduledRaw ? new Date(scheduledRaw) : null,
    tagNames: str(fd, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

async function syncTags(articleId: string, tagNames: string[]) {
  await prisma.articleTag.deleteMany({ where: { articleId } });
  for (const name of tagNames) {
    const slug = slugify(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    await prisma.articleTag.create({ data: { articleId, tagId: tag.id } });
  }
}

export async function createArticle(fd: FormData) {
  const session = await requireAdmin();
  const data = await readForm(fd);
  const { tagNames, ...rest } = data;
  const article = await prisma.article.create({
    data: { ...rest, createdById: session.sub },
  });
  await syncTags(article.id, tagNames);
  await audit({ adminId: session.sub, action: "CREATE", entity: "Article", entityId: article.id, detail: article.title });
  revalidateArticleSurfaces();
  redirect(`/admin/articles/${article.id}/edit?saved=1`);
}

export async function updateArticle(id: string, fd: FormData) {
  const session = await requireAdmin();
  const data = await readForm(fd, id);
  const { tagNames, ...rest } = data;
  await prisma.article.update({ where: { id }, data: rest });
  await syncTags(id, tagNames);
  await audit({ adminId: session.sub, action: "UPDATE", entity: "Article", entityId: id, detail: rest.title });
  revalidateArticleSurfaces();
  redirect(`/admin/articles/${id}/edit?saved=1`);
}

export async function setArticleStatus(fd: FormData) {
  const session = await requireAdmin();
  const id = str(fd, "id");
  let status = str(fd, "status");
  if (!ARTICLE_STATUS.includes(status as never)) return;

  const patch: Record<string, unknown> = { status };
  if (status === "PUBLISHED") {
    const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) patch.publishedAt = new Date();
  }
  await prisma.article.update({ where: { id }, data: patch });
  await audit({ adminId: session.sub, action: status === "PUBLISHED" ? "PUBLISH" : "UPDATE", entity: "Article", entityId: id, detail: `status→${status}` });
  revalidateArticleSurfaces();
}

export async function deleteArticle(fd: FormData) {
  const session = await requireAdmin();
  const id = str(fd, "id");
  await prisma.article.delete({ where: { id } });
  await audit({ adminId: session.sub, action: "DELETE", entity: "Article", entityId: id });
  revalidateArticleSurfaces();
  redirect("/admin/articles");
}
