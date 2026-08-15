import { Linkedin, Mail } from "lucide-react";
import { SmartImage } from "@/components/content/SmartImage";

export type FounderData = {
  name?: string | null;
  title?: string | null;
  message?: string | null;
  photo?: string | null;
  linkedin?: string | null;
  email?: string | null;
};

const DEFAULT_PHOTO = "/founder/founder.jpg";

// Safe, non-biographical placeholder shown until the message is set in the CMS.
const DEFAULT_MESSAGE = `Trueline Spectrum was founded on a simple conviction: that the work of researchers, educators, technologists and entrepreneurs deserves to be told with clarity, rigour and respect.

We built this monthly edition to connect the people and institutions shaping education, research, technology, industry and innovation — and to make their ideas accessible to a wider community.

Every issue is an invitation to look closely at how knowledge moves from the laboratory to the world, and to imagine what we can build together.`;

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function FounderMessage({ founder }: { founder: FounderData }) {
  const photo = founder.photo?.trim() || DEFAULT_PHOTO;
  const message = founder.message?.trim() || DEFAULT_MESSAGE;
  const name = founder.name?.trim();
  const title = founder.title?.trim();

  return (
    <section className="bg-stone-50/60">
      <div className="container-editorial py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          {/* Photo */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 shadow-lift">
              <SmartImage
                src={photo}
                fallbackSrc={DEFAULT_PHOTO}
                alt={name ? `${name}, Founder of Trueline Spectrum` : "Founder of Trueline Spectrum"}
                fill
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-600">
              <span className="h-px w-8 bg-green" aria-hidden />
              Leadership
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Founder Message
            </h2>

            {(name || title) && (
              <p className="mt-4 text-lg font-semibold text-navy">
                {name}
                {name && title && <span className="text-stone-400"> — </span>}
                {title && <span className="font-medium text-stone-500">{title}</span>}
              </p>
            )}

            <div className="mt-6 space-y-5 text-[1.075rem] leading-relaxed text-stone-700">
              {paragraphs(message).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {(founder.linkedin || founder.email) && (
              <div className="mt-8 flex items-center gap-3">
                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name ? `${name} on LinkedIn` : "Founder on LinkedIn"}
                    className="rounded-md border border-navy/15 p-2.5 text-navy transition-colors hover:border-green hover:bg-green hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {founder.email && (
                  <a
                    href={`mailto:${founder.email}`}
                    aria-label={name ? `Email ${name}` : "Email the founder"}
                    className="rounded-md border border-navy/15 p-2.5 text-navy transition-colors hover:border-green hover:bg-green hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
