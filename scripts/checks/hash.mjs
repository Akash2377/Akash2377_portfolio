import { createReporter } from "./harness.mjs";

/**
 * Landing on a deep link used to miss: the browser jumps during first paint,
 * then the web fonts re-flow every heading above the target, and a reload also
 * restores the old pixel offset on top. Both paths are asserted because only
 * the reload one regressed.
 */
export default async function hash(browser, url) {
  const r = createReporter("deep links");

  // Discovered rather than listed: a hardcoded array silently stopped covering
  // the newest section the moment one was added.
  const discovery = await browser.newContext();
  const scout = await discovery.newPage();
  await scout.goto(url, { waitUntil: "domcontentloaded" });
  const sections = await scout.evaluate(() =>
    [...document.querySelectorAll("main section[id]")].map((s) => s.id).filter((id) => id !== "top"),
  );
  await discovery.close();

  r.okQuiet("every section was discovered", sections.length >= 5, `found ${sections.length}`);

  for (const [width, height, label] of [
    [390, 844, "phone"],
    [1440, 900, "desktop"],
  ]) {
    for (const id of sections) {
      const context = await browser.newContext({
        viewport: { width, height },
        colorScheme: "dark",
      });
      const page = await context.newPage();

      await page.goto(`${url}#${id}`, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      const onLoad = await topOf(page, id);

      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(1500);
      const onReload = await topOf(page, id);

      // 96px is scroll-margin-top clearing the fixed header.
      const landed = (v) => Math.abs(v - 96) < 24;
      r.okQuiet(
        `${label} #${id} lands, and lands again on reload`,
        landed(onLoad) && landed(onReload),
        `load ${onLoad}px, reload ${onReload}px`,
      );

      await context.close();
    }
  }

  return r;
}

const topOf = (page, id) =>
  page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
