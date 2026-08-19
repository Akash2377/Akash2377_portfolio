import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { CaseStudy } from "../data/content";
import { caseStudies } from "../data/content";
import { ArrowLink, Pill, Reveal, Section } from "./primitives";

export default function Work() {
  return (
    <Section
      id="work"
      index="01"
      title="Selected work"
      intro="Two things worth reading in full: a product I ship alone, and the platform work I do every day."
    >
      <div className="flex flex-col gap-24 sm:gap-32">
        {caseStudies.map((study) => (
          <Study key={study.id} study={study} />
        ))}
      </div>
    </Section>
  );
}

function Study({ study }: { study: CaseStudy }) {
  return (
    <article className="border-t border-line pt-10 first:border-t-0 first:pt-0 sm:pt-12 sm:first:pt-0">
      {/* Masthead — identity, summary and the facts, before any deep detail. */}
      <header className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="flex items-center gap-3">
            {study.icon && (
              <img
                src={study.icon}
                alt=""
                width={44}
                height={44}
                className="size-10 shrink-0 rounded-xl sm:size-11"
              />
            )}
            <span className="label">{study.kicker}</span>
          </div>

          <h3 className="display mt-5 text-[clamp(2.25rem,7vw,3.75rem)]">
            {study.name}
          </h3>
          <p className="mt-3 text-lg text-ink-soft sm:text-xl">
            {study.tagline}
          </p>
          <p className="mt-2 font-mono text-xs text-ink-mute">{study.year}</p>

          <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">
            {study.summary}
          </p>

          {study.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {study.links.map((l) => (
                <ArrowLink key={l.href} href={l.href}>
                  {l.label}
                </ArrowLink>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4 lg:grid-cols-2">
            {study.metrics.map((m, mi) => (
              <div
                key={m.label}
                className={`bg-panel px-4 py-3.5 ${
                  mi === study.metrics.length - 1 &&
                  study.metrics.length % 2 === 1
                    ? "col-span-2 md:col-span-1 lg:col-span-2"
                    : ""
                }`}
              >
                <dt className="display text-2xl text-accent">{m.value}</dt>
                <dd className="mt-1 font-mono text-[11px] leading-snug text-ink-mute">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>

          <p className="mt-6 border-l-2 border-accent/50 pl-4 text-sm leading-relaxed text-ink-mute">
            {study.accentNote}
          </p>
        </Reveal>
      </header>

      {study.shots.length > 0 && (
        <div className="mt-12">
          <Gallery study={study} />
        </div>
      )}

      {/* Context — one paragraph on why the work existed at all. */}
      <Reveal>
        <div className="mt-12 grid gap-4 border-y border-line py-8 sm:mt-16 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,20rem)_1fr]">
          <h4 className="display text-2xl sm:text-3xl">
            {study.context.heading}
          </h4>
          <p className="max-w-2xl leading-relaxed text-ink-soft">
            {study.context.body}
          </p>
        </div>
      </Reveal>

      {/* Chapters — the actual work, one numbered block each. */}
      <ol className="mt-12 sm:mt-16">
        {study.chapters.map((c, i) => (
          <li
            key={c.title}
            className="border-b border-line-soft py-8 first:border-t first:pt-8"
          >
            <Reveal className="grid gap-4 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,20rem)_1fr]">
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="label shrink-0 pt-1.5 tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="display text-2xl leading-tight sm:text-[1.75rem]">
                  {c.title}
                </h4>
              </div>

              <div className="min-w-0">
                <p className="max-w-2xl leading-relaxed text-ink-soft">
                  {c.body}
                </p>
                {c.bullets && (
                  <ul className="mt-4 space-y-2">
                    {c.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-ink-mute"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.6rem] h-px w-2.5 shrink-0 bg-ink-mute"
                        />
                        <span className="min-w-0">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Details — everything that deserves a mention but not a chapter. */}
      <Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,20rem)_1fr]">
          <p className="label">Also shipped</p>
          <ul className="min-w-0 columns-1 gap-x-12 lg:columns-2">
            {study.details.map((d) => (
              <li
                key={d}
                className="mb-3 break-inside-avoid text-sm leading-relaxed text-ink-mute"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </article>
  );
}

function Gallery({ study }: { study: CaseStudy }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const shot = study.shots[i];

  return (
    <Reveal>
      <figure className="overflow-hidden rounded-2xl border border-line bg-panel-2">
        <div className="relative aspect-[4/3] sm:aspect-[2560/1640]">
          <AnimatePresence mode="wait" initial={false}>
            <m.img
              key={shot.src}
              src={shot.src}
              srcSet={shot.srcSet}
              // The figure spans the content column: full width on a phone,
              // capped at the 72rem container minus its padding above that.
              sizes="(min-width: 1216px) 1088px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
              width={2560}
              height={1640}
              alt={shot.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-left-top sm:object-top"
              initial={reduced ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>

        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line px-4 py-2.5">
          <span className="min-w-0 font-mono text-[11px] leading-relaxed text-ink-mute">
            {shot.alt}
          </span>
          <div className="flex shrink-0 gap-0.5">
            {study.shots.map((s, idx) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show screenshot ${idx + 1}: ${s.alt}`}
                aria-current={idx === i ? "true" : undefined}
                className="grid size-7 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    idx === i ? "w-5 bg-accent" : "w-1.5 bg-line"
                  }`}
                />
              </button>
            ))}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
