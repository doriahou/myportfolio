"use client";

import { useState } from "react";
import Image from "next/image";

export default function MasonryGrid({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
        {images.map((src, i) => (
          <div
            key={i}
            className="mb-2 break-inside-avoid cursor-zoom-in overflow-hidden rounded-lg"
            onClick={() => setLightbox(i)}
          >
            <Image
              src={src}
              alt=""
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition-opacity duration-300 hover:opacity-90"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          {lightbox > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox]}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="max-h-[90vh] w-auto"
              priority
            />
          </div>

          {lightbox < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          <button
            className="absolute right-4 top-4 p-3 text-white/60 hover:text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/40">
            {lightbox + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
