"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
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
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

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

  useEffect(() => {
    if (!open) {
      setZoomed(false);
      setIsPanning(false);
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [open]);

  useEffect(() => {
    if (!zoomed) {
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [open, zoomed]);

  const onPanStart = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!zoomed) return;

    event.preventDefault();
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
    setIsPanning(true);
  };

  const onPanMove = (event: globalThis.MouseEvent) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragRef.current.moved = true;
    }
    setOffsetX(dragRef.current.startOffsetX + dx);
    setOffsetY(dragRef.current.startOffsetY + dy);
  };

  const onPanEnd = () => {
    dragRef.current.active = false;
    setIsPanning(false);
  };

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
  }, [isPanning]);

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
          {zoomed && !isPdf ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setZoomed(false);
                setOffsetX(0);
                setOffsetY(0);
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
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain transition-transform duration-150"
                    sizes={zoomed ? "170vw" : "100vw"}
                    style={{
                      transform: zoomed ? `translate(${offsetX}px, ${offsetY}px) scale(1.7)` : "translate(0px, 0px) scale(1)",
                      transformOrigin: "center center",
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
