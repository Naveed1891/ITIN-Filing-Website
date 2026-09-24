"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/motion/Magnetic";
import { MouseTilt } from "@/components/motion/MouseTilt";
import { GSAP_EASE_OUT, prefersReducedMotion } from "@/lib/motion";
import { HeroDocumentVisual } from "./HeroDocumentVisual";

const HeroParticles = dynamic(() => import("./HeroParticles"), {
  ssr: false,
});

const HEADLINE: Array<{ text: string; accent?: boolean }> = [
  { text: "Prepare" },
  { text: "your" },
  { text: "ITIN" },
  { text: "application", accent: true },
  { text: "-" },
  { text: "with" },
  { text: "clear" },
  { text: "guidance" },
];

const TRUST_ITEMS = [
  "Federal tax purpose",
  "Form W-7 guidance",
  "Document checklist",
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showParticles, setShowParticles] = useState(false);

  // Gate the WebGL layer: desktop pointer devices, no reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const timer = window.setTimeout(() => setShowParticles(desktop.matches), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Entrance choreography.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const words = section.querySelectorAll("[data-hero-word]");
      const items = section.querySelectorAll("[data-hero-item]");
      const visual = section.querySelector("[data-hero-visual]");

      gsap.set(words, { yPercent: 115 });
      gsap.set(items, { opacity: 0, y: 22 });
      if (visual) gsap.set(visual, { opacity: 0, y: 40, scale: 0.97 });

      const timeline = gsap.timeline({ defaults: { ease: GSAP_EASE_OUT } });
      timeline
        .to(words, { yPercent: 0, duration: 0.95, stagger: 0.055 }, 0.15)
        .to(items, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 }, 0.55);
      if (visual) {
        timeline.to(
          visual,
          { opacity: 1, y: 0, scale: 1, duration: 1.1 },
          0.45,
        );
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51",
      }}
    >
      {/* Depth layers */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(90% 80% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(90% 80% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-40 right-[10%] -z-10 h-[34rem] w-[34rem] rounded-full bg-gold/[0.07] blur-[130px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-56 -left-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-blue/20 blur-[120px]"
      />
      {showParticles && <HeroParticles />}

      <div className="site-container flex min-h-[calc(100svh-7.5rem)] items-center py-[clamp(3.5rem,6vw,5.5rem)]">
        <div className="grid w-full grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)] md:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
          <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-7">
            <div data-hero-item className="self-start">
              <Badge variant="gold">✦ Form W-7 preparation support</Badge>
            </div>

            <h1 className="text-[clamp(2rem,4vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white">
              {HEADLINE.map((word, index) => (
                <span
                  key={`${word.text}-${index}`}
                  className="inline-block overflow-hidden pb-[0.08em] align-top"
                >
                  <span
                    data-hero-word
                    className={
                      word.accent
                        ? "inline-block font-serif font-bold italic text-gold"
                        : "inline-block"
                    }
                  >
                    {word.text}
                    {index < HEADLINE.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-hero-item
              className="reading-width text-[14px] leading-[1.65] text-white/70 sm:text-[15px] lg:text-[17px]"
            >
              Organize Form W-7 information and supporting documents with
              practical preparation guidance. The IRS decides eligibility,
              assignment, and processing time.
            </p>

            <div data-hero-item className="flex flex-wrap gap-3 pt-1">
              <Magnetic>
                <Link href="/packages">
                  <Button variant="primary" size="lg">
                    Get started - $99.9
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link href="/eligibility">
                  <Button variant="ghost" size="lg" className="text-white/85 hover:bg-white/10 hover:text-white">
                    Check if you&apos;re eligible →
                  </Button>
                </Link>
              </Magnetic>
            </div>

            <div
              data-hero-item
              className="flex flex-wrap items-center gap-4 pt-1 sm:gap-6"
            >
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-white/50 sm:text-[13px]"
                >
                  <span className="text-[10px] text-gold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div data-hero-visual className="min-w-0">
            <MouseTilt maxTilt={5}>
              <HeroDocumentVisual />
            </MouseTilt>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          Scroll
        </span>
        <span className="relative h-8 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-3 animate-[hero-scroll-cue_1.8s_ease-in-out_infinite] bg-gold/80" />
        </span>
      </div>
    </section>
  );
}
