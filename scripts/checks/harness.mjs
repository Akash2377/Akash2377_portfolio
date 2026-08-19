/** Shared helpers for the check suite: assertions, and scrolling a page so that
 *  every whileInView reveal has fired before anything is measured. */

export function createReporter(name) {
  const results = [];
  return {
    name,
    results,
    ok: (label, passed, detail = "") => results.push({ label, passed, detail }),
    /** Passing `detail` only when it fails keeps clean output quiet. */
    okQuiet: (label, passed, detail = "") =>
      results.push({ label, passed, detail: passed ? "" : detail }),
  };
}

/** Reveals only animate in when scrolled past, so nothing is measurable until
 *  the whole page has been walked. */
export async function settle(page, step = 500) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
}

export function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 160));
  });
  return errors;
}
