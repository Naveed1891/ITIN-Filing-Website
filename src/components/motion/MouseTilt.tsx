"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface MouseTiltProps {
  children: ReactNode;
  /** Maximum tilt in degrees. */
  maxTilt?: number;
  /** Gentle idle float (vertical bob) when true. */
  float?: boolean;
  className?: string;
}

/**
 * Perspective 3D tilt that follows the cursor across the viewport,
 * with an optional idle float. Pointer devices only; static under
 * reduced motion and on touch screens.
 */
export function MouseTilt({
  children,
  maxTilt = 6,
  float = true,
  className,
}: MouseTiltProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rotX = gsap.quickTo(inner, "rotationX", { duration: 0.9, ease: "power3.out" });
    const rotY = gsap.quickTo(inner, "rotationY", { duration: 0.9, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1; // -1 … 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      rotY(nx * maxTilt);
      rotX(-ny * maxTilt);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let floatTween: gsap.core.Tween | undefined;
    if (float) {
      floatTween = gsap.to(inner, {
        y: -12,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      floatTween?.kill();
      gsap.killTweensOf(inner);
      gsap.set(inner, { clearProps: "transform" });
    };
  }, [maxTilt, float]);

  return (
    <div ref={wrapRef} className={className} style={{ perspective: "1200px" }}>
      <div ref={innerRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
