import { useEffect, useState } from "react";
import { nav, profile } from "../data/content";
import Logo from "./Logo";
import { useActiveSection } from "../lib/useActiveSection";
import { useHasMounted, useTheme } from "../lib/useTheme";

const ids = nav.map((n) => n.id);

export default function Nav() {
  const { theme, toggle } = useTheme();
  // The server cannot know the theme, so before mount the label stays neutral
  // and both icons ship, with CSS showing whichever one applies.
  const mounted = useHasMounted();
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)] ${
          scrolled
            ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="group flex min-w-0 items-center gap-2.5 py-1.5"
          >
            <Logo className="size-7 shrink-0 drop-shadow-[0_2px_6px_rgba(224,98,31,0.35)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-rotate-3" />
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="truncate font-mono text-sm font-medium tracking-tight">
                {profile.name}
              </span>
              <span className="hidden font-mono text-[11px] whitespace-nowrap text-ink-mute lg:inline">
                {profile.role.toLowerCase()}
              </span>
            </span>
          </a>

          <nav
            aria-label="Sections"
            className="hidden items-center gap-1 md:flex"
          >
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                  active === item.id
                    ? "bg-panel-2 text-ink"
                    : "text-ink-mute hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Résumé
            </a>
            <button
              type="button"
              onClick={toggle}
              aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Switch theme"}
              className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <SunIcon className="hidden dark:block" />
              <MoonIcon className="block dark:hidden" />
            </button>
          </div>
        </div>
      </header>

      {/* Phones get a persistent bottom bar instead of a hamburger: every section
          stays one tap away, with nothing to open, close or scroll-lock. */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/90 backdrop-blur-xl md:hidden"
      >
        <ul
          className="mx-auto grid max-w-md pb-[env(safe-area-inset-bottom)]"
          style={{
            gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))`,
          }}
        >
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`flex flex-col items-center gap-1.5 py-2.5 font-mono text-[11px] transition-colors ${
                  active === item.id ? "text-accent" : "text-ink-mute"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-5 rounded-full transition-colors ${
                    active === item.id ? "bg-accent" : "bg-transparent"
                  }`}
                />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
