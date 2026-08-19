import { useEffect } from "react";

/**
 * Loading a URL with a hash lands in the wrong place: the browser jumps to the
 * anchor during the first paint, and then the web fonts arrive and re-flow every
 * heading above it, so the target has already moved by the time you look at it.
 * Reload made it worse, because the browser also restores the previous pixel
 * offset on top of that.
 *
 * So: take scroll restoration off the browser when a hash is present, and re-run
 * the jump each time something that changes layout finishes loading.
 */
export function useHashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let cancelled = false;

    const land = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (!target) return;
      // Jump, never animate — this is a landing, not a navigation.
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView();
      root.style.scrollBehavior = previous;
    };

    land();
    document.fonts?.ready.then(land).catch(() => {});
    window.addEventListener("load", land);
    const settle = window.setTimeout(land, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(settle);
      window.removeEventListener("load", land);
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);
}
