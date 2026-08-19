/**
 * The mark: a squircle in the accent colour with the A cut into it.
 *
 * The geometry and every gradient stop here are duplicated verbatim in
 * public/favicon.svg — they must stay identical, so change both or neither.
 * Everything is paths and gradients, no filters and no font, so the browser
 * tab, the header and the Open Graph card all render the same shape.
 *
 * Depth without filters: a diagonal fill for the body, a white gradient over
 * the top for the rim light, and a second copy of the A offset one unit down
 * in white behind the real one, which reads as a lit bottom edge on a cut.
 */

/** Superellipse (n = 5), sampled at 64 points — Apple-style continuous corners. */
const SQUIRCLE =
  "M63.3 32.0 L63.2 44.4 L63.1 48.3 L62.8 51.1 L62.3 53.3 L61.8 55.2 L61.1 56.7 L60.2 58.1 L59.2 59.2 L58.1 60.2 L56.7 61.1 L55.2 61.8 L53.3 62.3 L51.1 62.8 L48.3 63.1 L44.4 63.2 L32.0 63.3 L19.6 63.2 L15.7 63.1 L12.9 62.8 L10.7 62.3 L8.8 61.8 L7.3 61.1 L5.9 60.2 L4.8 59.2 L3.8 58.1 L2.9 56.7 L2.2 55.2 L1.7 53.3 L1.2 51.1 L0.9 48.3 L0.8 44.4 L0.7 32.0 L0.8 19.6 L0.9 15.7 L1.2 12.9 L1.7 10.7 L2.2 8.8 L2.9 7.3 L3.8 5.9 L4.8 4.8 L5.9 3.8 L7.3 2.9 L8.8 2.2 L10.7 1.7 L12.9 1.2 L15.7 0.9 L19.6 0.8 L32.0 0.7 L44.4 0.8 L48.3 0.9 L51.1 1.2 L53.3 1.7 L55.2 2.2 L56.7 2.9 L58.1 3.8 L59.2 4.8 L60.2 5.9 L61.1 7.3 L61.8 8.8 L62.3 10.7 L62.8 12.9 L63.1 15.7 L63.2 19.6 L63.3 32.0Z";

const LETTER =
  "M32 13 L51.5 49 L40.5 49 L37.2 42.2 L26.8 42.2 L23.5 49 L12.5 49 Z M28.6 35.4 L35.4 35.4 L32 24 Z";

export default function Logo({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="logo-body" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#ffa268" />
          <stop offset="48%" stopColor="#f5813f" />
          <stop offset="100%" stopColor="#e0621f" />
        </linearGradient>
        <linearGradient id="logo-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="logo-cut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0d0f" />
          <stop offset="100%" stopColor="#26262b" />
        </linearGradient>
      </defs>

      <path d={SQUIRCLE} fill="url(#logo-body)" />
      <path d={SQUIRCLE} fill="url(#logo-rim)" />
      <path
        d={SQUIRCLE}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.2"
        strokeWidth="0.9"
      />

      <path
        d={LETTER}
        fillRule="evenodd"
        fill="#fff"
        opacity="0.32"
        transform="translate(0 1)"
      />
      <path d={LETTER} fillRule="evenodd" fill="url(#logo-cut)" />
    </svg>
  );
}
