"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Magnetic hover: the wrapped element is gently pulled toward the cursor
 * and springs back on leave. Pointer devices only; inert under reduced
 * motion and on touch screens.
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const onLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.35)",
      });
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(element);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
