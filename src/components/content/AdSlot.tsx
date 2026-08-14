import { getAd } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * Advertisement placeholder. Renders an approved creative if one exists in the
 * CMS, otherwise a clean, clearly-labelled placeholder frame. No ad network is
 * connected in this release.
 */
export async function AdSlot({
  placement,
  className,
  label = "Advertisement",
}: {
  placement: string;
  className?: string;
  label?: string;
}) {
  const ad = await getAd(placement);

  if (ad?.html) {
    return (
      <div className={cn("overflow-hidden", className)} dangerouslySetInnerHTML={{ __html: ad.html }} />
    );
  }

  if (ad?.imageUrl) {
    const img = (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={ad.imageUrl} alt={ad.name} className="h-full w-full object-cover" />
    );
    return (
      <div className={cn("overflow-hidden rounded-md", className)}>
        {ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noreferrer sponsored">{img}</a>
        ) : (
          img
        )}
      </div>
    );
  }

  return (
    <div className={cn("ad-slot min-h-[90px]", className)}>{label}</div>
  );
}
