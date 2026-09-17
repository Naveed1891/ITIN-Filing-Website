"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth inertial scroll (marketing pages only).
 * Bridges Lenis into GSAP's ticker so ScrollTrigger stays in sync.
 * No-ops entirely when the user prefers reduced motion.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links (e.g. /#eligibility) should route through Lenis.
    const onHashClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.(
        'a[href^="#"], a[href^="/#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onHashClick);

    return () => {
      document.removeEventListener("click", onHashClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
