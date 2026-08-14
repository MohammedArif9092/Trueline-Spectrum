import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMagazineBySlug } from "@/lib/queries";
import { MagazineReader } from "@/components/magazine/MagazineReader";
import { links } from "@/lib/utils";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMagazineBySlug(slug);
  if (!m) return { title: "Reader" };
  return { title: `Reading: ${m.editionTitle}`, robots: { index: false, follow: true } };
}

export default async function Page({ params, searchParams }: Params) {
  const { slug } = await params;
  const { page } = await searchParams;
  const magazine = await getMagazineBySlug(slug);
  if (!magazine || magazine.pages.length === 0) notFound();

  const initialPage = Math.min(
    Math.max(1, parseInt(page ?? "1", 10) || 1),
    magazine.pages.length
  );

  return (
    <MagazineReader
      title={magazine.editionTitle}
      theme={magazine.theme}
      month={magazine.month}
      year={magazine.year}
      archiveHref="/magazine"
      editionHref={links.magazine(magazine.slug)}
      initialPage={initialPage}
      pages={magazine.pages.map((p) => ({
        pageNumber: p.pageNumber,
        title: p.title,
        image: p.image,
        body: p.body,
      }))}
    />
  );
}
