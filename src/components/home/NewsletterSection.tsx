import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="container-editorial mt-16">
      <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-12 sm:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-green text-white">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">Stay Updated</h2>
          <p className="mt-2 text-stone-600">
            Subscribe to receive the latest technology, research, education and
            industry insights — delivered to your inbox.
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <NewsletterForm source="homepage" />
          </div>
        </div>
      </div>
    </section>
  );
}
