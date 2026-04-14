import fs from "node:fs/promises";
import path from "node:path";

import { projects } from "../src/data/projects";

const screenshotDir = path.resolve(process.cwd(), "public", "screenshots");

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

async function fetchWithTimeout(url: string, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 portfolio-screenshot-bot",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function createPlaceholder(outputPath: string, url: string) {
  const encoded = encodeURIComponent(`Screenshot unavailable\n${url}`);
  const placeholderUrl = `https://dummyimage.com/1440x900/000/fff.png&text=${encoded}`;
  const response = await fetchWithTimeout(placeholderUrl);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, bytes);
}

async function main() {
  await ensureDir();

  for (const project of projects) {
    const slug = slugify(project.url);
    const outputPath = path.join(screenshotDir, `${slug}.png`);

    try {
      console.log(`Capturing ${project.url}`);
      const response = await fetchWithTimeout(screenshotServiceUrl(project.url));

      if (!response.ok) {
        throw new Error(`Screenshot service returned ${response.status}`);
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(outputPath, bytes);
      console.log(`Saved ${outputPath}`);
    } catch (error) {
      console.error(`Failed ${project.url}`, error);
      await createPlaceholder(outputPath, project.url);
      console.log(`Created placeholder for ${project.url}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
