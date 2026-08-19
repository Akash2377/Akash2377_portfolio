/**
 * Single source of truth for anything that needs an absolute URL: canonical
 * tag, Open Graph, sitemap and JSON-LD. Change `url` here and re-run the build
 * — nothing else hardcodes the domain.
 */
export const site = {
  url: "https://akashsurve2377.netlify.app",
  title: "Akash Surve — Freelance Full Stack & macOS Developer",
  description:
    "Freelance full stack and macOS developer in Pune, India. Native Swift and SwiftUI apps, React and TypeScript front ends, Node.js services and APIs. Creator of ClipBuddy on the Mac App Store. Available for contract and project work worldwide.",
  locale: "en_IN",
  twitter: "@AkashSurve2377",
};

type Faq = { q: string; a: string };

/**
 * Real questions a prospective client asks before the first email. Doubles as
 * the FAQPage structured data, which is what assistants quote back.
 */
export const faqs: Faq[] = [
  {
    q: "Are you available for freelance work?",
    a: "Yes. I take on a small number of freelance and contract projects alongside my full-time engineering role, which keeps the list short and the commitments realistic. Email me with what you are building and when you need it and I will tell you honestly whether I am the right fit — including when I am not.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "Four kinds: native macOS apps in Swift and SwiftUI, including App Store submission; React and TypeScript front ends such as dashboards, editors and search interfaces; Node.js services, REST APIs and real-time pipelines; and rescue work on an existing build that is slow, broken on mobile, or stuck one step from shipping.",
  },
  {
    q: "How do you charge and how do engagements work?",
    a: "Either a fixed scope with a fixed price, or ongoing hours for work that cannot be specified up front. Fixed scope suits a defined deliverable — an app submission, a redesign, a specific feature. Hourly suits open-ended work. I quote after a short conversation about scope, never before.",
  },
  {
    q: "Where are you based and which timezones do you work with?",
    a: "Pune, India, on IST (UTC+5:30). That overlaps a full working day with Europe and the UK, and mornings there are afternoons in Australia and Asia. For US clients I keep a fixed overlap window rather than pretending to be online at 3am — async written updates carry the rest.",
  },
  {
    q: "Can you take a macOS app from idea to the Mac App Store?",
    a: "Yes — that is exactly what ClipBuddy is. Swift and SwiftUI app, local SQLite storage, StoreKit subscriptions and lifetime purchase, the marketing site, App Store listing, screenshots, privacy policy and the release pipeline. Apple review is usually the part people underestimate, and I have been through it repeatedly.",
  },
  {
    q: "Do you work on existing codebases or only new builds?",
    a: "Both, and most of my day job is the former. At Tracxn I ship features into a large React portal and its Node services that customers use daily — which means working inside existing layouts, permission models and data contracts without breaking what already works. Joining an existing codebase is normal, not an exception.",
  },
  {
    q: "What is your stack?",
    a: "TypeScript and JavaScript, Swift, and SQL day to day. React, Redux, Tailwind CSS, SwiftUI, Astro and Vite on the front end. Node.js, Express, MongoDB, SQLite and WebSockets on the back end. AWS Lambda and Cloudflare Workers for deployment, plus StoreKit and the Apple frameworks for macOS.",
  },
  {
    q: "How quickly do you reply?",
    a: "Usually within a day. The fastest route is email — surveakash01@gmail.com — with a sentence on what you are building, what you need help with, and a rough timeline and budget. That is enough for me to give you a real answer instead of a discovery call.",
  },
];
