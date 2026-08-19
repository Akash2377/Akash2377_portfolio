import { profile, socials, toolkit } from "../data/content";

const ticker = toolkit.flatMap((g) => g.items);

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t border-line ${className}`}>
      <div className="marquee overflow-hidden border-b border-line py-4">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
          {[0, 1].map((pass) => (
            <ul key={pass} aria-hidden={pass === 1} className="flex gap-8">
              {ticker.map((item) => (
                <li key={item} className="font-mono text-xs text-ink-mute">
                  {item} <span className="text-accent">·</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-mono text-xs text-ink-mute">
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
          <p className="mt-1 font-mono text-[11px] text-ink-mute">
            Built with React, Vite and Tailwind. Typeset in Instrument Serif and
            Inter.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {Object.entries(socials).map(([key, href]) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-1.5 text-ink-mute transition-colors hover:text-accent"
              >
                {key}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
