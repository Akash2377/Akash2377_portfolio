import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  // On the server the hidden initial state must not be emitted: prerendered
  // HTML with opacity:0 reads as hidden text to a crawler. The client mounts
  // with createRoot and re-renders, so it still animates.
  const isServer = typeof window === "undefined";

  return (
    <m.div
      className={className}
      initial={reduced || isServer ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-line/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-4">
              <span className="label pt-1">{index}</span>
              <h2 className="display text-4xl sm:text-5xl">{title}</h2>
            </div>
            {intro && (
              <p className="max-w-md text-sm leading-relaxed text-ink-mute md:text-right">
                {intro}
              </p>
            )}
          </div>
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[11px] tracking-wide text-ink-soft">
      {children}
    </span>
  );
}

export function ArrowLink({
  href,
  children,
  external = true,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group inline-flex items-center gap-1.5 border-b border-line py-1 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-3 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <path
          d="M4 12L12 4M12 4H6M12 4v6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
