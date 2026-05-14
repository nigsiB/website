"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";

type PdfImageLightboxProps = {
  src: string;
  alt: string;
  sizes?: string;
};

export function PdfImageLightbox({ src, alt, sizes }: PdfImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const isPdf = src.toLowerCase().endsWith(".pdf");
  const panLayerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const cancelPendingFrame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const applyTransform = useCallback((isZoomed = zoomed) => {
    if (!panLayerRef.current) return;
    panLayerRef.current.style.transform = isZoomed
      ? `translate3d(${offsetRef.current.x}px, ${offsetRef.current.y}px, 0) scale(1.7)`
      : "translate3d(0px, 0px, 0px) scale(1)";
  }, [zoomed]);

  const resetPanState = useCallback(() => {
    cancelPendingFrame();
    dragRef.current.active = false;
    dragRef.current.moved = false;
    offsetRef.current = { x: 0, y: 0 };
    setZoomed(false);
    setIsPanning(false);
    applyTransform(false);
  }, [applyTransform, cancelPendingFrame]);

  const closeLightbox = useCallback(() => {
    resetPanState();
    setOpen(false);
  }, [resetPanState]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, open]);

  useEffect(() => {
    if (!open || !zoomed) {
      offsetRef.current = { x: 0, y: 0 };
      applyTransform(false);
      return;
    }
    applyTransform(true);
  }, [applyTransform, open, zoomed]);

  const onPanStart = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!zoomed) return;

    event.preventDefault();
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offsetRef.current.x,
      startOffsetY: offsetRef.current.y,
    };
    setIsPanning(true);
  };

  const onPanMove = useCallback((event: globalThis.MouseEvent) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragRef.current.moved = true;
    }
    offsetRef.current = {
      x: dragRef.current.startOffsetX + dx,
      y: dragRef.current.startOffsetY + dy,
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        applyTransform(true);
        rafRef.current = null;
      });
    }
  }, [applyTransform]);

  const onPanEnd = useCallback(() => {
    dragRef.current.active = false;
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (!isPanning) return;

    const handleMove = (event: globalThis.MouseEvent) => onPanMove(event);
    const handleEnd = () => onPanEnd();
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isPanning, onPanEnd, onPanMove]);

  useEffect(() => cancelPendingFrame, [cancelPendingFrame]);

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
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-20 border border-white/70 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:right-8 md:top-8"
            aria-label="Close fullscreen image"
          >
            CLOSE
          </button>
          {zoomed && !isPdf ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                resetPanState();
              }}
              className="absolute left-4 top-4 z-20 border border-white/70 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black md:left-8 md:top-8"
              aria-label="Zoom out image"
            >
              ZOOM OUT
            </button>
          ) : null}
          <div
            className="relative h-[90vh] w-[95vw] max-w-[1600px]"
            onClick={(event) => event.stopPropagation()}
          >
            {isPdf ? (
              <iframe
                src={src}
                title={alt}
                className="h-full w-full border-0 bg-black"
              />
            ) : (
              <div className="h-full w-full overflow-hidden bg-black">
                <button
                  type="button"
                  onClick={() => {
                    if (!zoomed) setZoomed(true);
                  }}
                  onMouseDown={onPanStart}
                  className={`relative block h-full w-full select-none ${zoomed ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
                  aria-label={zoomed ? "Pan zoomed image" : "Zoom in image"}
                >
                  <div ref={panLayerRef} className="relative h-full w-full will-change-transform" style={{ transformOrigin: "center center" }}>
                    <Image src={src} alt={alt} fill className="object-contain" sizes={zoomed ? "170vw" : "100vw"} />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
