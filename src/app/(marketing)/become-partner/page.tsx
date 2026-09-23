import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion";
import { PartnerForm } from "@/components/partner/PartnerForm";
import { createMetadata } from "@/lib/seo";
import { DollarSign, Zap, Globe, HeadphonesIcon, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "Become a Partner | ITIN Filing Partnership Programme",
  description:
    "Partner with ITINReady for volume ITIN filing preparation. Competitive pricing, dedicated support and fast turnaround for accountants, advisors and agents.",
  path: "/become-partner",
});

const benefits = [
  { Icon: DollarSign, title: "Volume pricing", text: "Competitive rates for partners with recurring ITIN filing needs." },
  { Icon: Zap, title: "Fast turnaround", text: "Priority processing and dedicated account management." },
  { Icon: Globe, title: "Global coverage", text: "Support for clients in any country needing a U.S. ITIN." },
  { Icon: HeadphonesIcon, title: "Dedicated support", text: "A named point of contact for all partner queries." },
  { Icon: Users, title: "White-label options", text: "Co-branded service options for your client base." },
  { Icon: ShieldCheck, title: "Compliance assurance", text: "Up-to-date IRS guidance and secure document handling." },
];

const steps = [
  { step: "1", title: "Tell us about your business", text: "Fill in the partnership enquiry form below." },
  { step: "2", title: "Partnership call", text: "Our team will schedule a brief call to discuss your needs." },
  { step: "3", title: "Onboarding", text: "We set up your partner account with dedicated pricing." },
  { step: "4", title: "Start filing", text: "Begin submitting ITIN applications for your clients." },
];

export default function BecomePartnerPage() {
  return (
    <>
      <section
        className="relative isolate overflow-hidden px-5 py-16 md:px-10"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
          }}
        />
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <SectionHeading
              eyebrow="Partnerships"
              title={<>Become a <em className="font-serif italic text-gold">partner</em></>}
              subtitle="Join our partnership programme and offer ITIN filing preparation to your clients with competitive pricing, priority processing and dedicated support."
              align="center"
              light
            />
          </Reveal>
        </div>
      </section>

      <SectionContainer className="py-12 md:py-16">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold text-text-dark">
            Why partner with us?
          </h2>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-[1080px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, title, text }) => (
            <Reveal key={title} delay={0.05}>
              <div className="rounded-[14px] border border-border bg-white p-5 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue/10 text-blue">
                  <Icon size={20} />
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-text-dark">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-text-mid">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="border-t border-border bg-bg-light py-12 md:py-16">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold text-text-dark">
            How it works
          </h2>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, text }) => (
            <Reveal key={step} delay={0.05}>
              <div className="flex flex-col items-center text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-navy text-lg font-extrabold text-gold">
                  {step}
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-text-dark">{title}</h3>
                <p className="mt-1 text-sm text-text-mid">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="partner-form" className="py-12 md:py-16">
        <div className="mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <div className="rounded-[18px] border border-border bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-xl font-extrabold text-text-dark">Partnership enquiry</h2>
              <p className="mt-1 text-sm text-text-mid">
                Tell us about your business and how we can work together.
              </p>
              <PartnerForm />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[14px] border border-border bg-bg-light p-5">
              <h3 className="text-sm font-extrabold text-text-dark">Ideal partners</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-mid">
                <li>Accountancy & bookkeeping firms</li>
                <li>Company formation agents</li>
                <li>Law firms & solicitors</li>
                <li>Corporate service providers</li>
                <li>Business consultancies & advisors</li>
                <li>Banks & financial institutions</li>
              </ul>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs text-text-muted">
                  Prefer email? Contact us at{" "}
                  <a href="mailto:support@itinfiling.com" className="font-semibold text-blue hover:underline">
                    support@itinfiling.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionContainer>
    </>
  );
}
