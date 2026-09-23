"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface OrderItem {
  name: string;
  description: string;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  currency?: string;
}

export function OrderSummary({ items, total, currency = "GBP" }: OrderSummaryProps) {
  const sym = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-bg-light border border-border rounded-card overflow-hidden">
      {/* Mobile toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="md:hidden w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={expanded}
      >
        <span className="text-[14px] font-bold text-navy">
          Order summary
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-extrabold text-navy">
            {sym}{total}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-text-muted transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Content — always visible on md+, conditional on mobile */}
      <div className={cn("md:block", expanded ? "block" : "hidden")}>
        <div className="px-5 pb-5 flex flex-col gap-4">
          <h3 className="hidden md:block text-[14px] font-bold text-text-dark pt-5">
            Order summary
          </h3>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-semibold text-text-dark">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-text-muted">
                    {item.description}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-text-dark flex-shrink-0">
                  {sym}{item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-[14px] font-bold text-text-dark">Total</span>
            <span className="text-[20px] font-extrabold text-navy">{sym}{total}</span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {[
              "Private document-preparation service",
              "Form W-7 and document guidance",
              "IRS outcome not guaranteed",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[12.5px] text-text-mid font-medium"
              >
                <span className="text-blue text-[10px]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
