"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { resolveImage, FALLBACK_IMAGE, type ResolvedImage } from "@/lib/utils";

/**
 * Drop-in replacement for next/image for CMS-entered image URLs.
 *
 * - Accepts any valid direct http(s) image URL (not just allow-listed hosts).
 * - Converts Google Drive share links to a servable URL and rejects Google
 *   Images thumbnails (see `resolveImage`).
 * - Renders unknown hosts un-optimized so the optimizer's remotePatterns check
 *   can never 500 the page.
 * - If the image fails to load in the browser, it swaps to the local
 *   placeholder instead of showing a broken image.
 */
type SmartImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string | null | undefined;
  /** Placeholder used for missing/invalid/failed images. */
  fallbackSrc?: string;
};

export function SmartImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  ...rest
}: SmartImageProps) {
  const [resolved, setResolved] = useState<ResolvedImage>(() =>
    resolveImage(src, fallbackSrc)
  );

  return (
    <Image
      {...rest}
      alt={alt}
      src={resolved.src}
      unoptimized={resolved.unoptimized}
      onError={() => {
        // Only swap once, and never optimize the local placeholder.
        if (resolved.src !== fallbackSrc) {
          setResolved({ src: fallbackSrc, unoptimized: false });
        }
      }}
    />
  );
}
