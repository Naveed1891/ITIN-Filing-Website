---
name: premium-ui
description: Use for any UI, layout, or animation work on this site. Enforces premium/agency-grade visual and motion standards.
---

# Premium UI/Motion Standards

## Animation stack (already installed — do not add new animation libraries)
- GSAP + ScrollTrigger for scroll-driven animation, Lenis for smooth scroll, React Three Fiber for 3D.
- Reuse the primitives in `src/components/motion/` before writing raw GSAP:
  - `Reveal` (scroll entrance, `stagger` prop for children), `Counter` (count-up numbers),
    `Magnetic` (cursor-pull CTAs), `MouseTilt` (3D perspective tilt), `ParallaxLayer`
    (scrub parallax), `DrawLine` (self-drawing lines), `LenisProvider` (already wired
    into the marketing layout).
- Shared motion tokens live in `src/lib/motion.ts` (easing, durations, stagger, reduced-motion check). Import from there; never hardcode easings/durations.

## Motion principles
- Easing: signature curve is `expo.out` / cubic-bezier(0.16, 1, 0.3, 1); never default `ease-in-out`.
- Durations: micro-interactions 150–250ms, element reveals ~650ms, section reveals ~900ms, choreographed scenes ~1200ms.
- Scroll-linked reveals via ScrollTrigger, not just fade-in-on-mount.
- Stagger children (~80ms offset) instead of animating groups as one block.
- Respect `prefers-reduced-motion` — the motion primitives handle this automatically; raw GSAP must check `prefersReducedMotion()` from `src/lib/motion.ts`.

## Visual system
- Brand tokens only (globals.css `@theme`): navy #112E51, navy-deep #0B2138, navy-mid #173A6B, blue #205493, gold #f2c969, bg-light #F4F6F8. Derived tints/alphas allowed; no new hues.
- Fonts: Hanken Grotesk (sans) + Newsreader (serif italic accents). Headings use the serif-italic accent pattern on one key word (gold on navy, blue on light).
- Type scale: fluid `clamp()` sizing — never fixed px headings.
- Spacing: 8px base grid, generous whitespace (agency sites under-fill, not over-fill).
- Depth: dot-grid textures with radial masks, gold/blue glow blobs, gold gradient rims on featured cards — not gradients alone.
- Elevation: consistent shadow scale; gold-tinted shadows for featured/hover states.

## 3D usage
- React Three Fiber for hero/section centerpieces only — not decorative on every page.
- Always lazy-load via `next/dynamic` (`ssr: false`), gate to desktop pointer devices, include a static fallback and reduced-motion skip.

## Anti-patterns to avoid
- Generic centered-hero-with-CTA-button template look
- Uniform card grids with identical shadow/radius and no hierarchy
- Animating everything with the same fade+slide
- Adding framer-motion/motion — the GSAP stack covers everything

## Hard constraints
- Never modify `src/features/itin/**` behavior (schemas, storage keys, mock service, checkout/wizard logic).
- Preserve SEO metadata, JsonLd, compliance copy ("The IRS decides eligibility…").
