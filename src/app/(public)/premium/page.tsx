import type { Metadata } from "next";
import { Check, Crown, ShieldCheck, Megaphone } from "lucide-react";
import { getPremiumPlans } from "@/lib/queries";
import { PageHeader } from "@/components/content/PageHeader";
import { PlanGrid } from "@/components/content/PlanGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Premium Plans",
  description:
    "Explore Trueline Spectrum premium plans — premium articles, the complete digital magazine, premium research reports and exclusive editorial.",
};

export default async function Page() {
  const plans = await getPremiumPlans();

  return (
    <div className="pb-8">
      <PageHeader
        kicker="Premium Access"
        title="Choose Your Plan"
        description="Support independent journalism and unlock premium research reports, exclusive editorial and the complete digital magazine."
        breadcrumb={[{ label: "Premium" }]}
      />

      <div className="container-editorial py-10">
        <PlanGrid plans={plans} />

        {/* Note: display only */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-stone-400">
          Plans are shown for information. Online payments are not enabled yet — to
          arrange premium access or enquire, please contact our team.
        </p>

        {/* Value props */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Crown, title: "Premium Editorial", body: "In-depth premium articles and exclusive analysis across the ecosystem." },
            { icon: ShieldCheck, title: "Complete Magazine", body: "Full access to the digital magazine and the complete archive — read online." },
            { icon: Check, title: "Research Reports", body: "Premium research reports, publications and innovation deep-dives." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-stone-100 bg-white p-6 shadow-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Advertise */}
        <div id="advertise" className="mt-16 overflow-hidden rounded-2xl bg-navy p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-green">
              <Megaphone className="h-4 w-4" /> Advertise With Us
            </span>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
              Reach a professional audience of leaders, researchers and innovators
            </h2>
            <p className="mt-3 text-white/70">
              Trueline Spectrum offers clean, premium advertisement placements across
              the homepage, articles and the digital magazine. Get in touch to discuss
              a partnership.
            </p>
            <a href="mailto:truelinebiomed@gmail.com" className="btn-primary mt-6">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
