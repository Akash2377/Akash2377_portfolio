/**
 * Generates everything that needs the canonical URL: head tags, JSON-LD,
 * sitemap, robots and llms.txt. Reads src/data/site.ts so the domain is
 * declared in exactly one place.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");

// Reuse the SSR bundle's module graph to read the typed data as data.
await build({
  logLevel: "error",
  build: { ssr: "src/data/seo-source.ts", outDir: ".seo", emptyOutDir: true, copyPublicDir: false },
});
const mod = await import(pathToFileURL(path.join(root, ".seo", "seo-source.js")).href);
const { site, faqs, profile, socials, caseStudies, services, toolkit, timeline, engagement } = mod;

// A leading slash resets the path, so `new URL("/x", "https://h/repo/")` loses
// the subpath. Join relative to a base that always ends in a slash instead.
const base = site.url.endsWith("/") ? site.url : `${site.url}/`;
const abs = (p = "") => new URL(String(p).replace(/^\//, ""), base).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const skills = [...new Set(toolkit.flatMap((g) => g.items))];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": abs("#page"),
      url: abs(),
      name: site.title,
      description: site.description,
      inLanguage: "en",
      mainEntity: { "@id": abs("#person") },
      about: { "@id": abs("#person") },
    },
    {
      "@type": "Person",
      "@id": abs("#person"),
      name: profile.name,
      url: abs(),
      email: `mailto:${profile.email}`,
      jobTitle: profile.role,
      description: site.description,
      address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
      knowsAbout: skills,
      knowsLanguage: ["English", "Hindi", "Marathi"],
      sameAs: Object.values(socials),
      worksFor: { "@type": "Organization", name: "Tracxn", url: "https://tracxn.com" },
      alumniOf: timeline
        .filter((t) => t.kind === "education")
        .map((t) => ({ "@type": "EducationalOrganization", name: t.org })),
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.body, serviceType: s.title },
        availability: "https://schema.org/InStock",
        areaServed: { "@type": "Place", name: "Worldwide" },
      })),
    },
    {
      "@type": "ProfessionalService",
      "@id": abs("#practice"),
      name: `${profile.name} — Freelance Software Development`,
      url: abs("#contact"),
      email: `mailto:${profile.email}`,
      description:
        "Freelance software development: native macOS apps in Swift and SwiftUI, React and TypeScript front ends, Node.js services and APIs, and rescue work on existing builds.",
      areaServed: { "@type": "Place", name: "Worldwide" },
      provider: { "@id": abs("#person") },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Freelance services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.body },
        })),
      },
    },
    ...caseStudies
      .filter((c) => c.id === "clipbuddy")
      .map((c) => ({
        "@type": "SoftwareApplication",
        "@id": abs("#clipbuddy"),
        name: c.name,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "macOS",
        description: c.summary,
        url: "https://clipbuddyapp.com",
        downloadUrl: "https://apps.apple.com/app/id6786578164",
        author: { "@id": abs("#person") },
      })),
    {
      "@type": "FAQPage",
      "@id": abs("#faq"),
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const ld = JSON.stringify(jsonLd);

const head = `
    <link rel="canonical" href="${abs()}" />
    <meta property="og:url" content="${abs()}" />
    <meta property="og:site_name" content="${esc(profile.name)}" />
    <meta property="og:locale" content="${site.locale}" />
    <meta property="og:image" content="${abs("/og.png")}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(site.title)}" />
    <meta name="twitter:site" content="${site.twitter}" />
    <meta name="twitter:creator" content="${site.twitter}" />
    <meta name="twitter:image" content="${abs("/og.png")}" />
    <meta name="author" content="${esc(profile.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <script type="application/ld+json">${ld.replace(/</g, "\\u003c")}</script>`;

const indexPath = path.join(dist, "index.html");
let html = await readFile(indexPath, "utf8");

// Font files are only discovered after the stylesheet parses, which delays the
// first real text paint. Preload the two latin faces the page always needs —
// their names are content-hashed, so they have to be read back from the build.
const { readdir } = await import("node:fs/promises");
const assets = await readdir(path.join(dist, "assets"));
// Matches vite.config.ts, so the preload resolves in a subpath deploy too.
const basePath = process.env.BASE_PATH ?? "/";
const preload = ["inter-400-latin", "instrument-serif-400-latin"]
  // Anchored: a bare prefix also matches the -ext subset, which is never used
  // for this content and would leave the face that actually paints unpreloaded.
  .map((stem) => assets.find((f) => new RegExp(`^${stem}-[A-Za-z0-9_-]+\\.woff2$`).test(f)))
  .filter(Boolean)
  .map((f) => `    <link rel="preload" href="${basePath}assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n");

html = html.replace("</head>", `${preload}\n${head}\n  </head>`);
await writeFile(indexPath, html, "utf8");

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${abs()}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`,
  "utf8",
);

await writeFile(
  path.join(dist, "robots.txt"),
  `# Search engines and AI assistants are both welcome to read this page.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`,
  "utf8",
);

// llms.txt — plain-text summary for assistants that prefer it over HTML.
const svc = services.map((s) => `- **${s.title}**: ${s.body}`).join("\n");
const how = engagement.map((s) => `${s.step}. **${s.title}** — ${s.body}`).join("\n");
const faq = faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");
const work = caseStudies
  .map((c) => `### ${c.name} — ${c.tagline}\n\n${c.summary}\n\nStack: ${c.stack.join(", ")}.`)
  .join("\n\n");

await writeFile(
  path.join(dist, "llms.txt"),
  `# ${profile.name}

> ${site.description}

Contact: ${profile.email} · ${abs("#contact")}
Location: ${profile.location} (IST, UTC+5:30) · works with clients worldwide
Status: available for freelance and contract work

## Freelance services

${svc}

## How an engagement runs

${how}

## Selected work

${work}

## Skills

${skills.join(", ")}

## FAQ

${faq}

## Links

${Object.entries(socials).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
- Résumé: ${abs(profile.resume)}
`,
  "utf8",
);

console.log("seo: canonical, JSON-LD, sitemap.xml, robots.txt and llms.txt written");
