"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface DrawLineProps {
  /** Draw direction: "x" scales horizontally, "y" vertically. */
  axis?: "x" | "y";
  /** Style the line (color, size, position) via className. */
  className?: string;
}

/**
 * A line that "draws itself" as the user scrolls, scrubbed to scroll
 * progress of its parent element. Fully drawn under reduced motion.
 */
export function DrawLine({ axis = "x", className }: DrawLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const property = axis === "x" ? "scaleX" : "scaleY";
    gsap.set(element, {
      [property]: 0,
      transformOrigin: axis === "x" ? "left center" : "top center",
    });

    const tween = gsap.to(element, {
      [property]: 1,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement ?? element,
        start: "top 72%",
        end: "bottom 48%",
        scrub: 0.6,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(element, { clearProps: "transform" });
    };
  }, [axis]);

  return <div ref={ref} aria-hidden className={className} />;
}
