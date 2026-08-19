import { createReporter } from "./harness.mjs";

const BUDGET = { fcp: 400, lcp: 800, requests: 12, transferKB: 700 };

/**
 * Budgets, not benchmarks. Two regressions this catches have already happened:
 * a render-blocking third-party stylesheet, and the hero fading itself back in
 * over prerendered HTML, which moved LCP from 0.2s to 1.5s while every other
 * check stayed green.
 */
export default async function perf(browser, url) {
  const r = createReporter("performance");

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  const hosts = new Set();
  page.on("request", (req) => {
    try {
      hosts.add(new URL(req.url()).host);
    } catch {
      /* data: and blob: URLs have no host */
    }
  });

  await page.goto(url, { waitUntil: "load" });

  const metrics = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = {};
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) out.lcp = Math.round(entry.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // Observed rather than sampled: reading the entry up front races the
        // paint, and on a fast local build it was sometimes not recorded yet,
        // which surfaced as a null FCP long after the page had painted.
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") out.fcp = Math.round(entry.startTime);
          }
        }).observe({ type: "paint", buffered: true });

        setTimeout(() => {
          const resources = performance.getEntriesByType("resource");
          out.requests = resources.length;
          out.transferKB = Math.round(
            resources.reduce((sum, res) => sum + (res.transferSize || 0), 0) / 1024,
          );
          out.blocking = resources
            .filter((res) => res.renderBlockingStatus === "blocking")
            .map((res) => res.name.split("/").pop());
          resolve(out);
        }, 2500);
      }),
  );

  const origin = new URL(url).host;
  const thirdParty = [...hosts].filter((h) => h !== origin);

  r.okQuiet("no third-party requests", thirdParty.length === 0, thirdParty.join(", "));
  // A budget that passes on a missing metric is worse than no budget: null and
  // undefined both compare true against a number.
  const within = (value, budget) => typeof value === "number" && value <= budget;

  r.okQuiet(
    "render-blocking resources were reported",
    Array.isArray(metrics.blocking) && metrics.blocking.length > 0,
    "renderBlockingStatus unsupported — the next assertion is vacuous",
  );
  r.okQuiet(
    "only same-origin CSS blocks render",
    metrics.blocking.every((b) => b.endsWith(".css")),
    metrics.blocking.join(", "),
  );
  r.okQuiet(`first contentful paint under ${BUDGET.fcp}ms`, within(metrics.fcp, BUDGET.fcp), `${metrics.fcp}ms`);
  r.okQuiet(`largest contentful paint under ${BUDGET.lcp}ms`, within(metrics.lcp, BUDGET.lcp), `${metrics.lcp}ms`);
  r.okQuiet(`under ${BUDGET.requests} requests`, within(metrics.requests, BUDGET.requests), `${metrics.requests}`);
  r.okQuiet(`under ${BUDGET.transferKB}kB transferred`, within(metrics.transferKB, BUDGET.transferKB), `${metrics.transferKB}kB`);

  await context.close();
  return r;
}
