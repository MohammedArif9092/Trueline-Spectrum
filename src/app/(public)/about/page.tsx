import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { FounderMessage } from "@/components/content/FounderMessage";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  
  title: "About & Leadership",
  description: `About ${SITE.name} — our mission and a message from the founder on connecting education, research, technology, industry and innovation.`,
};

export default async function Page() {
  const s = await getSiteSettings();

  return (
    <div className="pb-8">
      <PageHeader
        kicker="About Trueline Spectrum"
        title="The Knowledge Ecosystem"
        description={SITE.positioning}
        breadcrumb={[{ label: "About" }]}
      />

      <FounderMessage
        founder={{
          name: s.founderName,
          title: s.founderTitle,
          message: s.founderMessage,
          photo: s.founderPhoto,
          linkedin: s.founderLinkedin,
          email: s.founderEmail,
        }}
      />
    </div>
  );
}

