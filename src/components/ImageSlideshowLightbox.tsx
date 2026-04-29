"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type ImageSlideshowLightboxProps = {
  images: string[];
  alt: string;
  sizes?: string;
};

export function ImageSlideshowLightbox({ images, alt, sizes }: ImageSlideshowLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const total = images.length;
  const activeImage = images[index] ?? images[0];

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, open]);

  if (!activeImage) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label={`Open ${alt} slideshow fullscreen`}
      >
        <Image src={activeImage} alt={alt} fill className="bg-black object-contain object-top" sizes={sizes} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} slideshow`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 border border-white/70 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:right-8 md:top-8"
            aria-label="Close fullscreen slideshow"
          >
            CLOSE
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 border border-white/70 bg-black/55 px-3 py-2 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:left-8"
                aria-label="Previous slide"
              >
                PREV
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 border border-white/70 bg-black/55 px-3 py-2 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:right-8"
                aria-label="Next slide"
              >
                NEXT
              </button>
            </>
          ) : null}

          <div className="relative h-[90vh] w-[95vw] max-w-[1700px]" onClick={(event) => event.stopPropagation()}>
            <Image src={activeImage} alt={`${alt} slide ${index + 1}`} fill className="object-contain" sizes="100vw" priority />
            {total > 1 ? (
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 border border-white/35 bg-black/60 px-3 py-1 text-[10px] tracking-[0.2em] text-white/90">
                {index + 1} / {total}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
