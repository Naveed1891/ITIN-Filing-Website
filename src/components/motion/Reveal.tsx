"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DURATION,
  GSAP_EASE_OUT,
  REVEAL_DISTANCE,
  STAGGER,
  prefersReducedMotion,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Animate direct children individually with a stagger instead of as one block. */
  stagger?: boolean;
  direction?: Direction;
  /** Seconds to delay after the trigger fires. */
  delay?: number;
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
  /** Rendered wrapper element. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

function offsetFor(direction: Direction) {
  switch (direction) {
    case "up":
      return { x: 0, y: REVEAL_DISTANCE };
    case "down":
      return { x: 0, y: -REVEAL_DISTANCE };
    case "left":
      return { x: REVEAL_DISTANCE, y: 0 };
    case "right":
      return { x: -REVEAL_DISTANCE, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Scroll-entrance reveal. Fades + translates children in when they enter
 * the viewport. With `stagger`, each direct child animates 80ms apart.
 * Renders children statically when reduced motion is preferred.
 */
export function Reveal({
  children,
  stagger = false,
  direction = "up",
  delay = 0,
  duration = DURATION.element,
  start = "top 82%",
  as: Tag = "div",
  className,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const targets = stagger ? Array.from(element.children) : [element];
    if (targets.length === 0) return;

    const { x, y } = offsetFor(direction);
    gsap.set(targets, { opacity: 0, x, y });

    const tween = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: GSAP_EASE_OUT,
      stagger: stagger ? STAGGER : 0,
      scrollTrigger: {
        trigger: element,
        start,
        once: true,
      },
      clearProps: "transform",
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(targets, { clearProps: "all" });
    };
  }, [stagger, direction, delay, duration, start]);

  // Cast once: rendered tags are plain HTML elements, so div props are safe.
  const Component = Tag as "div";

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={style}
      id={id}
    >
      {children}
    </Component>
  );
}
