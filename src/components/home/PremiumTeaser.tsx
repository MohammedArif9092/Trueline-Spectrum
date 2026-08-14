import Link from "next/link";
import { getPremiumPlans } from "@/lib/queries";
import { PlanGrid } from "@/components/content/PlanGrid";

export async function PremiumTeaser() {
  const plans = await getPremiumPlans();
  if (plans.length === 0) return null;

  return (
    <section className="container-editorial mt-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <span className="kicker-label justify-center">Premium Access</span>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Choose Your Plan</h2>
        <p className="mt-3 text-stone-600">
          Support independent journalism and unlock premium research reports,
          exclusive editorial and the complete digital magazine.
        </p>
      </div>
      <PlanGrid plans={plans} />
      <p className="mt-6 text-center text-sm text-stone-400">
        <Link href="/premium" className="font-semibold text-green-600 hover:text-green-700">
          Compare all plans →
        </Link>
      </p>
    </section>
  );
}
