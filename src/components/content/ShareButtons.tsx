"use client";

import { useState } from "react";
import { Linkedin, Link2, Check, Share2 } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ShareButtons({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE.url}${path}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  }

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-stone-400">Share</span>
      <a href={linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"
         className="rounded-md border border-stone-200 p-2 text-navy hover:border-green hover:text-green-600">
        <Linkedin className="h-4 w-4" />
      </a>
      <a href={x} target="_blank" rel="noreferrer" aria-label="Share on X"
         className="rounded-md border border-stone-200 p-2 text-navy hover:border-green hover:text-green-600">
        <span className="block h-4 w-4 text-center text-sm font-bold leading-4">𝕏</span>
      </a>
      <button onClick={nativeShare} aria-label="Share" className="rounded-md border border-stone-200 p-2 text-navy hover:border-green hover:text-green-600 sm:hidden">
        <Share2 className="h-4 w-4" />
      </button>
      <button onClick={copy} aria-label="Copy link"
              className="rounded-md border border-stone-200 p-2 text-navy hover:border-green hover:text-green-600">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
