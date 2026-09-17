# Premium Redesign Brief — ITINFiling.com

Read this entire file, then execute it as a multi-milestone redesign. Use the `premium-ui` skill in `.claude/skills/premium-ui/` for all visual and motion work.

## Mission

Totally redesign the marketing experience of this ITIN filing website (UK-based service) to agency-grade, $150k-tier quality: premium, interactive, animated, with scroll-driven storytelling and selective 3D depth. This should look like an Awwwards Site of the Day, not a template.

## Hard constraints — never violate

1. **Do not break the application logic.** Everything in `src/features/itin/**` (schema.ts, storage.ts, mock-service.ts, documents.ts, types.ts and their tests) is off-limits for behavioral changes. The checkout flow, application wizard state, localStorage persistence keys, and form validation must work exactly as before.
2. **Keep the brand color system.** Use only the existing tokens in `src/app/globals.css` `@theme`: `--color-navy #112E51`, `--color-navy-deep #0B2138`, `--color-navy-mid #173A6B`, `--color-blue #205493`, `--color-gold #f2c969`, `--color-bg-light #F4F6F8`, plus existing text/border tokens. You may add derived shades (tints, alpha variants, gradients) of these colors as new tokens — but no new hues.
3. **Keep the fonts:** Hanken Grotesk (sans) + Newsreader (serif italic accents). Do not add font families.
4. **Preserve all routes, metadata, JsonLd structured data, sitemap, robots, and SEO copy semantics.** Headings can be restyled and rephrased for impact but must keep their keyword intent (ITIN, Form W-7, renewal).
5. **Preserve compliance-sensitive copy** ("The IRS decides eligibility, assignment, and processing time" and similar disclaimers must remain visible).
6. **Respect `prefers-reduced-motion`** in every animation — static fallback branch, no exceptions.
7. Keep the site fully responsive and accessible (WCAG AA contrast, keyboard nav, focus states — the existing `:focus-visible` ring pattern stays).

## Current state (verified facts — do not re-derive)

- Next.js 16.2.9 App Router, React 19.2.4, TypeScript, Tailwind v4 (`@theme` tokens in globals.css).
- **Installed but completely unused:** `gsap@3.15`, `lenis@1.3.25`, `three` + `@react-three/fiber` + `@react-three/drei`. This is the redesign toolkit — wire them in.
- `motion` (Framer Motion) is NOT installed. Run `npm install motion` first (React 19 compatible) — use it for micro-interactions and layout animations; use GSAP ScrollTrigger for scroll-driven timelines; use Lenis for smooth scroll.
- Route groups: `(marketing)` home/blog/packages, `(checkout)`, `(auth)`, `(portal)` application wizard.
- Homepage renders 13 static server components in `src/components/home/`: HeroSection, TrustStrip, HowItWorks, EligibilityChecker, PackagesSection, WhatIsItin, WhoNeedsItin, WhyChooseUs, ExpertReview, Timeline, FaqSection, ResourcesSection, FinalCta.
- Everything is currently static — zero animation, flat card grids, generic centered layouts. That is the gap to close.

## Design direction

Think "premium fintech meets editorial" — the trust-heavy navy/gold palette should read like a private bank, not a form-filling service. References: Stripe, Mercury.com, Linear marketing pages, Ramp.

- **Hero:** full-viewport cinematic navy hero. Replace the static HeroDocumentVisual with an interactive centerpiece — a React Three Fiber scene (e.g., a floating, softly-rotating 3D document/passport stack with gold accent lighting, subtle mouse-parallax) wrapped in `<Suspense>` with a static fallback and a mobile low-poly/2D degrade path. Staggered headline reveal (word-by-word, custom cubic-bezier), magnetic CTA buttons.
- **Scroll architecture:** Lenis smooth scroll site-wide (marketing group only, via a client provider in `(marketing)/layout.tsx`). GSAP ScrollTrigger for: pinned HowItWorks step sequence (steps animate in as you scroll through a pinned section), Timeline that draws itself (SVG line + milestones), number counters in TrustStrip, parallax depth layers between sections.
- **Sections:** break the uniform card-grid monotony. Alternate layout rhythms: full-bleed navy statement sections, asymmetric editorial splits, a horizontal-scroll or pinned panel somewhere mid-page. PackagesSection gets premium pricing-card treatment (gold-ring featured card, hover lift with spring physics, animated feature-list check-ins).
- **Micro-interactions:** every interactive element gets intentional hover/press states (motion spring, 150–250ms). FaqAccordion animates open with height + fade. EligibilityChecker feels like a polished product widget with step transitions.
- **Header:** glass/blur on scroll, shrinks after threshold, active-section indicator.
- **Texture & depth:** subtle grain or dot-grid overlays on navy sections, layered gradients from existing hues, gold used sparingly as the "expensive" accent — never flooded.
- **Reuse existing images/SVGs in `public/` where useful; generate new inline SVG illustrations in brand colors where sections need visuals.**

## Scope by milestone (keep the app runnable after each)

1. **Foundation:** install `motion`; add Lenis provider + a reusable animation primitives library (`src/components/motion/` — Reveal, Stagger, Counter, Magnetic, ParallaxLayer) with reduced-motion handling built in once, used everywhere.
2. **Hero + Header + TrustStrip** (the first-impression 20%).
3. **Homepage body:** HowItWorks (pinned), Packages, Timeline (draw-on-scroll), WhyChooseUs, ExpertReview, WhatIsItin/WhoNeedsItin (editorial layouts), FAQ, Resources, FinalCta.
4. **Secondary marketing pages:** packages detail, blog index/article — inherit the new system.
5. **Checkout + portal polish:** visual refinement and transitions ONLY — no logic, state, or form changes. Progress indicators animate, step transitions fade/slide.
6. **Verification pass:** `npm run build` must pass, `npm run test` (vitest) must pass, check every page at 375px / 768px / 1440px, verify reduced-motion mode, verify no layout shift (CLS), lazy-load the 3D scene (`next/dynamic`, ssr:false) so it never blocks LCP.

## Quality bar per section

Before marking any section done, it must have: (a) a scroll entrance choreography (staggered, not one block fade), (b) at least one hover/interaction detail, (c) deliberate typographic hierarchy using clamp() fluid sizing and the serif italic accent pattern already in the hero, (d) zero generic Tailwind-default look (no default shadows, no `ease-in-out`).

Work section by section. After each milestone, run the build and fix errors before continuing.
