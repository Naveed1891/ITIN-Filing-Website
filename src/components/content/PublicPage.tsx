import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "./Breadcrumbs";
import { Reveal } from "@/components/motion";
import type { PublicPageData } from "@/content/public-pages";

export function PublicPage({ page }: { page: PublicPageData }) {
  const primaryCta = page.primaryCta ?? {
    label: "View ITIN packages",
    href: "/packages",
  };
  const secondaryCta = page.secondaryCta ?? {
    label: "Check eligibility",
    href: "/eligibility",
  };
  const primaryIsExternal = /^https?:\/\//.test(primaryCta.href);
  const secondaryIsExternal = /^https?:\/\//.test(secondaryCta.href);

  return (
    <>
      <section
        className="relative isolate overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.35), transparent 55%), #112E51",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(70% 100% at 30% 40%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(70% 100% at 30% 40%, black 30%, transparent 100%)",
          }}
        />
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: page.title }]}
        />
        <div className="site-container pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(2rem,4vw,3rem)]">
          <Reveal stagger className="max-w-[960px]">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">
              {page.eyebrow}
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
              {page.title}
            </h1>
            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.7] text-white/70 sm:text-[17px]">
              {page.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto w-full max-w-[820px] px-4 md:px-6 lg:px-8">
          <div className="space-y-12">
            {page.sections.map((section) => (
              <Reveal
                as="section"
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <h2 className="text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold leading-tight text-text-dark">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] leading-[1.75] text-text-mid sm:text-[16px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-[1.65] text-text-dark sm:text-[16px]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}

            {page.faqs && (
              <section aria-labelledby="page-faq-title">
                <h2
                  id="page-faq-title"
                  className="text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold text-text-dark"
                >
                  Frequently asked questions
                </h2>
                <div className="mt-5 space-y-3">
                  {page.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-[14px] border border-border bg-bg-light p-5"
                    >
                      <summary className="cursor-pointer list-none pr-8 font-semibold text-text-dark marker:hidden">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-[15px] leading-[1.7] text-text-mid">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {page.sources && (
              <section className="rounded-card border border-border bg-bg-light p-5 sm:p-6">
                <h2 className="text-[15px] font-bold text-text-dark">
                  Official sources
                </h2>
                <ul className="mt-3 space-y-2">
                  {page.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[14px] font-semibold text-blue hover:underline"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg-light">
        <Reveal className="site-container flex flex-col items-center gap-5 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-text-dark">
            Ready for the{" "}
            <em className="font-serif font-bold italic text-blue">
              next step
            </em>
            ?
          </h2>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {primaryIsExternal ? (
              <a href={primaryCta.href} target="_blank" rel="noreferrer">
                <Button variant="primary" size="lg" fullWidth>
                  {primaryCta.label}
                </Button>
              </a>
            ) : (
              <Link href={primaryCta.href}>
                <Button variant="primary" size="lg" fullWidth>
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryIsExternal ? (
              <a href={secondaryCta.href} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" fullWidth>
                  {secondaryCta.label}
                </Button>
              </a>
            ) : (
              <Link href={secondaryCta.href}>
                <Button variant="outline" size="lg" fullWidth>
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
