import { getArticlesBySection } from "@/lib/queries";
import { PageHeader } from "./PageHeader";
import { ArticleGrid } from "./ArticleGrid";

/** Shared server component powering the section listing routes. */
export async function SectionArticlesPage({
  section,
  title,
  kicker,
  description,
}: {
  section: string;
  title: string;
  kicker: string;
  description: string;
}) {
  const articles = await getArticlesBySection(section, 24);
  return (
    <div className="pb-8">
      <PageHeader kicker={kicker} title={title} description={description} breadcrumb={[{ label: title }]} />
      <div className="container-editorial py-10">
        <ArticleGrid articles={articles} />
      </div>
    </div>
  );
}
