import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

/**
 * Official Trueline Spectrum logo lockup on a transparent background.
 * `onDark` renders the lockup as a clean white knockout (via CSS filter) so it
 * reads against navy backgrounds (footer / admin) without any white plate box.
 */
export function Logo({
  className = "",
  onDark = false,
  priority = false,
}: {
  className?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={SITE.logo}
        alt={`${SITE.name} — ${SITE.tagline}`}
        width={2000}
        height={853}
        priority={priority}
        className={`h-full w-auto object-contain ${
          onDark ? "[filter:brightness(0)_invert(1)]" : ""
        }`}
      />
    </Link>
  );
}
