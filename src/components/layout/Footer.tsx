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
                src="/images/brand/itinready-logo-v2.png"
                alt="ITINReady"
                width={4168}
                height={839}
                className="h-auto w-[180px] object-contain sm:w-[200px]"
                sizes="(max-width: 639px) 180px, 200px"
              />
            </Link>
            <p className="text-[12.5px] sm:text-[13.5px] leading-[1.65] text-white/55 max-w-[280px]">
              Private ITIN document-preparation support with clear Form W-7 and document guidance.
            </p>
            <Link
              href="/contact"
              className="self-start text-[12.5px] font-semibold text-white/60 transition-colors hover:text-gold"
            >
              support@itinready.com
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
            © {new Date().getFullYear()} ITINReady. All rights reserved.
          </p>
          <div className="flex items-center gap-2" aria-label="ITINReady social media">
            <a
              href="https://www.facebook.com/itinready"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ITINReady on Facebook"
              className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
                <path d="M13.5 22v-9h3l.45-3.5H13.5V7.27c0-1.01.28-1.7 1.73-1.7H17V2.45c-.31-.04-1.37-.13-2.61-.13-2.58 0-4.35 1.58-4.35 4.48v2.7H7.12V13h2.92v9h3.46Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/itinready/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ITINReady on Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
                <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
