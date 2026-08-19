import { createReporter } from "./harness.mjs";

/**
 * The theme has two contracts that pull against each other: follow the system
 * until the visitor chooses, then never override their choice. Writing to
 * storage on mount silently broke the first one, so both are asserted.
 */
export default async function theme(browser, url) {
  const r = createReporter("theme");

  {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    r.ok("a passive visit stores nothing", (await page.evaluate(() => localStorage.getItem("theme"))) === null);

    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(400);
    r.ok("follows a live system switch", !(await isDark(page)));

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    r.ok("still follows the system after reload", !(await isDark(page)));

    await context.close();
  }

  {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: /Switch to light theme/ }).click();
    await page.waitForTimeout(300);
    r.ok("the toggle stores the choice", (await page.evaluate(() => localStorage.getItem("theme"))) === "light");

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    r.ok("the choice survives reload", !(await isDark(page)));

    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(400);
    r.ok("the choice outranks the system", !(await isDark(page)));

    await context.close();
  }

  // Without a reload in between: the system listener is attached before any
  // choice exists and stays attached afterwards, so it could still overwrite
  // the visitor's pick on a later switch. Two switches are needed to see it —
  // the second must move the system to the opposite of what is stored.
  {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: /Switch to light theme/ }).click();
    await page.waitForTimeout(300);

    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(400);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(400);

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    r.okQuiet(
      "the choice survives later system switches in the same session",
      !(await isDark(page)) && stored === "light",
      `stored ${stored}, rendering ${(await isDark(page)) ? "dark" : "light"}`,
    );

    await context.close();
  }

  return r;
}

const isDark = (page) => page.evaluate(() => document.documentElement.classList.contains("dark"));
