import clipbuddyIcon from "../assets/clipbuddy/clipbuddy-appicon-1024.png";

import home480 from "../assets/clipbuddy/01-home-480w.jpg";
import home800 from "../assets/clipbuddy/01-home-800w.jpg";
import home1100 from "../assets/clipbuddy/01-home-1100w.jpg";
import home1400 from "../assets/clipbuddy/01-home-1400w.jpg";
import search480 from "../assets/clipbuddy/02-search-480w.jpg";
import search800 from "../assets/clipbuddy/02-search-800w.jpg";
import search1100 from "../assets/clipbuddy/02-search-1100w.jpg";
import search1400 from "../assets/clipbuddy/02-search-1400w.jpg";
import snippets480 from "../assets/clipbuddy/04-snippets-480w.jpg";
import snippets800 from "../assets/clipbuddy/04-snippets-800w.jpg";
import snippets1100 from "../assets/clipbuddy/04-snippets-1100w.jpg";
import snippets1400 from "../assets/clipbuddy/04-snippets-1400w.jpg";
import stats480 from "../assets/clipbuddy/07-stats-480w.jpg";
import stats800 from "../assets/clipbuddy/07-stats-800w.jpg";
import stats1100 from "../assets/clipbuddy/07-stats-1100w.jpg";
import stats1400 from "../assets/clipbuddy/07-stats-1400w.jpg";

/** A phone was downloading the 1400px file to paint it 350px wide. Four tiers,
 *  because a 3x phone lands between 800 and 1400 and would round up. */
const shot = (w480: string, w800: string, w1100: string, w1400: string, alt: string) => ({
  src: w1400,
  srcSet: `${w480} 480w, ${w800} 800w, ${w1100} 1100w, ${w1400} 1400w`,
  alt,
});

/** Tracxn start date. Tenure below is derived from it so no number goes stale. */
const TRACXN_START = new Date("2023-01-01T00:00:00Z");

/** Floored to the nearest half-year, so the figure can only ever understate. */
const tenure = (start = TRACXN_START, now = new Date()) => {
  const months =
    (now.getFullYear() - start.getUTCFullYear()) * 12 + (now.getMonth() - start.getUTCMonth());
  return `${Math.floor(months / 6) / 2}y`;
};

export const profile = {
  name: "Akash Surve",
  role: "Full-Stack Software Engineer",
  location: "Bangalore, India",
  email: "surveakash01@gmail.com",
  // BASE_URL so the link survives the documented subpath deploy; a
  // root-absolute string would not be rewritten.
  resume: `${import.meta.env.BASE_URL}Akash_Surve_Resume.pdf`,
  status: "Shipping ClipBuddy 2.9 · Building AI surfaces at Tracxn",
  lede: "I build the parts of a product people actually touch — search surfaces, editors, chat docks, upload pipelines — and I ship them all the way to real users.",
  bio: [
    "I came to software from mechanical engineering, which is a useful accident: I was taught to think about tolerances, failure modes and the difference between a thing that works and a thing that keeps working. Most of what I do now is that, applied to interfaces.",
    "I like the work that sits between disciplines — the feature that needs a UI decision, an API change and a migration in the same pull request. Shipping ClipBuddy alone forced me to get comfortable with every part of that chain, from a SQLite schema to App Store review.",
  ],
};

export const socials = {
  github: "https://github.com/Akash2377",
  linkedin: "https://www.linkedin.com/in/akashsurve/",
  twitter: "https://twitter.com/AkashSurve2377",
  leetcode: "https://leetcode.com/Akash2377/",
  stackoverflow: "https://stackoverflow.com/users/19786860/akash-surve",
  hashnode: "https://hashnode.com/@Akash2377",
};

export type CaseStudy = {
  id: string;
  kicker: string;
  name: string;
  tagline: string;
  year: string;
  summary: string;
  /** Why the work existed — the constraint that shaped every decision below. */
  context: { heading: string; body: string };
  chapters: { title: string; body: string; bullets?: string[] }[];
  /** Smaller engineering details worth naming but not worth a chapter. */
  details: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  icon?: string;
  shots: { src: string; srcSet: string; alt: string }[];
  accentNote: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "clipbuddy",
    kicker: "Product · Solo",
    name: "ClipBuddy",
    tagline: "A native macOS clipboard manager, on the Mac App Store",
    year: "2025 — now",
    summary:
      "Everything you copy, kept locally and searchable in a keystroke. A menu-bar app in Swift and SwiftUI over a local SQLite store with full-text search, a picker drawer on a global hotkey, and no account anywhere in the product. I designed it, built it, shipped it, wrote the marketing site, and run the releases.",
    context: {
      heading: "The constraint that shaped everything",
      body: "A clipboard manager sees every password, every API key, every private message you copy. That makes trust the whole product, and trust you can only assert is worth nothing. So the privacy claim had to be structural: no account system, no server, no sync path — nothing to leak because there is nowhere for data to go. Every feature since has had to fit inside that constraint, and several obvious ones were cut because they did not.",
    },
    chapters: [
      {
        title: "Local-first storage that stays fast at 20,000 clips",
        body: "History lives in a single SQLite database in the app's container, with an FTS5 virtual table for search and image blobs on disk beside it rather than in the row. Search stays instant because the index does the work, not a scan.",
        bullets: [
          "FTS5 full-text index over clip contents, kept in sync on write",
          "Images stored as files, referenced by id — the database stays small",
          "A schema migration ledger so a database written by any past version opens correctly",
          "Probe connections opened read-write, after a WAL-mode bug proved a read-only probe silently reports 'no version'",
        ],
      },
      {
        title: "Entitlement with no account system",
        body: "Free tier is the last ten clips plus the emoji picker; Pro unlocks history, search, snippets and labels. There is no login, no license key, no backend to check against — StoreKit is the only authority.",
        bullets: [
          "A single access object reads Apple's on-device entitlements and fails closed",
          "Every surface observes it, so there is one place to be wrong instead of forty",
          "Monthly, annual and lifetime products, prices always read from StoreKit so they are region-correct",
          "No server means no outage can lock a paying user out of their own clipboard",
        ],
      },
      {
        title: "A picker that has to be faster than not using it",
        body: "The drawer opens on a global hotkey, filters as you type, and puts the chosen clip on the pasteboard. Anything slower than reaching for the original window makes the app pointless, so the interaction budget is measured in frames.",
        bullets: [
          "Configurable picker hotkey, with registration failures surfaced instead of failing silently",
          "Type-to-search across the whole history, not just the visible page",
          "Direct paste is opt-in and off by default — Accessibility is requested the moment a user turns it on, never at launch",
          "Labels with their own hotkeys, so a frequent set is one chord away",
        ],
      },
      {
        title: "Release engineering, because there is nobody else",
        body: "Solo shipping means the process has to catch what a second reviewer would. Most of the tooling in the repo exists because a specific bug got through once and is not allowed to again.",
        bullets: [
          "One reproducible App Store build script — compiling is not packaging, and the script enforces that",
          "Source gates wired into the build that fail on known-bad patterns, added after a modal-dispatch bug froze the app invisibly",
          "A manual pass checklist per release covering every surface a change can touch",
          "Version discipline across the plist, the tag and the store listing, so a rejected build can be re-uploaded without ambiguity",
        ],
      },
      {
        title: "The native surface area nobody sees until it is missing",
        body: "The long tail is most of the work in a Mac app: system integrations, appearance, localization, and the dozens of small affordances that separate a native app from a cross-platform shell.",
        bullets: [
          "OCR through Apple Vision — a screenshot becomes searchable by the words inside it",
          "Translation through Apple's on-device Translation framework",
          "Snippets with expansion keywords, quick actions for QR, color swatches and calculations",
          "16 localizations, light and dark themes, backup and restore",
        ],
      },
    ],
    details: [
      "Marketing site rebuilt from a React SPA to Astro static output, served through a Cloudflare Worker",
      "Migrated off direct distribution — Sparkle updater, Ed25519 licensing and payment integration all removed for a store-only build",
      "Privacy policy written to disclose the one outbound request the app makes: a daily version check carrying only the public store id",
      "Press kit, App Store screenshots and store copy produced in-house",
    ],
    stack: [
      "Swift",
      "SwiftUI",
      "AppKit",
      "SQLite / FTS5",
      "StoreKit 2",
      "Apple Vision",
      "Astro",
      "Cloudflare Workers",
    ],
    metrics: [
      { value: "MAS", label: "sole distribution channel" },
      { value: "2.9.x", label: "shipped release line" },
      { value: "16", label: "localizations" },
      { value: "0", label: "bytes of clipboard data sent" },
    ],
    links: [
      { label: "clipbuddyapp.com", href: "https://clipbuddyapp.com" },
      { label: "Mac App Store", href: "https://apps.apple.com/app/id6786578164" },
    ],
    icon: clipbuddyIcon,
    shots: [
      shot(home480, home800, home1100, home1400, "Clipboard history, filtered by type and label"),
      shot(search480, search800, search1100, search1400, "Full-text search across every saved clip"),
      shot(snippets480, snippets800, snippets1100, snippets1400, "Snippets library with expansion keywords"),
      shot(stats480, stats800, stats1100, stats1400, "Usage statistics, computed entirely on device"),
    ],
    accentNote:
      "Designed, built, shipped and supported solo — app, marketing site, store listing and release pipeline.",
  },
  {
    id: "tracxn",
    kicker: "Work · Tracxn",
    name: "AI surfaces & platform work",
    tagline: "Product engineering across a large React portal and its Node services",
    year: "2023 — now",
    summary:
      "I ship user-facing features end to end on a global market-intelligence platform used by investors, corporates and financial institutions: React in the portal, Node services, AWS Lambda functions and batch jobs behind it, usually in the same change. The last year has been mostly LLM work — an agentic documentation assistant, an internal MCP server, and chat surfaces embedded in pages people already use.",
    context: {
      heading: "Working inside a product that is already load-bearing",
      body: "Nothing here was built on a blank page. Every feature had to land inside a portal customers already use daily, alongside existing layouts, permission tiers and data contracts — which means most of the engineering is in the seams: what loads first, what is cached, what happens on a tablet, and what the page does while it waits.",
    },
    chapters: [
      {
        title: "An agentic documentation and research assistant",
        body: "A multi-provider LLM agent answering questions against the product's own documentation and data. It picks tools rather than following a script: retrieval over the docs, web search, or a call into the platform's own search and feature APIs, depending on what the question needs.",
        bullets: [
          "Multi-provider — Claude, GPT and Gemini behind one interface, so a model choice is configuration rather than a rewrite",
          "Retrieval-augmented answers with agentic tool-calling, streamed token by token",
          "Intent detection routes a question to the right tool before spending a model call on it",
          "Prompt caching and versioning: the cached prefix is the difference between viable and expensive at this volume",
          "Answers export to DOCX, Excel and PDF, because the people asking need to send the result onward",
        ],
      },
      {
        title: "An internal MCP server for API migration",
        body: "Model Context Protocol server exposing eight read-only tools over the migration surface, so an AI assistant can answer migration questions directly instead of an engineer reading release notes by hand.",
        bullets: [
          "Schema-field validation, fuzzy field matching and endpoint comparison across API versions",
          "Read-only by design — the blast radius of a wrong answer is a wrong answer, not a wrong write",
          "Cut manual API-migration effort across the engineering team",
        ],
      },
      {
        title: "An AI assistant embedded in the pages it talks about",
        body: "Rather than a separate chat destination, the assistant lives as a dock on the pages users are already reading — list views and entity detail pages — so the conversation starts with context instead of asking for it.",
        bullets: [
          "Entity-scoped detail-page chat: the conversation knows which company or record you are looking at",
          "List-page refine bar with an expanded composer and a bottom-up flyout",
          "Both surfaces folded onto a single cached embed instead of two, so opening the second dock costs nothing",
          "Dock gated on content load, shrink-on-scroll, and a reading column capped for legibility",
        ],
      },
      {
        title: "Rollout as a first-class problem",
        body: "Access to the assistant is governed by account tier, and each tier came online separately. That meant the same surface had to be exposed, gated and verified repeatedly without regressing the tiers already live.",
        bullets: [
          "Assistant access wired up tier by tier across portal, services and the external embed",
          "Feature gating that waits for route and status config to load, instead of flashing the wrong menu",
          "Out-of-credit handling: usage popper, reset date, and a takeover state kept in sync with the chat",
          "Click and conversation ids attached to chat logs so behavior could be measured, not guessed",
        ],
      },
      {
        title: "A documentation content manager, editor to published page",
        body: "An internal CMS for the developer documentation, covering authoring, preview, structure and search — plus the OpenAPI surfaces the docs are generated from.",
        bullets: [
          "MDX editor with live preview and a full-page preview mode",
          "Nested resource tree up to ten levels, with inherited access badges",
          "Deterministic search paging, so results do not reshuffle between pages",
          "Frontmatter parsing fixed to stop silently dropping pages whose values wrapped onto a second line",
          "API navigation grouped by domain, with nested resource levels preserved in the sidebar",
        ],
      },
      {
        title: "Real-time save-to-drive",
        body: "Sending a document to a connected drive used to be a request you waited on. It is now fire-and-forget on the server with live progress on the client, built so a second provider is configuration rather than a fork.",
        bullets: [
          "Async pipeline that returns immediately and reports progress over a socket",
          "A storage adapter framework so new drive providers plug into one flow",
          "Front-end store split into connection state and availability state, with availability cached",
          "Selectors guarded so pages render correctly when the storage reducer is not mounted",
        ],
      },
      {
        title: "Migrations and platform work with the product live",
        body: "A share of the work is not a feature at all: moving consumers onto current API versions, retiring dead code paths, and keeping shared libraries current — always incrementally, never behind a freeze.",
        bullets: [
          "Saved-search consumers moved from a legacy API version to the current one across portal features and batch jobs",
          "Feed cards and applicant flows migrated between major API versions",
          "A decommissioned email-thread-linking backend removed from both the service and its front-end callers",
          "Internal library versions bumped across job-system jobs and Lambda runtimes",
        ],
      },
    ],
    details: [
      "CRM connectors for Salesforce, HubSpot and Zoho — syncing entity data and driving deal, lead and account workflows, with a board view and pipeline UI",
      "A Gmail add-on putting platform data and exported documents inside the user's mail workflow",
      "Server-side PDF generation made 4× faster on Lambda with Puppeteer, through parallel rendering and profiling",
      "Serverless infrastructure: a CloudFront invalidation handler and a Lambda authorizer for protected assets",
      "Role-based access control and feature gating across the product",
      "A compare tool for evaluating entities side by side, and a user-preferences module for personalised dashboards",
      "Reusable UI component libraries, with lazy loading, code splitting and memoization to cut bundle size",
      "Home dashboard widgets, global search fixes, and tablet layouts for the dashboard and assistant docks",
    ],
    stack: [
      "React",
      "Redux",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "WebSockets",
      "LLM APIs",
      "RAG",
      "MCP",
      "AWS Lambda",
    ],
    metrics: [
      { value: "4\u00d7", label: "faster server-side PDF generation" },
      { value: "3", label: "LLM providers behind one interface" },
      { value: "E2E", label: "UI, API and batch jobs in one change" },
      { value: tenure(), label: "on the same product surface" },
    ],
    links: [{ label: "tracxn.com", href: "https://tracxn.com" }],
    shots: [],
    accentNote:
      "Feature work described at capability level — implementation details and internal systems stay internal.",
  },
];

/** How I work — the About section's substance, not a recap of the case studies. */
export const principles: { title: string; body: string }[] = [
  {
    title: "Ship it, then find out",
    body: "A feature nobody has used is a guess. I would rather put a narrow version in front of real users and learn what is actually wrong than polish a wide one in private.",
  },
  {
    title: "The edge cases are the feature",
    body: "Loading, empty, failed, offline, mid-migration, 320px wide. The happy path is usually an afternoon; everything around it is the job, and it is what separates a demo from a product.",
  },
  {
    title: "Make the guarantee structural",
    body: "If a promise can be broken by someone editing a file, it is not a guarantee. I prefer constraints the architecture enforces — no sync path, one access authority, a build that fails on a known-bad pattern.",
  },
  {
    title: "Leave the codebase legible",
    body: "Someone reads this next, possibly me in a year. Small surfaces, honest names, and a comment where the reason is not obvious from the code.",
  },
];

export const toolkit: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Swift", "Java", "SQL"] },
  { group: "Front end", items: ["React", "Redux", "Tailwind CSS", "SwiftUI", "Astro", "Vite"] },
  { group: "Back end", items: ["Node.js", "Express", "MongoDB", "SQLite", "WebSockets", "REST"] },
  { group: "Platform", items: ["AWS Lambda", "Cloudflare Workers", "Git", "CI gates", "StoreKit"] },
  { group: "AI", items: ["LLM APIs", "RAG", "Tool-calling agents", "MCP", "Prompt caching"] },
];

type TimelineItem = {
  period: string;
  title: string;
  org: string;
  kind: "work" | "product" | "education";
  detail: string;
};

export const timeline: TimelineItem[] = [
  {
    period: "2023 — Present",
    title: "Full-Stack Software Engineer",
    org: "Tracxn",
    kind: "work",
    detail:
      "Product engineering on the private-market intelligence platform: AI assistant surfaces, documentation tooling, real-time upload pipelines and API migrations, across a React portal and Node services.",
  },
  {
    period: "2025 — Present",
    title: "Founder & sole engineer",
    org: "ClipBuddy",
    kind: "product",
    detail:
      "A native macOS clipboard manager on the Mac App Store. Swift app, Astro marketing site, Cloudflare Worker, and the whole release pipeline.",
  },
  {
    period: "2022",
    title: "Full Stack Web Development",
    org: "Masai School",
    kind: "education",
    detail:
      "Full-time MERN program. Awarded The Power Project, The Founder's Circle and the Rising Star award for project work and consistency.",
  },
  {
    period: "2019 — 2022",
    title: "B.E. Mechanical Engineering",
    org: "Savitribai Phule Pune University",
    kind: "education",
    detail: "Preceded by a Diploma in Mechanical Engineering, MSBTE, 2016 — 2019.",
  },
];

/** Freelance engagements I take on outside full-time work. */
export const services: { title: string; body: string }[] = [
  {
    title: "macOS apps",
    body: "Native Swift and SwiftUI — menu-bar utilities, local-first storage, StoreKit, and the App Store submission that usually turns out to be the hard part.",
  },
  {
    title: "React front ends",
    body: "Product surfaces in React and TypeScript: dashboards, editors, search and filter UIs, and the interaction detail that makes them feel finished.",
  },
  {
    title: "Node services & APIs",
    body: "REST services, real-time pipelines over WebSockets, batch jobs, and incremental migrations done without taking the product down.",
  },
  {
    title: "LLM features",
    body: "Retrieval-augmented assistants, tool-calling agents and MCP servers wired into a real product — including the streaming, caching and cost work that decides whether they survive contact with production.",
  },
  {
    title: "Rescue & polish",
    body: "An existing build that is slow, broken on mobile, or stuck one step from shipping. Often the fastest thing I can do for someone.",
  },
];

export const contact = {
  heading: "Let's build something.",
  body: "I'm open to freelance and contract work alongside my full-time role — macOS apps, React front ends, Node services, or getting something unfinished across the line. Tell me what you're building and roughly when you need it, and I'll tell you honestly whether I'm the right fit.",
  mailtoSubject: "Freelance enquiry",
  mailtoBody:
    "Hi Akash,\n\nWhat I'm building:\n\nWhat I need help with:\n\nRough timeline and budget:\n\n",
  availability: "Taking on select freelance work · usually replies within a day",
};

export const nav = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "path", label: "Path" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/**
 * How an engagement actually runs. Clients ask this before they ask about
 * price, and a vague answer is the thing that loses the project.
 */
export const engagement: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "A short, specific conversation",
    body: "One email or a half-hour call. What you are building, what is already there, what done looks like, and when you need it. I would rather say no here than three weeks in, so expect direct questions about scope.",
  },
  {
    step: "02",
    title: "A written scope and a fixed price",
    body: "You get the work broken into deliverables, what is explicitly out of scope, a timeline, and a price. Fixed where the shape is clear, hourly where it genuinely is not. Nothing starts until you have agreed to that document.",
  },
  {
    step: "03",
    title: "Visible progress, not status meetings",
    body: "Work lands in small reviewable pieces on a branch you can see, with a written update at the end of each week: what shipped, what is next, anything that changed. You can always look at the actual state rather than a summary of it.",
  },
  {
    step: "04",
    title: "Handover you can actually maintain",
    body: "Code that reads like the rest of your codebase, a README that covers running and deploying it, and the reasoning behind anything non-obvious written down. For App Store work that includes the listing, the release script and the submission itself.",
  },
];

/** Public trails that back up the claims above. */
export const evidence: { label: string; detail: string; href: string }[] = [
  {
    label: "GitHub",
    detail: "Code history, side projects and the tooling I build for myself",
    href: socials.github,
  },
  {
    label: "Hashnode",
    detail: "Writing on things I have had to work out the hard way",
    href: socials.hashnode,
  },
  {
    label: "Stack Overflow",
    detail: "Answers, mostly JavaScript and React",
    href: socials.stackoverflow,
  },
  {
    label: "LeetCode",
    detail: "Data structures and algorithms practice",
    href: socials.leetcode,
  },
];
