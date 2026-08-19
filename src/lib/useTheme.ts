import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const KEY = "theme";

const systemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const read = (): Theme => {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

/** False during prerender and on the very first client render. */
export const useHasMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

const storedChoice = (): Theme | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
};

/**
 * Theme is the OS preference until the visitor picks one, and their pick after
 * that.
 *
 * Writing to localStorage on mount looked harmless and was not: simply loading
 * the page stored whatever the OS happened to be, so a visitor who later
 * switched their system to light stayed on dark forever, with no way back
 * except the toggle. Only `toggle` persists, and while nothing is stored the
 * page keeps following the system.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // Re-checked on every event, not just at mount: the listener is attached
    // before any choice exists and stays attached after one is made, so gating
    // it only at mount let a later system switch overwrite the visitor's pick.
    const onChange = () => {
      if (storedChoice()) return;
      setTheme(systemTheme());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* private mode — the choice lasts for this page view only */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
