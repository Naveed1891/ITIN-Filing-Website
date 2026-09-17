"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  children: ReactNode;
  /**
   * Parallax intensity. Positive values lag behind the scroll (background
   * feel), negative values move ahead (foreground feel). 0.15–0.4 is subtle;
   * beyond 0.6 reads as decorative.
   */
  speed?: number;
  className?: string;
}

/**
 * Scrub-linked vertical parallax. The layer translates proportionally to
 * scroll progress while its container is in view. Static under reduced motion.
 */
export function ParallaxLayer({
  children,
  speed = 0.25,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const distance = 120 * speed;

    const tween = gsap.fromTo(
      element,
      { y: distance },
      {
        y: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement ?? element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(element, { clearProps: "transform" });
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
