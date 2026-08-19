import { collectErrors, createReporter, settle } from "./harness.mjs";

/** Everything a visitor can actually do, on a phone and on a desktop. */
export default async function interactions(browser, url) {
  const r = createReporter("interactions");

  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "dark",
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors = collectErrors(page);
    await page.goto(url, { waitUntil: "networkidle" });

    const bar = page.locator("nav.fixed.bottom-0");
    r.ok("phones get the bottom bar", await bar.isVisible());

    await bar.getByRole("link", { name: "Contact" }).tap();
    await page
      .waitForFunction(
        () => Math.abs(document.getElementById("contact").getBoundingClientRect().top) < 130,
        null,
        { timeout: 8000 },
      )
      .catch(() => {});
    r.ok(
      "the bottom bar navigates",
      await page.evaluate(
        () => Math.abs(document.getElementById("contact").getBoundingClientRect().top) < 130,
      ),
    );
    r.ok("the bar survives navigation", await bar.isVisible());

    await page.waitForTimeout(600);
    r.ok(
      "the active tab tracks the section",
      (await page.evaluate(
        () => document.querySelector('nav.fixed.bottom-0 a[aria-current="true"]')?.textContent.trim(),
      )) === "Contact",
    );

    // The footer's padding runs under the translucent bar by design; what must
    // never happen is footer *content* ending up behind it.
    const behind = await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((res) => setTimeout(res, 500));
      const barTop = document.querySelector("nav.fixed.bottom-0").getBoundingClientRect().top;
      return [...document.querySelectorAll("footer a, footer p, footer li")].filter(
        (el) => el.getBoundingClientRect().bottom > barTop + 1,
      ).length;
    });
    r.okQuiet("no footer content sits behind the bar", behind === 0, `${behind} overlapped`);
    r.okQuiet("phone: no runtime errors", errors.length === 0, errors.join(" | "));

    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    const errors = collectErrors(page);
    await page.goto(url, { waitUntil: "networkidle" });

    r.ok("desktop hides the bottom bar", !(await page.locator("nav.fixed.bottom-0").isVisible()));

    await page.locator("#work figure").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const before = await page.locator("#work figure img").first().getAttribute("src");
    await page.getByRole("button", { name: /Show screenshot 4/ }).click();
    await page.waitForTimeout(700);
    const after = await page.locator("#work figure img").first().getAttribute("src");
    r.ok("the gallery changes screenshot", before !== after);

    await page.locator("#path").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    r.ok(
      "the header nav marks the visible section",
      (await page.evaluate(
        () => document.querySelector('header nav a[aria-current="true"]')?.textContent,
      )) === "Path",
    );

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.keyboard.press("Tab");
    const skip = await page.evaluate(() => {
      const el = document.activeElement;
      const rect = el.getBoundingClientRect();
      return { text: el.textContent.trim(), w: Math.round(rect.width), h: Math.round(rect.height) };
    });
    r.okQuiet(
      "the skip link is first and visible on focus",
      skip.text === "Skip to content" && skip.w > 60 && skip.h > 24,
      JSON.stringify(skip),
    );

    r.ok(
      "nothing interactive is out of the tab order",
      (await page.evaluate(
        () =>
          [...document.querySelectorAll("a[href],button")].filter(
            (el) => el.offsetParent !== null && el.tabIndex < 0,
          ).length,
      )) === 0,
    );

    const mailto = await page.locator('#contact a[href^="mailto:"]').first().getAttribute("href");
    r.ok("the enquiry mailto is prefilled", mailto.includes("subject=") && mailto.includes("body="));
    r.okQuiet("desktop: no runtime errors", errors.length === 0, errors.join(" | "));

    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await settle(page, 600);
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("#work *, #contact *")].filter(
          (el) => getComputedStyle(el).opacity === "0",
        ).length,
    );
    r.okQuiet("reduced motion still shows everything", hidden === 0, `${hidden} transparent`);
    await context.close();
  }

  // LazyMotion only loads the feature bundle it is given: if whileInView is not
  // in it, reveals silently never fire and the page below the fold stays blank.
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const beforeScroll = await page.evaluate(
      () => getComputedStyle(document.querySelector("#faq dl > *")).opacity,
    );
    r.okQuiet("below-fold content starts hidden", beforeScroll === "0", `opacity ${beforeScroll}`);

    await page.locator("#faq").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);
    const afterScroll = await page.evaluate(
      () => getComputedStyle(document.querySelector("#faq dl > *")).opacity,
    );
    r.okQuiet("scrolling reveals it", afterScroll === "1", `opacity ${afterScroll}`);

    await context.close();
  }

  return r;
}
