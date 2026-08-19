import { principles, profile, toolkit } from "../data/content";
import { Reveal, Section } from "./primitives";

export default function About() {
  return (
    <Section
      id="about"
      index="02"
      title="About"
      intro="Mechanical engineering degree, a MERN bootcamp, then four years shipping product software."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <blockquote className="mt-10 border-l-2 border-accent pl-5">
            <p className="display text-2xl leading-snug sm:text-3xl">
              The interesting part of a feature is never the happy path — it is
              what the interface does while it waits, fails, or gets resized.
            </p>
          </blockquote>

          <div className="mt-12">
            <p className="label">How I work</p>
            <dl className="mt-5 space-y-6">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="border-t border-line-soft pt-4"
                >
                  <dt className="font-medium">{item.title}</dt>
                  <dd className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-mute">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="label">Toolkit</p>
            <div className="mt-5 space-y-px overflow-hidden rounded-xl border border-line bg-line">
              {toolkit.map((group) => (
                <div key={group.group} className="bg-panel p-5">
                  <p className="label">{group.group}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-sm text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
