"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  /** Final value to count up to. */
  value: number;
  /** Text before the number, e.g. "$". */
  prefix?: string;
  /** Text after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Decimal places to render. */
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Number that counts up from 0 when scrolled into view.
 * Shows the final value immediately under reduced motion (and during SSR,
 * so there is no layout shift or hydration mismatch).
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = DURATION.scene,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = `${prefix}${state.n.toLocaleString("en-GB", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`;
      },
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
