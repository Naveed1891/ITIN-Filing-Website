"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Check eligibility",
    description:
      "Answer four quick questions to confirm you qualify for an ITIN before you pay a cent.",
  },
  {
    number: "02",
    title: "Choose a package",
    description:
      "Select preparation support for a new ITIN application or an ITIN renewal.",
  },
  {
    number: "03",
    title: "Upload documents",
    description:
      "Securely upload your passport or accepted ID. We'll guide you through exactly what's needed.",
  },
  {
    number: "04",
    title: "Review the package",
    description:
      "Check Form W-7 entries and the document checklist for consistency before submission.",
  },
  {
    number: "05",
    title: "IRS submission",
    description:
      "Use an IRS-approved mail or in-person method. IRS timing is an estimate, not a guarantee.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const rail = railRef.current;
    if (!section || !list || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");

      // Steps rest dimmed; the one in the reading zone lights up.
      items.forEach((item) => {
        gsap.set(item, { opacity: 0.4 });
        ScrollTrigger.create({
          trigger: item,
          start: "top 68%",
          end: "bottom 35%",
          onToggle: (self) => {
            gsap.to(item, {
              opacity: self.isActive ? 1 : 0.4,
              x: self.isActive ? 0 : -6,
              duration: 0.45,
              ease: "power2.out",
            });
          },
        });
      });

      // Gold rail draws down alongside the steps.
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 0.6,
            },
          },
        );
      }
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-padding bg-bg-light"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)]">
          {/* Sticky intro column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex flex-col items-start gap-5">
              <SectionHeading
                eyebrow="The process"
                title={
                  <>
                    How it{" "}
                    <em className="font-serif font-bold italic text-blue">
                      works
                    </em>
                  </>
                }
                subtitle="Five steps from application to your ITIN, with expert support throughout."
                align="left"
              />
              <Link href="/packages">
                <Button variant="primary" size="md">
                  Start step one →
                </Button>
              </Link>
            </div>
          </div>

          {/* Steps rail */}
          <div className="relative">
            {/* Base rail + gold draw line */}
            <div
              aria-hidden
              className="absolute bottom-6 left-[19px] top-6 hidden w-px bg-border-mid sm:block"
            />
            <div
              ref={railRef}
              aria-hidden
              className="absolute bottom-6 left-[19px] top-6 hidden w-px bg-gold sm:block"
            />

            <ol ref={listRef} className="flex flex-col gap-[clamp(2rem,3.5vw,3.25rem)]">
              {steps.map((step) => (
                <li
                  key={step.number}
                  data-step
                  className="relative flex gap-5 sm:gap-7"
                >
                  <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy shadow-[0_8px_20px_-8px_rgba(17,46,81,0.5)]">
                    <span className="font-mono text-[11px] font-bold text-gold">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5 pt-1.5">
                    <h3 className="text-[16px] font-bold leading-[1.25] text-text-dark sm:text-[18px]">
                      {step.title}
                    </h3>
                    <p className="max-w-[52ch] text-[13.5px] leading-[1.65] text-text-mid sm:text-[14.5px]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
