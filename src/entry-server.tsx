import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Rendered at build time into dist/index.html so crawlers — and the AI agents
 * that do not execute JavaScript at all — receive the full page as HTML.
 * The client still mounts with createRoot and replaces this markup, so the two
 * do not need to match; this output only has to be readable.
 */
export function render() {
  return renderToString(<App />);
}
