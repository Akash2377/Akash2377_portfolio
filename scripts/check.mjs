/**
 * Runs the browser check suite against a production build.
 *
 * Every one of these exists because something actually broke: the reveal
 * animations prerendering at opacity:0, the mobile menu losing its anchor jump,
 * eight tap targets under 24px, an invalid <dl>, and the theme freezing on a
 * passive visit. They run against `dist`, not the dev server, so what is
 * measured is what ships.
 *
 * Usage: npm run check          (builds first)
 *        npm run check -- --url http://localhost:5173   (existing server)
 */
import { chromium } from "playwright";
import { preview } from "vite";
import responsive from "./checks/responsive.mjs";
import a11y from "./checks/a11y.mjs";
import interactions from "./checks/interactions.mjs";
import hash from "./checks/hash.mjs";
import theme from "./checks/theme.mjs";
import perf from "./checks/perf.mjs";

const SUITES = [responsive, a11y, interactions, hash, theme, perf];

const urlArg = process.argv.indexOf("--url");
const externalUrl = urlArg > -1 ? process.argv[urlArg + 1] : null;

let server;
let url = externalUrl;

if (!url) {
  server = await preview({ preview: { port: 4390, strictPort: false }, logLevel: "error" });
  url = server.resolvedUrls.local[0].replace(/\/$/, "");
}

const browser = await chromium.launch();
const reports = [];

try {
  for (const suite of SUITES) {
    process.stdout.write(`\n\x1b[1m${suite.name}\x1b[0m\n`);
    const report = await suite(browser, url);
    reports.push(report);
    for (const { label, passed, detail } of report.results) {
      if (passed) {
        process.stdout.write(`  \x1b[32m✓\x1b[0m ${label}\n`);
      } else {
        process.stdout.write(`  \x1b[31m✗\x1b[0m ${label}${detail ? ` — ${detail}` : ""}\n`);
      }
    }
  }
} finally {
  await browser.close();
  await server?.close();
}

const all = reports.flatMap((r) => r.results);
const failed = all.filter((r) => !r.passed);

process.stdout.write(
  `\n${failed.length ? "\x1b[31m" : "\x1b[32m"}${all.length - failed.length}/${all.length} checks passed\x1b[0m\n`,
);

if (failed.length) {
  for (const f of failed) process.stdout.write(`  ✗ ${f.label}${f.detail ? ` — ${f.detail}` : ""}\n`);
  process.exit(1);
}
