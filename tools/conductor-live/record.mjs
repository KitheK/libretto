#!/usr/bin/env node
/**
 * Record real Conductor UI motion from the live embed (public/live/conductor).
 *
 *   npm run dev -- --port 5180         # in libretto
 *   node tools/conductor-live/record.mjs [greeting|think|review|theme|tour|shots]...
 *
 * Needs `playwright` resolvable (e.g. `npm i -D playwright && npx playwright install chromium`).
 * Writes raw .webm takes to tools/conductor-live/takes/ ; encode.sh turns them into
 * the GIF/webm/poster files in public/conductor/motion/.
 * A small dot is drawn where the scripted pointer moves (Playwright video has no cursor).
 */
import { chromium } from "playwright";
import { mkdirSync, renameSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const takes = resolve(here, "takes");
mkdirSync(takes, { recursive: true });
const ORIGIN = process.env.LIBRETTO_ORIGIN ?? "http://localhost:5180";
const SIZE = { width: 1280, height: 800 };

const CURSOR = `
  addEventListener('DOMContentLoaded', () => {
    const d = document.createElement('div');
    d.id = '__rec_cursor';
    Object.assign(d.style, { position: 'fixed', zIndex: 2147483647, width: '18px', height: '18px', margin: '-9px 0 0 -9px',
      borderRadius: '50%', background: 'rgba(16,61,255,.35)', border: '2px solid #103DFF', pointerEvents: 'none',
      left: '-40px', top: '-40px', transition: 'transform .12s' });
    document.body.appendChild(d);
    addEventListener('mousemove', e => { d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', () => d.style.transform = 'scale(.7)', true);
    addEventListener('mouseup', () => d.style.transform = 'scale(1)', true);
  });`;

async function open(browser, name, route, theme = "light") {
  const context = await browser.newContext({ viewport: SIZE, recordVideo: { dir: takes, size: SIZE }, colorScheme: theme });
  await context.addInitScript(CURSOR);
  const page = await context.newPage();
  page.on("pageerror", (e) => console.error(name, "pageerror", e.message));
  await page.goto(`${ORIGIN}/live/conductor/index.html?route=${route}&theme=${theme}`);
  return { context, page };
}

async function close(name, { context, page }) {
  const video = page.video();
  await context.close();
  const path = await video.path();
  renameSync(path, resolve(takes, `${name}.webm`));
  console.log("take", name);
}

async function glide(page, locator, steps = 22) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("no box for locator");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps });
  return box;
}
async function click(page, locator) {
  await glide(page, locator);
  await page.waitForTimeout(180);
  await locator.click();
}

const scenes = {
  // The AI Assistant empty state: DiaText reveal, then the word carousel.
  async greeting(browser) {
    const take = await open(browser, "greeting", "/ai-assistant");
    await take.page.mouse.move(1240, 760);
    await take.page.waitForTimeout(15000);
    await close("greeting", take);
  },

  // A read-only agent turn: request → "Agent is thinking" shimmer while tools run →
  // typed answer → expand "Used 3 tools" to show each tool and its status.
  async think(browser) {
    const take = await open(browser, "think", "/ai-assistant");
    const { page } = take;
    await page.mouse.move(900, 700);
    await page.waitForTimeout(3200);
    await click(page, page.locator("section[aria-labelledby=chat-context-title] button", { hasText: "COSC 360" }));
    await page.waitForTimeout(400);
    const box = page.getByLabel("Message Canvas AI");
    await click(page, box);
    await box.pressSequentially("Which COSC 360 assignments still need grading?", { delay: 30 });
    await page.waitForTimeout(300);
    await page.keyboard.press("Enter");
    const used = page.getByRole("button", { name: /Used \d+ tools?/ }).last();
    await used.waitFor({ timeout: 30000 });
    await page.waitForTimeout(3400);
    await click(page, used);
    await page.mouse.move(1210, 330, { steps: 14 });
    await page.waitForTimeout(3600);
    await close("think", take);
  },

  // A WRITE turn: thinking → human-in-the-loop review of a drafted announcement → approve.
  async review(browser) {
    const take = await open(browser, "review", "/ai-assistant");
    const { page } = take;
    await page.mouse.move(900, 700);
    await page.waitForTimeout(3200);
    await click(page, page.locator("section[aria-labelledby=chat-context-title] button", { hasText: "COSC 360" }));
    await page.waitForTimeout(400);
    const box = page.getByLabel("Message Canvas AI");
    await click(page, box);
    await box.pressSequentially("Move the COSC 360 midterm back one week and post an announcement to the class.", { delay: 26 });
    await page.waitForTimeout(300);
    await page.keyboard.press("Enter");
    const send = page.getByRole("button", { name: /Send Announcement/ });
    await send.waitFor({ timeout: 30000 });
    await page.waitForTimeout(2400);
    await click(page, send);
    await page.waitForTimeout(5000);
    await close("review", take);
  },

  // The real ThemeToggle on the dashboard, light → dark → light.
  async theme(browser) {
    const take = await open(browser, "theme", "/dashboard");
    const { page } = take;
    await page.mouse.move(700, 400);
    await page.waitForTimeout(3000);
    const toggle = page.locator("button.theme-toggle").first();
    await click(page, toggle);
    await page.waitForTimeout(2200);
    await page.mouse.move(800, 420, { steps: 15 });
    await page.waitForTimeout(600);
    await click(page, toggle);
    await page.waitForTimeout(2200);
    await close("theme", take);
  },

  // Navigation through the instructor rooms in the left rail.
  async tour(browser) {
    const take = await open(browser, "tour", "/dashboard");
    const { page } = take;
    await page.mouse.move(600, 400);
    await page.waitForTimeout(3000);
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Courses", "Grading Queue", "Action History", "AI Assistant", "Dashboard"]) {
      await click(page, nav.getByRole("button", { name: label, exact: true }));
      await page.waitForTimeout(label === "AI Assistant" ? 3200 : 2000);
    }
    await close("tour", take);
  },

  // Still screenshots of real pages with mock data, light and dark.
  async shots(browser) {
    const out = resolve(here, "../../public/conductor/live");
    mkdirSync(out, { recursive: true });
    const pages = [
      ["dashboard", "/dashboard"],
      ["courses", "/courses"],
      ["course", "/courses/3601"],
      ["assistant", "/ai-assistant"],
      ["grading-queue", "/grading-queue"],
      ["history", "/action-history"],
      ["settings", "/settings"],
    ];
    for (const theme of ["light", "dark"]) {
      for (const [name, route] of pages) {
        const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 1 });
        const page = await context.newPage();
        await page.goto(`${ORIGIN}/live/conductor/index.html?route=${route}&theme=${theme}`);
        await page.waitForTimeout(name === "assistant" ? 6500 : 3500);
        await page.screenshot({ path: resolve(out, `${name}-${theme}.png`) });
        await context.close();
        console.log("shot", name, theme);
      }
    }
  },
};

const wanted = process.argv.slice(2);
const browser = await chromium.launch();
for (const name of wanted.length ? wanted : Object.keys(scenes)) {
  await scenes[name](browser);
}
await browser.close();
