import { engagement, evidence } from "../data/content";
import { ArrowLink, Reveal, Section } from "./primitives";

export default function Process() {
  return (
    <Section
      id="process"
      index="04"
      title="Working together"
      intro="What an engagement looks like from your side, and the public trail behind the claims above."
    >
      <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
        {engagement.map((item, i) => (
          <li key={item.step} className="bg-panel">
            <Reveal delay={0.04 * (i % 2)} className="h-full p-5 sm:p-6">
              <p className="label">{item.step}</p>
              <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12">
          <p className="label">Check the work</p>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {evidence.map((item) => (
              <li key={item.label}>
                <ArrowLink href={item.href}>{item.label}</ArrowLink>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
