import type { Metadata } from "next";
import { SectionArticlesPage } from "@/components/content/SectionArticlesPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Artificial Intelligence",
  description: "Artificial intelligence — applied AI, machine learning, and responsible innovation.",
};

export default function Page() {
  return (
    <SectionArticlesPage
      section="ai"
      title="Artificial Intelligence"
      kicker="Applied AI & ML"
      description="Applied AI, machine learning, and the governance shaping responsible innovation."
    />
  );
}
