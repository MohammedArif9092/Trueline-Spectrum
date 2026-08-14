import type { Metadata } from "next";
import { SectionArticlesPage } from "@/components/content/SectionArticlesPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Technology",
  description: "Technology coverage — computing, robotics, semiconductors and emerging tech.",
};

export default function Page() {
  return (
    <SectionArticlesPage
      section="technology"
      title="Technology"
      kicker="Computing & emerging tech"
      description="Deep coverage of computing, robotics, semiconductors and the technologies shaping tomorrow."
    />
  );
}
