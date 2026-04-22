"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type PdfImageLightboxProps = {
  src: string;
  alt: string;
  sizes?: string;
};

export function PdfImageLightbox({ src, alt, sizes }: PdfImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const isPdf = src.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 block cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label={`Open ${alt} fullscreen`}
      >
        {isPdf ? (
          <span className="flex h-full w-full items-center justify-center bg-black text-center text-sm tracking-[0.2em] text-white/80">
            OPEN PDF PREVIEW
          </span>
        ) : (
          <Image src={src} alt={alt} fill className="bg-black object-contain object-top" sizes={sizes} />
        )}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 border border-white/70 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:right-8 md:top-8"
            aria-label="Close fullscreen image"
          >
            CLOSE
          </button>
          <div
            className="relative h-full w-full max-w-[1600px]"
            onClick={(event) => event.stopPropagation()}
          >
            {isPdf ? (
              <iframe
                src={src}
                title={alt}
                className="h-full w-full border-0 bg-black"
              />
            ) : (
              <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
