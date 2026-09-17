"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion";
import type { FaqItem } from "@/types";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <Reveal
      stagger
      className="mx-auto flex w-full max-w-[960px] flex-col gap-3 sm:gap-3.5"
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_10px_28px_-24px_rgba(13,58,43,0.45)] transition-[border-color,box-shadow] duration-200 focus-within:border-blue/35 focus-within:shadow-[0_14px_34px_-24px_rgba(13,58,43,0.5)]"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none sm:px-6"
            >
              <span
                className={cn(
                  "text-[15px] font-semibold leading-[1.45] transition-colors sm:text-[16px]",
                  isOpen ? "text-navy" : "text-text-dark group-hover:text-navy"
                )}
              >
                {item.question}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg-light text-[18px] font-medium leading-none text-text-muted transition-[background-color,border-color,color,transform] duration-300 ease-out motion-reduce:transition-none",
                  isOpen && "rotate-45 border-navy bg-navy text-gold"
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pr-14 text-[14px] leading-[1.7] text-text-mid sm:px-6 sm:pb-6 sm:pr-16 sm:text-[15px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
