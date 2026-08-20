import { timeline } from "../data/content";
import { Reveal, Section } from "./primitives";

const kindLabel: Record<string, string> = {
  work: "Work",
  product: "Product",
  education: "Education",
};

export default function Path() {
  return (
    <Section
      id="path"
      index="03"
      title="Path"
      intro="From mechanical engineering to shipping software full time."
    >
      <ol className="relative border-l border-line pl-6 sm:pl-10">
        {timeline.map((item, i) => (
          <li key={item.title + item.org} className="relative pb-14 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full ring-4 ring-canvas sm:-left-[2.85rem] ${
                item.kind === "education" ? "bg-line" : "bg-accent"
              }`}
            />
            <Reveal delay={0.05 * i}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="label">{item.period}</p>
                <span className="label">· {kindLabel[item.kind]}</span>
              </div>
              <h3 className="mt-2 text-xl font-medium">
                {item.title}
                <span className="text-ink-mute"> · {item.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-mute">
                {item.detail}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
