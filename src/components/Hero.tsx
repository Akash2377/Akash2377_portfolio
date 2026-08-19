import { m, useReducedMotion } from "motion/react";
import { profile, socials } from "../data/content";
import HeroMark from "./HeroMark";

const rise = {
  hidden: { y: 20 },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.05 + i * 0.07,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Hero() {
  const reduced = useReducedMotion();
  // The hero is already in the prerendered HTML, so the client must not fade it
  // back in: the browser paints the headline, React mounts and hides it again,
  // and Largest Contentful Paint lands on the re-reveal instead of the first
  // paint — 1.5s instead of 0.2s. Transform-only keeps the motion without ever
  // taking the text off the screen. Below the fold, Reveal still fades, because
  // there is nothing to re-hide there.
  const isServer = typeof window === "undefined";

  const anim = (i: number) =>
    reduced || isServer
      ? {}
      : {
          variants: rise,
          custom: i,
          initial: "hidden" as const,
          animate: "show" as const,
        };

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="rule-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 65%)",
        }}
      />
      {/* Generative ridgeline behind the type. Sits under the content layer and
          is dialled back so the headline keeps its contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 bottom-0 opacity-45 sm:top-10 sm:opacity-55"
      >
        <HeroMark />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div>
          <div className="min-w-0">
            <m.p
              {...anim(0)}
              className="flex items-center gap-2.5 font-mono text-xs text-ink-mute"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              {profile.status}
            </m.p>

            <m.h1
              {...anim(1)}
              className="display mt-8 text-[clamp(2.9rem,10vw,7.5rem)]"
            >
              Akash Surve
            </m.h1>

            <m.p
              {...anim(2)}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl"
            >
              {profile.lede}
            </m.p>

            <m.div
              {...anim(3)}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
              >
                See the work
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                >
                  <path
                    d="M8 3v10M4 9l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-block border-b border-line py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                Available for freelance
              </a>
            </m.div>
          </div>
        </div>

        <m.div
          {...anim(4)}
          className="mt-16 grid gap-10 border-t border-line pt-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-14"
        >
          <div>
            <p className="text-sm font-medium">{profile.role}</p>
            <p className="font-mono text-xs text-ink-mute">
              {profile.location}
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-mute sm:justify-end">
            {Object.entries(socials).map(([key, href]) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block py-1.5 transition-colors hover:text-accent"
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </m.div>
      </div>
    </section>
  );
}
