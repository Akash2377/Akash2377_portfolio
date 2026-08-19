import { build } from "vite";
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "dist");
const ssrDir = path.join(root, ".ssr");

// Build a server bundle of the same app, render it, and inline the result.
await build({
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ".ssr",
    emptyOutDir: true,
    copyPublicDir: false,
  },
});

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const html = render();

const indexPath = path.join(outDir, "index.html");
const shell = await readFile(indexPath, "utf8");

if (!shell.includes('<div id="root">')) {
  throw new Error("prerender: could not find the root container in dist/index.html");
}

await writeFile(indexPath, shell.replace('<div id="root">', `<div id="root">${html}`), "utf8");
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: inlined ${(html.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
