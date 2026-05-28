"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  }>({
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const applyTransform = useCallback((shouldZoom: boolean) => {
    if (!panLayerRef.current) return;
    panLayerRef.current.style.transform = shouldZoom
      ? `translate3d(${offsetRef.current.x}px, ${offsetRef.current.y}px, 0) scale(1.7)`
      : "translate3d(0px, 0px, 0px) scale(1)";
  }, []);

  const cancelPendingTransform = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopPanning = useCallback(() => {
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsPanning(false);
  }, []);

  const resetZoom = useCallback(() => {
    cancelPendingTransform();
    stopPanning();
    offsetRef.current = { x: 0, y: 0 };
    setZoomed(false);
    applyTransform(false);
  }, [applyTransform, cancelPendingTransform, stopPanning]);

  const closeLightbox = useCallback(() => {
    setOpen(false);
    resetZoom();
  }, [resetZoom]);

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
    if (!zoomed) {
      cancelPendingTransform();
      offsetRef.current = { x: 0, y: 0 };
    }
    applyTransform(open && zoomed);
  }, [applyTransform, cancelPendingTransform, open, zoomed]);

  const onPanStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!zoomed) return;
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offsetRef.current.x,
      startOffsetY: offsetRef.current.y,
    };
    setIsPanning(true);
  };

  const onPanMove = useCallback((event: globalThis.PointerEvent) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== event.pointerId) return;

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

  const onPanEnd = useCallback((event: globalThis.PointerEvent) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    stopPanning();
  }, [stopPanning]);

  useEffect(() => {
    if (!isPanning) return;

    const handleMove = (event: globalThis.PointerEvent) => onPanMove(event);
    const handleEnd = (event: globalThis.PointerEvent) => onPanEnd(event);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [isPanning, onPanEnd, onPanMove]);

  useEffect(
    () => () => {
      cancelPendingTransform();
    },
    [cancelPendingTransform]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetZoom();
          setOpen(true);
        }}
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
                resetZoom();
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
                  onPointerDown={onPanStart}
                  className={`relative block h-full w-full touch-none select-none ${zoomed ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
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
