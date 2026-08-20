#!/usr/bin/env python3
"""Build a one-page, ATS-friendly resume PDF (real selectable text, clickable links,
no tables/columns/graphics).

This script is the ONLY source of truth for the served resume. The PDF it writes is
committed alongside it; editing the PDF by hand is how the job title silently reverted
once already. Run `python3 scripts/build_resume.py` after any content change.
"""
from datetime import date

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "Akash_Surve_Resume.pdf")

LINKEDIN_URL = "https://www.linkedin.com/in/akashsurve/"
GITHUB_URL = "https://github.com/Akash2377"
PORTFOLIO_URL = "https://akashsurve2377.netlify.app"
CLIPBUDDY_SITE = "https://clipbuddyapp.com"
CLIPBUDDY_MAS = "https://apps.apple.com/app/id6786578164"

# Tenure is derived, never typed. A hardcoded "3+ years" was already two half-years
# stale; this floors to the nearest half-year so it can only ever understate.
TRACXN_START = date(2023, 1, 1)


def tenure(start=TRACXN_START, today=None):
    today = today or date.today()
    months = (today.year - start.year) * 12 + (today.month - start.month)
    return f"{months // 6 * 0.5:g}+ years"


DARK = HexColor("#1a1a1a")
GREY = HexColor("#444444")
RULE = HexColor("#999999")
LINK = HexColor("#1155cc")

styles = getSampleStyleSheet()

name_style = ParagraphStyle("Name", parent=styles["Normal"], fontName="Helvetica-Bold",
                            fontSize=19, leading=22, textColor=DARK, spaceAfter=1)
role_style = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica",
                            fontSize=11, leading=13, textColor=GREY, spaceAfter=2)
contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontName="Helvetica",
                               fontSize=8.7, leading=11, textColor=GREY, spaceAfter=1)
section_style = ParagraphStyle("Section", parent=styles["Normal"], fontName="Helvetica-Bold",
                               fontSize=10.2, leading=11.4, textColor=DARK, spaceBefore=3.5, spaceAfter=1)
job_style = ParagraphStyle("Job", parent=styles["Normal"], fontName="Helvetica-Bold",
                           fontSize=9.8, leading=11.6, textColor=DARK, spaceBefore=1, spaceAfter=0)
jobmeta_style = ParagraphStyle("JobMeta", parent=styles["Normal"], fontName="Helvetica-Oblique",
                               fontSize=8.5, leading=10.6, textColor=GREY, spaceAfter=2)
body_style = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica",
                            fontSize=9.2, leading=10.9, textColor=DARK, alignment=TA_LEFT, spaceAfter=1.5)
bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"], fontName="Helvetica",
                              fontSize=9.2, leading=10.9, textColor=DARK, alignment=TA_LEFT)


def section(title):
    return [Paragraph(title.upper(), section_style),
            HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=1, spaceAfter=3)]


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(t, bullet_style), leftIndent=11, value="•") for t in items],
        bulletType="bullet", start="•", leftIndent=11,
        bulletFontName="Helvetica", bulletFontSize=9.2, spaceBefore=0, spaceAfter=0,
    )


def link(url, text):
    return f'<a href="{url}" color="#1155cc">{text}</a>'


story = []

# ---- Header ----
story.append(Paragraph("AKASH SURVE", name_style))
story.append(Paragraph("Full-Stack Software Engineer", role_style))
story.append(Paragraph(
    "Bangalore, India &nbsp;|&nbsp; +91 86684 58742 &nbsp;|&nbsp; "
    "surveakash01@gmail.com &nbsp;|&nbsp; "
    + link(PORTFOLIO_URL, "Portfolio") + " &nbsp;|&nbsp; "
    + link(LINKEDIN_URL, "LinkedIn") + " &nbsp;|&nbsp; "
    + link(GITHUB_URL, "GitHub"), contact_style))
story.append(HRFlowable(width="100%", thickness=0.8, color=RULE, spaceBefore=5, spaceAfter=1))

# ---- Summary ----
story += section("Summary")
story.append(Paragraph(
    f"Full-Stack Software Engineer with {tenure()} building scalable, high-performance, configurable web "
    "applications across React.js/Redux frontends and Node.js backends. Strong in reusable UI component "
    "libraries, responsive interfaces, and cross-browser performance optimization, with growing depth in "
    "AI-augmented engineering &mdash; building Model Context Protocol (MCP) tooling, integrating LLM-powered "
    "features, and shipping AWS serverless and CRM integrations on a global financial-intelligence platform. "
    "Also ships a native macOS app on the Mac App Store, solo.",
    body_style))

# ---- Skills ----
story += section("Skills")
skills = [
    ("Frontend", "React.js, Redux, JavaScript (ES6+), TypeScript, HTML5, CSS3, Next.js, Tailwind CSS"),
    ("AI / LLM", "Claude, OpenAI &amp; Gemini APIs, Model Context Protocol (MCP), Tool-Calling Agents, RAG, Prompt Engineering &amp; Caching, LLM Feature Integration, AI-Assisted Development (Claude Code)"),
    ("Backend", "Node.js, Express, MongoDB, SQLite, REST APIs, WebSockets"),
    ("macOS", "Swift, SwiftUI, AppKit, SQLite/FTS5, StoreKit 2, Apple Vision, App Store submission"),
    ("Cloud", "AWS Lambda, Serverless Framework, CloudFront, S3, Lambda Authorizers, Puppeteer, Cloudflare Workers"),
    ("Integrations", "CRM: Salesforce, HubSpot &amp; Zoho; Gmail Add-on; REST APIs, OAuth"),
    ("Tooling", "Performance Optimization, Code Splitting, Lazy Loading, Memoization, Code Reviews, Git, Postman, Agile / Scrum"),
]
for label, val in skills:
    story.append(Paragraph(f"<b>{label}:</b> {val}", body_style))

# ---- Experience ----
story += section("Work Experience")
story.append(Paragraph("Full-Stack Software Engineer &mdash; Tracxn", job_style))
story.append(Paragraph(
    "Jan 2023 &ndash; Present &nbsp;|&nbsp; Bangalore, India &nbsp;|&nbsp; "
    "Global market-intelligence platform for investors, corporates, and financial institutions.",
    jobmeta_style))
story.append(bullets([
    "Building an <b>AI-powered documentation and research assistant</b> (docs service) &mdash; a multi-provider LLM agent (Claude/Opus, GPT, Gemini) with agentic tool-calling that searches docs via RAG, runs web search, and executes Tracxn search/feature APIs to answer user queries, with streaming responses, intent detection, prompt caching/versioning, and DOCX/Excel/PDF export.",
    "Built an internal <b>Model Context Protocol (MCP) server</b> (<i>tracxn-api-migration</i>) exposing 8 read-only tools &mdash; schema-field validation, fuzzy field matching, and endpoint comparison &mdash; enabling AI assistants to query migration notes and cutting manual API-migration effort across the engineering team.",
    "Delivered <b>CRM integrations</b> &mdash; Salesforce, HubSpot, and Zoho connectors &mdash; syncing company/entity data and enabling deal, lead, and account workflows, with CRM board-view and pipeline UI.",
    "Built a <b>Gmail add-on</b> surfacing Tracxn data and exported documents directly into users' email workflow.",
    "Drove <b>AI-augmented development</b> using Claude Code, custom agents, and codebase-context tooling, accelerating feature delivery and reducing onboarding ramp time.",
    "Engineered <b>AWS serverless</b> functions (Serverless Framework) including a CloudFront-invalidation handler and a protected-asset Lambda authorizer.",
    "Optimized server-side PDF generation by <b>4&times;</b> using AWS Lambda and Puppeteer with parallel rendering and performance tuning.",
    "Designed a User Preferences module (personalized dashboards, configurable UX) and a Compare Tool for evaluating entities side-by-side, with advanced filtering, sorting, and search driven by dynamic configurations and Redux state.",
    "Developed a Feature Access and Role-Based Access Control (RBAC) system, strengthening security, compliance, and feature-visibility management.",
    "Engineered and maintained large-scale, user-facing React.js and Redux applications, and built the reusable UI component libraries behind them &mdash; lazy loading, code splitting, and memoization cutting bundle size and improving load performance.",
    "Conducted design and code reviews, mentored new engineers, and collaborated cross-functionally for seamless end-to-end delivery.",
]))

# ---- Projects ----
story += section("Projects")
story.append(bullets([
    "<b>ClipBuddy</b> &mdash; native macOS clipboard manager in Swift/SwiftUI over a local SQLite store with FTS5 "
    "search; StoreKit subscriptions, 16 localizations, no account or server. Shipped solo: app, site, listing, "
    "release pipeline. " + link(CLIPBUDDY_SITE, "clipbuddyapp.com") + " &nbsp;|&nbsp; "
    + link(CLIPBUDDY_MAS, "Mac App Store"),
    "<b>AI Developer Tooling</b> &mdash; custom AI agents, Claude Code skills, and MCP integrations automating code "
    "search, migration, and review; full-stack LLM app using React with the Claude/OpenAI APIs, RAG, and agentic workflows.",
]))

# ---- Education ----
story += section("Education")
story.append(Paragraph("<b>BE in Mechanical Engineering</b> &nbsp;|&nbsp; Savitribai Phule Pune University, 2019&ndash;2022", body_style))
story.append(Paragraph("<b>Full-Stack Web Development</b> &nbsp;|&nbsp; Masai School, 2022 &mdash; 30-week program: JavaScript, React.js, Redux, Node.js, Agile, code reviews.", body_style))

doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    leftMargin=0.55 * inch, rightMargin=0.55 * inch,
    topMargin=0.5 * inch, bottomMargin=0.45 * inch,
    title="Akash Surve - Resume", author="Akash Surve",
)
doc.build(story)

from pypdf import PdfReader
pages = len(PdfReader(OUT).pages)
if pages != 1:
    raise SystemExit(f"resume spilled to {pages} pages - trim content, do not ship this")
print("WROTE", OUT, "(1 page)")
