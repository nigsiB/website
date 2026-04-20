import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { chromium } from "@playwright/test";

import { projects } from "../src/data/projects";

const screenshotDir = path.resolve(process.cwd(), "public", "screenshots");
const execFileAsync = promisify(execFile);
const provider = process.env.SCREENSHOT_PROVIDER ?? "auto";
const screenshotDelayMs = Number.parseInt(process.env.SCREENSHOT_DELAY_MS ?? "5000", 10);

const slugify = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

async function ensureDir() {
  await fs.mkdir(screenshotDir, { recursive: true });
}

function screenshotServiceUrl(targetUrl: string) {
  return `https://image.thum.io/get/width/1440/crop/900/noanimate/${targetUrl}`;
}

function placeholderUrl(targetUrl: string) {
  const encoded = encodeURIComponent(`Screenshot unavailable\n${targetUrl}`);
  return `https://dummyimage.com/1440x900/000/fff.png?text=${encoded}`;
}

async function downloadWithCurl(url: string, outputPath: string, timeoutSeconds: number) {
  await execFileAsync("curl", ["-fL", "--max-time", `${timeoutSeconds}`, url, "-o", outputPath]);
}

async function runPlaywrightCapture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  for (const project of projects) {
    const slug = slugify(project.url);
    const outputPath = path.join(screenshotDir, `${slug}.png`);
    const page = await context.newPage();

    try {
      console.log(`Playwright capturing ${project.url}`);
      await page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      // Allow page transitions/entrance animations to complete before capture.
      await page.waitForTimeout(Number.isFinite(screenshotDelayMs) ? screenshotDelayMs : 5000);
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`Saved ${outputPath}`);
    } catch (error) {
      console.error(`Playwright failed ${project.url}`, error);
      await downloadWithCurl(placeholderUrl(project.url), outputPath, 15);
      console.log(`Created placeholder for ${project.url}`);
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();
}

async function runServiceCapture() {
  for (const project of projects) {
    const slug = slugify(project.url);
    const outputPath = path.join(screenshotDir, `${slug}.png`);

    try {
      console.log(`Service capturing ${project.url}`);
      await downloadWithCurl(screenshotServiceUrl(project.url), outputPath, 35);
      console.log(`Saved ${outputPath}`);
    } catch (error) {
      console.error(`Service failed ${project.url}`, error);
      try {
        await downloadWithCurl(placeholderUrl(project.url), outputPath, 15);
        console.log(`Created placeholder for ${project.url}`);
      } catch (placeholderError) {
        console.error(`Failed placeholder for ${project.url}`, placeholderError);
      }
    }
  }
}

async function main() {
  await ensureDir();
  if (provider === "playwright") {
    await runPlaywrightCapture();
    return;
  }

  if (provider === "service") {
    await runServiceCapture();
    return;
  }

  try {
    console.log("Auto mode: trying Playwright first.");
    await runPlaywrightCapture();
  } catch (error) {
    console.warn("Playwright unavailable; falling back to screenshot service.", error);
    await runServiceCapture();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
