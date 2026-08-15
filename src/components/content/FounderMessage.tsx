import { Facebook, Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

// Approved founder identity for the Trueline Spectrum About page.
const FOUNDER_NAME = "Dr. V. NAGARAJ";

const FOUNDER_MESSAGE = `M.E., M.B.A., Ph.D. from Anna University and Post Doctorate Fellowship from University of South Florida (USA). With over 13 years of experience in academic publishing, research, and innovation, I founded Trueline Spectrum in 2026 with a vision to create a trusted monthly platform that connects education, research, technology, industry, and innovation. Trueline Spectrum is committed to bringing forward meaningful ideas, emerging technologies, research developments, and the people shaping the future.

Our mission is to bridge the gap between knowledge and its real-world impact by highlighting researchers, educators, technologists, entrepreneurs, startups, institutions, and industry leaders. Through every monthly edition, we aim to showcase important developments, innovative ideas, research breakthroughs, technology trends, educational initiatives, and industry perspectives in a clear, credible, and accessible format.

Through Trueline Spectrum, we are building a connected knowledge ecosystem that encourages collaboration between academia, research, industry, startups, and innovators. We believe that meaningful stories can inspire new ideas, create partnerships, accelerate innovation, and contribute to a stronger future for society.`;

// Founder social / contact links, in the order they should appear.
const SOCIAL_LINKS: {
  label: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
}[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nagaraj-varatharaj/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nagaraj_varatharaj?igsh=NXR2N2JybDlicDR2",
    icon: Instagram,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/nagaraj.varatharaj.3",
    icon: Facebook,
    external: true,
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/message/7NHZKTMAKDIWJ1?autoload=1&app_absent=0",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Call Dr. V. NAGARAJ",
    href: "tel:+919578873584",
    icon: Phone,
    external: false,
  },
];

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function FounderMessage({ founder }: { founder: FounderData }) {
  const photo = founder.photo?.trim() || DEFAULT_PHOTO;
  const name = FOUNDER_NAME;
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
                alt={`${name}, Founder of Trueline Spectrum`}
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

            <p className="mt-4 text-lg font-semibold text-navy">
              {name}
              {title && <span className="text-stone-400"> — </span>}
              {title && <span className="font-medium text-stone-500">{title}</span>}
            </p>

            <div className="mt-6 space-y-5 text-[1.075rem] leading-relaxed text-stone-700">
              {paragraphs(FOUNDER_MESSAGE).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="rounded-md border border-navy/15 p-2.5 text-navy transition-colors hover:border-green hover:bg-green hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
