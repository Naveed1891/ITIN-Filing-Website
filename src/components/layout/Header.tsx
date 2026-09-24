"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import { AuthNav } from "./AuthNav";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 32));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled
          ? "bg-navy/85 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl supports-[backdrop-filter]:bg-navy/75"
          : "bg-navy",
      )}
    >
      {/* Promo bar — collapses once scrolling starts */}
      <div
        className={cn(
          "overflow-hidden border-b border-white/10 bg-navy-deep transition-[max-height,opacity] duration-300 motion-reduce:transition-none",
          scrolled ? "max-h-0 opacity-0 border-b-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="site-container flex items-center justify-center py-2">
          <span className="text-center text-[11px] font-medium text-white/70 sm:text-[12px]">
            ✦ Private Form W-7 preparation support.{" "}
            <Link
              href="/how-it-works"
              className="font-semibold text-gold underline underline-offset-2 transition-colors hover:text-gold/80"
            >
              Learn how it works →
            </Link>
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="site-container">
        <div
          className={cn(
            "relative flex items-center justify-between gap-6 transition-[height] duration-300 motion-reduce:transition-none",
            scrolled ? "h-12 sm:h-14" : "h-14 sm:h-16",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/brand/itinReadyLogo.png"
              alt="ITINReady"
              width={4032}
              height={719}
              priority
              className="h-auto w-[132px] object-contain sm:w-[160px]"
              sizes="(max-width: 639px) 132px, 160px"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative whitespace-nowrap rounded-btn px-3 py-2 text-[13px] font-semibold text-white/75 transition-colors hover:text-white xl:px-4 xl:text-[14px]"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none xl:inset-x-4"
                />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs — auth-aware */}
          <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
            <AuthNav variant="desktop" />
          </div>

          {/* Mobile hamburger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
