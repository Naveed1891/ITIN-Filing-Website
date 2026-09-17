/**
 * Shared motion design tokens.
 * Single source of truth for easing, durations, and reduced-motion checks —
 * every animation primitive imports from here so the site moves as one system.
 */

/** Signature ease — fast start, long luxurious settle. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** GSAP-format equivalents (CustomEase-free, using built-in approximations). */
export const GSAP_EASE_OUT = "expo.out";
export const GSAP_EASE_IN_OUT = "power3.inOut";

export const DURATION = {
  /** Hover, press, focus. */
  micro: 0.2,
  /** Element entrances. */
  element: 0.65,
  /** Section reveals. */
  section: 0.9,
  /** Large choreographed sequences. */
  scene: 1.2,
} as const;

/** Stagger offset between sibling reveals, in seconds. */
export const STAGGER = 0.08;

/** Default distance (px) elements travel during entrance reveals. */
export const REVEAL_DISTANCE = 28;

/**
 * True when the user prefers reduced motion.
 * Safe to call anywhere; returns false during SSR.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
