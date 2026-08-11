"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { workSectionAccents, workSectionOrder, workSections, type WorkSectionKey } from "@/data/workSections";

type Position = {
  row: number;
  col: number;
};

type Axis = "x" | "y";

const HELP_KEY = "portfolio-grid-prototype-help-dismissed-v1";

export function PortfolioGridPrototype() {
  const [position, setPosition] = useState<Position>({ row: 0, col: 0 });
  const [mapMode, setMapMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lastMove, setLastMove] = useState<"x" | "y" | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPointerPanning, setIsPointerPanning] = useState(false);
  const [lockedPanAxis, setLockedPanAxis] = useState<Axis | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const rows = useMemo(() => workSectionOrder.map((key) => workSections[key]), []);
  const columns = useMemo(() => {
    const seen = new Set<string>();
    const orderedTitles: string[] = [];

    rows.forEach((row) => {
      row.items.forEach((item) => {
        if (!seen.has(item.title)) {
          seen.add(item.title);
          orderedTitles.push(item.title);
        }
      });
    });

    return orderedTitles;
  }, [rows]);

  const grid = useMemo(
    () =>
      rows.map((row) =>
        columns.map((title) => {
          const matched = row.items.find((item) => item.title === title);
          return matched ?? null;
        }),
      ),
    [rows, columns],
  );

  const nearestFilledCol = (rowIndex: number, preferredCol: number) => {
    const rowCells = grid[rowIndex];
    if (!rowCells) {
      return preferredCol;
    }
    if (rowCells[preferredCol]) {
      return preferredCol;
    }

    for (let distance = 1; distance < columns.length; distance += 1) {
      const left = preferredCol - distance;
      const right = preferredCol + distance;
      if (left >= 0 && rowCells[left]) {
        return left;
      }
      if (right < columns.length && rowCells[right]) {
        return right;
      }
    }

    return preferredCol;
  };

  const activeRow = rows[position.row];
  const activeItem = grid[position.row]?.[position.col];
  const dragIntentThreshold = 14;
  const dragStepThreshold = 90;
  const cameraZoom = mapMode ? 0.42 : isNavigating || isPointerPanning ? 0.8 : 1;

  useEffect(() => {
    const shouldShowHelp = !window.localStorage.getItem(HELP_KEY);
    if (!shouldShowHelp) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowHelp(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const getStepCountFromDelta = (delta: number) => {
    const absDelta = Math.abs(delta);
    if (absDelta < dragStepThreshold) {
      return 0;
    }
    return Math.max(1, Math.round(absDelta / 230));
  };

  const moveByAxisSteps = (axis: Axis, delta: number) => {
    const stepCount = getStepCountFromDelta(delta);
    if (stepCount === 0) {
      return;
    }

    const direction = delta > 0 ? -1 : 1;
    const deltaSteps = direction * stepCount;

    setPosition((current) => {
      if (axis === "x") {
        const unclamped = current.col + deltaSteps;
        const clamped = Math.max(0, Math.min(columns.length - 1, unclamped));
        return { ...current, col: nearestFilledCol(current.row, clamped) };
      }

      const unclampedRow = current.row + deltaSteps;
      const clampedRow = Math.max(0, Math.min(rows.length - 1, unclampedRow));
      return { row: clampedRow, col: nearestFilledCol(clampedRow, current.col) };
    });

    setLastMove(axis);
    enterHoverFlight();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || showHelp) {
      return;
    }

    const interactiveTarget = (event.target as HTMLElement).closest("button, a");
    if (interactiveTarget) {
      return;
    }

    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    setPanOffset({ x: 0, y: 0 });
    setLockedPanAxis(null);
    setIsPointerPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!isPointerPanning || !pointerStartRef.current) {
      return;
    }

    const rawX = event.clientX - pointerStartRef.current.x;
    const rawY = event.clientY - pointerStartRef.current.y;

    let axis = lockedPanAxis;
    if (!axis && (Math.abs(rawX) > dragIntentThreshold || Math.abs(rawY) > dragIntentThreshold)) {
      axis = Math.abs(rawX) >= Math.abs(rawY) ? "x" : "y";
      setLockedPanAxis(axis);
    }

    if (axis === "x") {
      setPanOffset({ x: rawX, y: 0 });
      return;
    }
    if (axis === "y") {
      setPanOffset({ x: 0, y: rawY });
      return;
    }

    setPanOffset({ x: rawX, y: rawY });
  };

  const endPointerPan = () => {
    if (!isPointerPanning) {
      return;
    }

    const finalAxis = lockedPanAxis;
    const finalOffset = panOffset;

    setIsPointerPanning(false);
    setPanOffset({ x: 0, y: 0 });
    setLockedPanAxis(null);
    pointerStartRef.current = null;

    if (!finalAxis) {
      return;
    }

    if (finalAxis === "x") {
      moveByAxisSteps("x", finalOffset.x);
      return;
    }

    moveByAxisSteps("y", finalOffset.y);
  };

  const enterHoverFlight = () => {
    setIsNavigating(true);
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      settleTimerRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const tagName = (event.target as HTMLElement | null)?.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
      }

      if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        enterHoverFlight();
        setMapMode((prev) => !prev);
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        setShowHelp(true);
        return;
      }

      setPosition((current) => {
        const currentRow = rows[current.row];
        const currentItem = currentRow.items[current.col];

        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
          event.preventDefault();
          setLastMove("x");
          enterHoverFlight();
          const targetCol = Math.max(0, current.col - 1);
          return { ...current, col: nearestFilledCol(current.row, targetCol) };
        }

        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
          event.preventDefault();
          setLastMove("x");
          enterHoverFlight();
          const targetCol = Math.min(columns.length - 1, current.col + 1);
          return { ...current, col: nearestFilledCol(current.row, targetCol) };
        }

        if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
          event.preventDefault();
          setLastMove("y");
          enterHoverFlight();
          const nextRow = Math.max(0, current.row - 1);
          const nextCol = nearestFilledCol(nextRow, current.col);
          return { row: nextRow, col: nextCol };
        }

        if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
          event.preventDefault();
          setLastMove("y");
          enterHoverFlight();
          const nextRow = Math.min(rows.length - 1, current.row + 1);
          const nextCol = nearestFilledCol(nextRow, current.col);
          return { row: nextRow, col: nextCol };
        }

        return current;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rows, columns.length, grid]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const dismissHelp = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HELP_KEY, "1");
    }
    setShowHelp(false);
  };

  return (
    <main className="relative min-h-[calc(100vh-152px)] overflow-hidden bg-black">
      <section className="pointer-events-none absolute top-0 right-0 left-0 z-20 p-6 md:p-10">
        <div className="mx-auto flex w-full max-w-[1700px] items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.35em] text-white/60">GRID PROTOTYPE / EXPERIMENT</p>
            <h1 className="mt-3 text-3xl md:text-5xl">{activeItem?.title ?? columns[position.col]}</h1>
            <p className="mt-3 text-xs tracking-[0.24em] text-white/80">
              {activeRow.title.toUpperCase()} / CLIENT COLUMN {position.col + 1} OF {columns.length}
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/75">
              {activeItem?.summary ?? "No project in this discipline/client intersection."}
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMapMode((prev) => !prev)}
              className="border border-white/40 px-3 py-2 text-[10px] tracking-[0.24em] text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              {mapMode ? "FOCUS VIEW (M)" : "MAP VIEW (M)"}
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="border border-white/40 px-3 py-2 text-[10px] tracking-[0.24em] text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              HELP (?)
            </button>
            <Link
              href="/work"
              className="border border-white/40 px-3 py-2 text-[10px] tracking-[0.24em] text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              EXIT
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="Portfolio grid viewport"
        className="relative h-[calc(100vh-152px)] overflow-hidden [--card-h:clamp(260px,52vh,560px)] [--card-w:min(62vw,820px)] [--gap:clamp(20px,4vw,56px)]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerPan}
        onPointerCancel={endPointerPan}
        style={{ cursor: isPointerPanning ? "grabbing" : "grab" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0,rgba(0,0,0,0.7)_55%,rgba(0,0,0,1)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div
          className="absolute top-0 left-0 origin-top-left transition-transform ease-[cubic-bezier(.16,.84,.24,1)]"
          style={{
            transitionDuration: isPointerPanning ? "0ms" : "1300ms",
            transform: `translate3d(calc(50vw - (${cameraZoom} * var(--card-w) / 2) - ${position.col * cameraZoom} * (var(--card-w) + var(--gap)) + ${panOffset.x}px), calc(50vh - 76px - (${cameraZoom} * var(--card-h) / 2) - ${position.row * cameraZoom} * (var(--card-h) + var(--gap)) + ${panOffset.y}px), 0px) scale(${cameraZoom})`,
          }}
        >
          {rows.map((row, rowIndex) =>
            columns.map((columnTitle, colIndex) => {
              const item = grid[rowIndex][colIndex];
              const isActive = rowIndex === position.row && colIndex === position.col;
              const sectionKey = row.key as WorkSectionKey;

              return (
                <article
                  key={`${row.key}-${columnTitle}-${colIndex}`}
                  className="group absolute overflow-hidden border border-white/25 bg-black/80 transition-[transform,opacity,box-shadow] duration-[850ms] ease-[cubic-bezier(.2,.78,.2,1)]"
                  style={{
                    width: "var(--card-w)",
                    height: "var(--card-h)",
                    left: `calc(${colIndex} * (var(--card-w) + var(--gap)))`,
                    top: `calc(${rowIndex} * (var(--card-h) + var(--gap)))`,
                    transform: isActive
                      ? "scale(1)"
                      : mapMode
                        ? "scale(0.95)"
                        : "scale(0.88)",
                    boxShadow: isActive
                      ? `0 0 0 2px ${workSectionAccents[sectionKey]}, 0 20px 60px rgba(0, 0, 0, 0.5)`
                      : "0 10px 40px rgba(0, 0, 0, 0.45)",
                    opacity: mapMode || isNavigating ? (item ? 0.95 : 0.4) : isActive ? 1 : item ? 0.66 : 0.2,
                    transitionDuration: isPointerPanning ? "0ms" : "1200ms",
                  }}
                >
                  <div className="absolute inset-0">
                    {item ? (
                      <>
                        <Image
                          src={item.imagePath}
                          alt={`${item.title} project image`}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.02]"
                          sizes="(max-width: 1200px) 90vw, 1100px"
                          priority={isActive}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0_14px,transparent_14px_28px)]" />
                    )}
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 p-5 md:p-8">
                    <div className="h-[4px] w-28" style={{ backgroundColor: workSectionAccents[sectionKey] }} />
                    <p className="mt-3 text-[10px] tracking-[0.26em] text-white/75">{row.title.toUpperCase()}</p>
                    <h2 className="mt-2 text-2xl md:text-4xl">{item?.title ?? columnTitle}</h2>
                    <p className="mt-2 max-w-[80ch] text-xs leading-relaxed text-white/80">
                      {item?.disciplines ?? "No matching project in this discipline."}
                    </p>
                  </div>
                </article>
              );
            }),
          )}
        </div>
      </section>

      <section className="pointer-events-none absolute right-5 bottom-5 left-5 z-20 flex justify-center">
        <div className="rounded-sm border border-white/20 bg-black/75 px-4 py-2 text-center text-[10px] tracking-[0.22em] text-white/70">
          USE ARROWS / WASD OR CLICK + HOLD DRAG TO PAN &nbsp; - &nbsp; TAP M FOR MAP VIEW &nbsp; - &nbsp; CAMERA MODE:{" "}
          {mapMode ? "SITE MAP" : isNavigating ? "TOP-DOWN NAV" : "TOP-DOWN FOCUS"} &nbsp; - &nbsp; MOVEMENT AXIS:{" "}
          {isPointerPanning
            ? lockedPanAxis === "x"
              ? "LOCKED HORIZONTAL"
              : lockedPanAxis === "y"
                ? "LOCKED VERTICAL"
                : "DETECTING"
            : lastMove === "x"
              ? "HORIZONTAL"
              : lastMove === "y"
                ? "VERTICAL"
                : "NOT SET"}
        </div>
      </section>

      {showHelp ? (
        <section className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-2xl border border-white/35 bg-black p-6 md:p-8">
            <p className="text-[10px] tracking-[0.32em] text-white/70">HOW THIS WORKS</p>
            <h2 className="mt-3 text-3xl">Navigate The Portfolio Grid</h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
              <p>- Rows represent disciplines.</p>
              <p>- Columns represent clients/projects aligned across the full matrix.</p>
              <p>- Camera is birds-eye (straight down) with smooth animated pan/zoom transitions.</p>
              <p>- Mouse: click and hold, drag to pan. Drag direction axis-locks, and release snaps by row or column.</p>
              <p>- Press M to zoom out to map view, then M again to return to focused view.</p>
            </div>
            <div className="mt-5 border border-white/25 p-4 text-xs leading-relaxed text-white/70">
              DISCIPLINES ARE ROWS: BRANDING / WEB + INTERACTIVE / PRINT + PACKAGING / EXHIBITION
              <br />
              PROJECTS ARE COLUMNS: MOVE SIDEWAYS TO EXPLORE A ROW
            </div>
            <button
              type="button"
              onClick={dismissHelp}
              className="mt-6 border border-white px-4 py-2 text-xs tracking-[0.22em] transition hover:bg-white hover:text-black"
            >
              START EXPLORING
            </button>
          </div>
        </section>
      ) : null}

      <div className="sr-only" aria-live="polite">
        Active project {activeItem?.title ?? columns[position.col]} in {activeRow.title}
      </div>
    </main>
  );
}
