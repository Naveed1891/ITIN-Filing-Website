import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    heading: "Services",
    links: [
      { label: "New ITIN Application", href: "/packages/new-itin-application" },
      { label: "ITIN Renewal", href: "/packages/itin-renewal" },
      { label: "Check Eligibility", href: "/eligibility" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "ITIN Requirements", href: "/requirements" },
      { label: "Resources", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-navy-deep text-white/70">
      {/* Gold hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(242,201,105,0.45) 50%, transparent)",
        }}
      />
      <div className="site-container py-[clamp(3rem,5vw,4rem)]">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(2rem,3vw,4rem)]">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 sm:gap-5">
            <Link href="/" className="flex self-start items-center">
              <Image
                src="/images/brand/itinfiling-logo.png"
                alt="ITINFiling.com"
                width={4065}
                height={769}
                className="h-auto w-[150px] object-contain"
                sizes="150px"
              />
            </Link>
            <p className="text-[12.5px] sm:text-[13.5px] leading-[1.65] text-white/55 max-w-[280px]">
              Private ITIN document-preparation support with clear Form W-7 and document guidance.
            </p>
            <Link
              href="/contact"
              className="self-start text-[12.5px] font-semibold text-white/60 transition-colors hover:text-gold"
            >
              support@itinfiling.com
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3 sm:gap-4">
              <h3 className="text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/40">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[12.5px] sm:text-[13.5px] text-white/60 hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] sm:text-[12px] text-white/35">
            © {new Date().getFullYear()} ITINFiling.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
