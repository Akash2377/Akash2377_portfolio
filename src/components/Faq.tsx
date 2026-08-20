import { faqs } from "../data/site";
import { Reveal, Section } from "./primitives";

export default function Faq() {
  return (
    <Section
      id="faq"
      index="05"
      title="Freelance FAQ"
      intro="What people ask before the first email: availability, scope, rates, timezones."
    >
      <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
        {faqs.map((item, i) => (
          <Reveal
            key={item.q}
            delay={0.04 * (i % 2)}
            className="h-full bg-panel p-5 sm:p-6"
          >
            <dt className="text-lg font-medium">{item.q}</dt>
            <dd className="mt-2.5 text-sm leading-relaxed text-ink-mute">
              {item.a}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
