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

async function renderPage(pdf, pageNumber, scale = 1.2) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvasFactory = new NodeCanvasFactory();
  const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
    canvasFactory,
  }).promise;

  return canvas.toBuffer("image/jpeg", 85);
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const loadingTask = pdfjsLib.getDocument(pdfPath);
  const pdf = await loadingTask.promise;

  for (const pageNumber of selectedPages) {
    const image = await renderPage(pdf, pageNumber);
    const target = path.join(outputDir, `page-${String(pageNumber).padStart(2, "0")}.jpg`);
    await fs.writeFile(target, image);
    console.log(`Wrote ${target}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
