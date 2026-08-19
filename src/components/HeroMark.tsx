import { m, useReducedMotion } from "motion/react";

const W = 1200;
const H = 620;
const ROWS = 34;
const STEP = 8;

/** Deterministic hash so the composition is identical on every render/build. */
const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/** Value noise: smoothly interpolated hash, one octave. */
const noise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const a = hash(i + seed * 57.31);
  const b = hash(i + 1 + seed * 57.31);
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
};

/**
 * A ridgeline field: contour lines built from value noise under a gaussian
 * envelope, each filled with the page colour so it occludes the line behind it.
 * It sits behind the hero type, so the peaks are weighted to the right of the
 * headline and the whole field is masked down at the edges.
 */
const rows = Array.from({ length: ROWS }, (_, r) => {
  const baseline = 70 + r * ((H - 130) / (ROWS - 1));
  const rowGain = 0.4 + Math.sin((r / (ROWS - 1)) * Math.PI) * 0.9;
  const peak = W * 0.62;

  let d = "";
  for (let x = 0; x <= W; x += STEP) {
    const envelope = Math.exp(-(((x - peak) / 300) ** 2));
    const n =
      (noise(x / 74, r) * 1 +
        noise(x / 31, r + 91) * 0.55 +
        noise(x / 15, r + 173) * 0.2) /
      1.75;
    const y = baseline - envelope * rowGain * n * 96;
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
    if (x <= W - STEP) d += " ";
  }

  return { r, line: d, area: `${d} L${W} ${H + 60} L0 ${H + 60} Z` };
});

export default function HeroMark() {
  const reduced = useReducedMotion();
  const isServer = typeof window === "undefined";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="ridge-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink-mute)" stopOpacity="0.3" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--ink-mute)" stopOpacity="0.25" />
        </linearGradient>

        {/* Rows are filled with the page colour to occlude the row behind, which
            would otherwise read as a hard rectangle. Masking the field dissolves
            those edges and keeps the density off the headline. */}
        <radialGradient id="ridge-mask-grad" cx="62%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="55%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id="ridge-mask">
          <rect width={W} height={H} fill="url(#ridge-mask-grad)" />
        </mask>
      </defs>

      <g mask="url(#ridge-mask)">
        {rows.map(({ r, line, area }) => (
          <m.g
            key={r}
            initial={reduced || isServer ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.3 + r * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <path d={area} fill="var(--canvas)" />
            <path
              d={line}
              fill="none"
              stroke="url(#ridge-stroke)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </m.g>
        ))}
      </g>
    </svg>
  );
}
