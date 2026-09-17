"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { AuthNav } from "./AuthNav";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/blog" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden text-white p-1 -mr-1 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden absolute top-full left-0 right-0 bg-navy border-t border-white/10 z-50"
        >
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-4 text-[15px] font-semibold text-white/80 hover:text-white hover:bg-white/5 border-b border-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="p-5 flex flex-col gap-3">
                <AuthNav variant="mobile" onNavigate={() => setOpen(false)} />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
