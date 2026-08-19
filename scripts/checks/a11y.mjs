import AxeBuilder from "@axe-core/playwright";
import { createReporter, settle } from "./harness.mjs";

/** axe-core against WCAG 2.1 AA, in both themes — contrast bugs only show in one. */
export default async function a11y(browser, url) {
  const r = createReporter("accessibility");

  for (const scheme of ["dark", "light"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: scheme,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await settle(page, 600);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    r.okQuiet(
      `${scheme}: WCAG 2.1 AA`,
      violations.length === 0,
      violations.map((v) => `${v.id} (${v.nodes.length})`).join(", "),
    );

    await context.close();
  }

  return r;
}
