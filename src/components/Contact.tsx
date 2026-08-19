import { contact, profile, services, socials } from "../data/content";
import { Reveal } from "./primitives";

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
  contact.mailtoSubject,
)}&body=${encodeURIComponent(contact.mailtoBody)}`;

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-line py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <span className="label">06 — Contact</span>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className="flex items-center gap-2.5 font-mono text-xs text-ink-mute">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              {contact.availability}
            </p>

            <h2 className="display mt-5 text-[clamp(2.5rem,8vw,5rem)]">
              {contact.heading}
            </h2>

            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
              {contact.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={mailto}
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-sm font-medium text-canvas transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
              >
                Start a project
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-line px-5 py-3 font-mono text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {profile.email}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-1 text-sm text-ink-mute transition-colors hover:text-accent"
              >
                LinkedIn
              </a>
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-1 text-sm text-ink-mute transition-colors hover:text-accent"
              >
                GitHub
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-1 text-sm text-ink-mute transition-colors hover:text-accent"
              >
                Résumé (PDF)
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 lg:col-span-6">
            <p className="label">What I take on</p>
            <ul className="mt-4 space-y-px overflow-hidden rounded-xl border border-line bg-line">
              {services.map((s) => (
                <li key={s.title} className="bg-panel p-5">
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                    {s.body}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink-mute">
              Based in {profile.location}, working with teams in any timezone.
              Fixed-scope projects or ongoing hours — whichever fits what you're
              building.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
