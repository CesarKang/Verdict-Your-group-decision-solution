/**
 * Record ACT 3 demo (~85s) with Playwright.
 * Usage: npm run record:demo
 * Output: video-output/act3-demo.webm
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL =
  process.env.DEMO_URL ??
  "http://127.0.0.1:5173/?demo=video&autoplay=1";
const DURATION_MS = 90_000;

const OUT_FILE = "video-output/act3-demo.webm";

await mkdir("video-output", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(process.platform === "darwin"
    ? { channel: "chrome" }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 430, height: 920 },
  deviceScaleFactor: 2,
  recordVideo: {
    dir: "video-output",
    size: { width: 430, height: 920 },
  },
});

const page = await context.newPage();
console.log(`Recording ${URL} for ${DURATION_MS / 1000}s...`);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(DURATION_MS);

const video = page.video();
await context.close();
await browser.close();

if (video) {
  const tempPath = await video.path();
  const { copyFile, rename } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const dest = `${root}/${OUT_FILE}`;
  try {
    await rename(tempPath, dest);
  } catch {
    await copyFile(tempPath, dest);
  }
  console.log(`Saved: ${dest}`);
  console.log("Convert to MP4: ffmpeg -i video-output/act3-demo.webm -c:v libx264 -crf 18 video-output/act3-demo.mp4");
}
