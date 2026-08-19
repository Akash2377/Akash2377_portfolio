import { collectErrors, createReporter, settle } from "./harness.mjs";

const WIDTHS = [320, 360, 390, 414, 480, 640, 768, 834, 1024, 1180, 1280, 1440, 1920, 2560];

/**
 * Walks every breakpoint looking for the three failures that actually reach a
 * visitor: the page scrolling sideways, an element escaping the viewport, and
 * text clipped by its own box.
 */
export default async function responsive(browser, url) {
  const r = createReporter("responsive");

  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    const errors = collectErrors(page);
    await page.goto(url, { waitUntil: "networkidle" });
    await settle(page);

    const found = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const escapes = [];
      const clipped = [];

      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;

        // Anything inside an overflow-hidden ancestor is clipped by design.
        let ancestor = el.parentElement;
        let contained = false;
        while (ancestor && ancestor !== document.body) {
          const a = getComputedStyle(ancestor);
          if (a.overflow !== "visible" || a.overflowX !== "visible") {
            contained = true;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (contained) continue;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0) continue;
        if (rect.right > vw + 1 || rect.left < -1) {
          escapes.push(`${el.tagName}.${String(el.className).slice(0, 50)}`);
        }
      }

      // Visually-hidden text is clipped to 1x1 on purpose — that is the whole
      // technique, and the skip link uses it until it takes focus.
      const isScreenReaderOnly = (el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          (rect.width <= 1 && rect.height <= 1) ||
          cs.clipPath.includes("inset(50%)") ||
          cs.clip === "rect(0px, 0px, 0px, 0px)"
        );
      };

      for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,dt,dd,li,a")) {
        if (el.children.length) continue;
        if (isScreenReaderOnly(el)) continue;
        if (el.scrollWidth > el.clientWidth + 2) {
          clipped.push(`${el.tagName} "${(el.textContent || "").trim().slice(0, 30)}"`);
        }
      }

      return {
        overflowX: document.documentElement.scrollWidth - vw,
        escapes: [...new Set(escapes)].slice(0, 5),
        clipped: [...new Set(clipped)].slice(0, 5),
      };
    });

    r.okQuiet(`${width}px does not scroll sideways`, found.overflowX <= 0, `${found.overflowX}px`);
    r.okQuiet(`${width}px keeps every element in frame`, found.escapes.length === 0, found.escapes.join(" | "));
    r.okQuiet(`${width}px clips no text`, found.clipped.length === 0, found.clipped.join(" | "));
    r.okQuiet(`${width}px logs no errors`, errors.length === 0, errors.join(" | "));

    await context.close();
  }

  return r;
}
