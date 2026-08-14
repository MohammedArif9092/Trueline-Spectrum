"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, List, LayoutGrid, ZoomIn, ZoomOut,
  Maximize2, Minimize2, X, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Page = {
  pageNumber: number;
  title: string | null;
  image: string | null;
  body: string | null;
};

export function MagazineReader({
  title, theme, month, year, archiveHref, editionHref, initialPage, pages,
}: {
  title: string;
  theme: string | null;
  month: string;
  year: number;
  archiveHref: string;
  editionHref: string;
  initialPage: number;
  pages: Page[];
}) {
  const total = pages.length;
  const [current, setCurrent] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [showToc, setShowToc] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const page = pages[current - 1];
  const progress = Math.round((current / total) * 100);

  const goTo = useCallback(
    (n: number) => {
      setCurrent(Math.min(Math.max(1, n), total));
      setZoom(1);
    },
    [total]
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") {
        setShowToc(false);
        setShowThumbs(false);
      } else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(3, z + 0.25));
      else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.25));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Fullscreen state sync
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* fullscreen may be blocked; reader still works */
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] flex flex-col bg-navy text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-navy px-3 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={archiveHref} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Archive</span>
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{theme || title}</p>
            <p className="text-[11px] text-white/50">{month} {year} · Digital Edition</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ToolButton label="Contents" active={showToc} onClick={() => { setShowToc((v) => !v); setShowThumbs(false); }}>
            <List className="h-4 w-4" />
          </ToolButton>
          <ToolButton label="Thumbnails" active={showThumbs} onClick={() => { setShowThumbs((v) => !v); setShowToc(false); }}>
            <LayoutGrid className="h-4 w-4" />
          </ToolButton>
          <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
          <ToolButton label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.25))} disabled={zoom <= 1}>
            <ZoomOut className="h-4 w-4" />
          </ToolButton>
          <span className="hidden w-10 text-center text-xs text-white/60 sm:block">{Math.round(zoom * 100)}%</span>
          <ToolButton label="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} disabled={zoom >= 3}>
            <ZoomIn className="h-4 w-4" />
          </ToolButton>
          <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
          <ToolButton label="Fullscreen" onClick={toggleFullscreen}>
            {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </ToolButton>
        </div>
      </header>

      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        {/* TOC panel */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-white/10 bg-navy-600 transition-transform duration-300",
            showToc ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-green">Contents</h2>
            <button onClick={() => setShowToc(false)} aria-label="Close" className="rounded p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ol className="py-2">
            {pages.map((p) => (
              <li key={p.pageNumber}>
                <button
                  onClick={() => { goTo(p.pageNumber); setShowToc(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-white/10",
                    current === p.pageNumber ? "text-green" : "text-white/80"
                  )}
                >
                  <span className="w-6 font-serif font-bold text-green/80">
                    {p.pageNumber < 10 ? `0${p.pageNumber}` : p.pageNumber}
                  </span>
                  <span className="truncate">{p.title || `Page ${p.pageNumber}`}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* Page viewport */}
        <div className="flex h-full items-center justify-center overflow-auto p-4 sm:p-8">
          <div
            className="relative shadow-2xl transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          >
            {page?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.image}
                alt={page.title || `Page ${current}`}
                className="max-h-[calc(100vh-180px)] w-auto max-w-full rounded-sm bg-white object-contain"
                draggable={false}
              />
            ) : (
              <div className="flex h-[70vh] w-[52vh] flex-col items-center justify-center rounded-sm bg-white p-8 text-center text-navy">
                <h3 className="font-serif text-2xl font-bold">{page?.title || `Page ${current}`}</h3>
                {page?.body && <p className="mt-4 max-w-md text-sm text-stone-600">{page.body}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          disabled={current <= 1}
          aria-label="Previous page"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-green disabled:pointer-events-none disabled:opacity-30 sm:left-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          disabled={current >= total}
          aria-label="Next page"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-green disabled:pointer-events-none disabled:opacity-30 sm:right-4"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnails strip */}
      {showThumbs && (
        <div className="border-t border-white/10 bg-navy-600 px-4 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {pages.map((p) => (
              <button
                key={p.pageNumber}
                onClick={() => goTo(p.pageNumber)}
                className={cn(
                  "group relative aspect-[3/4] h-24 shrink-0 overflow-hidden rounded border-2 bg-white/5",
                  current === p.pageNumber ? "border-green" : "border-transparent hover:border-white/40"
                )}
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={`Page ${p.pageNumber}`} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-white/60">{p.pageNumber}</span>
                )}
                <span className="absolute bottom-0 inset-x-0 bg-navy/80 py-0.5 text-center text-[10px] text-white">
                  {p.pageNumber}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar: progress + page indicator */}
      <footer className="border-t border-white/10 bg-navy px-4 py-2.5">
        <div className="flex items-center gap-4">
          <span className="shrink-0 text-xs text-white/60">
            Page <span className="font-semibold text-white">{current}</span> / {total}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-green transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="shrink-0 text-xs text-white/60">{progress}%</span>
          <Link href={editionHref} className="hidden shrink-0 text-xs font-semibold text-green hover:text-white sm:inline">
            Edition details →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ToolButton({
  children, label, onClick, active, disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md p-2 transition-colors disabled:opacity-30",
        active ? "bg-green text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
