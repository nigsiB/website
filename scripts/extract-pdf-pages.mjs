import fs from "node:fs/promises";
import path from "node:path";

import { createCanvas } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const workspaceRoot = process.cwd();
const pdfPath = path.join(workspaceRoot, "pdf_portfolio_1920x1080_04_150dpi.pdf");
const outputDir = path.join(workspaceRoot, "public", "portfolio-pdf");

// Selected pages that visually represent About + Work sections.
const selectedPages = [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16];

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
  }
}

// 150dpi render scale relative to PDF default 72dpi.
const PDF_RENDER_SCALE = 150 / 72;

// The source PDF carries a personal contact line - name, phone, email - in the
// bottom-left of every content page. These pages are published on the site, so
// the block is painted out at render time. Fractions of the page, not pixels,
// so a change of render scale does not move the target.
const CONTACT_BLOCK = { x: 105 / 4000, y: 2143 / 2250, width: 1010 / 4000, height: 50 / 2250 };
const WHITE_THRESHOLD = 245;

function isBandBlank(context, x, y, width, height) {
  if (y < 0 || height <= 0) return false;
  const { data } = context.getImageData(x, y, width, height);
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (luminance < WHITE_THRESHOLD) return false;
  }
  return true;
}

/**
 * Paint out the contact block, but only where it genuinely sits on the white
 * footer strip. The cover page has full-bleed artwork in that position and no
 * contact line, so it must not be touched - hence checking the margins above
 * and below rather than hardcoding which pages to skip.
 */
function redactContactBlock(context, pageWidth, pageHeight) {
  const x = Math.round(CONTACT_BLOCK.x * pageWidth);
  const y = Math.round(CONTACT_BLOCK.y * pageHeight);
  const width = Math.round(CONTACT_BLOCK.width * pageWidth);
  const height = Math.round(CONTACT_BLOCK.height * pageHeight);
  const margin = Math.max(4, Math.round((12 / 2250) * pageHeight));

  const clearAbove = isBandBlank(context, x, y - margin - 2, width, margin);
  const clearBelow = isBandBlank(context, x, y + height + 2, width, margin);
  if (!clearAbove || !clearBelow) return false;

  context.fillStyle = "#ffffff";
  context.fillRect(x, y, width, height);
  return true;
}

async function renderPage(pdf, pageNumber, scale = PDF_RENDER_SCALE) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvasFactory = new NodeCanvasFactory();
  const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
    canvasFactory,
  }).promise;

  const redacted = redactContactBlock(context, viewport.width, viewport.height);

  return { buffer: canvas.toBuffer("image/jpeg", 92), redacted };
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const loadingTask = pdfjsLib.getDocument(pdfPath);
  const pdf = await loadingTask.promise;

  for (const pageNumber of selectedPages) {
    const { buffer, redacted } = await renderPage(pdf, pageNumber);
    const target = path.join(outputDir, `page-${String(pageNumber).padStart(2, "0")}.jpg`);
    await fs.writeFile(target, buffer);
    console.log(`Wrote ${target}${redacted ? " (contact block removed)" : " (no contact block found)"}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
