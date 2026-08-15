import Link from "next/link";
import { Field, Input, Textarea, Select, Checkbox, Card } from "./ui";
import { SubmitButton } from "./FormButtons";
import { ARTICLE_STATUS, STATUS_LABELS } from "@/lib/constants";

type Option = { id: string; name: string };
type ArticleData = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  imageCaption: string | null;
  authorId: string | null;
  categoryId: string | null;
  status: string;
  featured: boolean;
  trending: boolean;
  premium: boolean;
  priority: number;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  tags: { tag: { name: string } }[];
};

function dtLocal(d: Date | null): string {
  if (!d) return "";
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function ArticleForm({
  article,
  categories,
  authors,
  action,
}: {
  article?: ArticleData;
  categories: Option[];
  authors: Option[];
  action: (fd: FormData) => void;
}) {
  const a = article;
  const tagString = a?.tags.map((t) => t.tag.name).join(", ") ?? "";

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Main column */}
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Title" htmlFor="title" required>
            <Input id="title" name="title" defaultValue={a?.title} required placeholder="Article headline" />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the title. Used in the URL (/news/…).">
            <Input id="slug" name="slug" defaultValue={a?.slug} placeholder="auto-generated" />
          </Field>
          <Field label="Subtitle" htmlFor="subtitle">
            <Input id="subtitle" name="subtitle" defaultValue={a?.subtitle ?? ""} placeholder="Supporting deck / standfirst" />
          </Field>
          <Field label="Excerpt" htmlFor="excerpt" hint="Short summary for cards and listings.">
            <Textarea id="excerpt" name="excerpt" defaultValue={a?.excerpt ?? ""} className="min-h-[70px]" />
          </Field>
          <Field label="Content" htmlFor="content" required hint="HTML supported (e.g. <p>, <h2>, <ul>, <blockquote>).">
            <Textarea id="content" name="content" defaultValue={a?.content} required className="min-h-[320px] font-mono text-xs" />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">SEO</h3>
          <Field label="SEO Title" htmlFor="seoTitle">
            <Input id="seoTitle" name="seoTitle" defaultValue={a?.seoTitle ?? ""} />
          </Field>
          <Field label="SEO Description" htmlFor="seoDescription">
            <Textarea id="seoDescription" name="seoDescription" defaultValue={a?.seoDescription ?? ""} className="min-h-[70px]" />
          </Field>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={a?.status ?? "DRAFT"}>
              {ARTICLE_STATUS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-col gap-2">
            <Checkbox name="featured" label="Featured" hint="Eligible for homepage hero" defaultChecked={a?.featured} />
            <Checkbox name="trending" label="Trending" hint="Eligible for trending list" defaultChecked={a?.trending} />
            <Checkbox name="premium" label="Premium" hint="Premium-gated content" defaultChecked={a?.premium} />
          </div>
          <Field label="Priority" htmlFor="priority" hint="Higher shows first in ranked sections.">
            <Input id="priority" name="priority" type="number" defaultValue={a?.priority ?? 0} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton label={a ? "Save Changes" : "Create Article"} />
          </div>
        </Card>

        <Card className="space-y-4">
          <Field label="Category" htmlFor="categoryId">
            <Select id="categoryId" name="categoryId" defaultValue={a?.categoryId ?? ""}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Author" htmlFor="authorId">
            <Select id="authorId" name="authorId" defaultValue={a?.authorId ?? ""}>
              <option value="">— None —</option>
              {authors.map((au) => (
                <option key={au.id} value={au.id}>{au.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tags" htmlFor="tags" hint="Comma-separated.">
            <Input id="tags" name="tags" defaultValue={tagString} placeholder="AI, Research, Innovation" />
          </Field>
        </Card>

        <Card className="space-y-4">
          <Field
            label="Featured Image URL"
            htmlFor="featuredImage"
            hint="Use a direct image URL or a publicly accessible Google Drive image. Google Images thumbnail URLs may not work reliably."
          >
            <Input id="featuredImage" name="featuredImage" defaultValue={a?.featuredImage ?? ""} placeholder="https://example.com/image.jpg" />
          </Field>
          <Field label="Image Caption" htmlFor="imageCaption">
            <Input id="imageCaption" name="imageCaption" defaultValue={a?.imageCaption ?? ""} />
          </Field>
        </Card>

        <Card className="space-y-4">
          <Field label="Publish date" htmlFor="publishedAt" hint="Used when status is Published.">
            <Input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={dtLocal(a?.publishedAt ?? null)} />
          </Field>
          <Field label="Scheduled for" htmlFor="scheduledFor">
            <Input id="scheduledFor" name="scheduledFor" type="datetime-local" defaultValue={dtLocal(a?.scheduledFor ?? null)} />
          </Field>
        </Card>

        <Link href="/admin/articles" className="btn-outline w-full">Cancel</Link>
      </div>
    </form>
  );
}
