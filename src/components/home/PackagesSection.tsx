import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion";
import {
  PricingCard,
} from "@/components/packages/PricingCard";
import { getMarketingPackages } from "@/server/marketing-catalog";

export async function PackagesSection() {
  const { packages, source } = await getMarketingPackages();

  return (
    <SectionContainer id="packages" className="bg-bg-light">
      <div className="section-stack">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title={
              <>
                Choose your{" "}
                <em className="font-serif font-bold italic text-blue">
                  package
                </em>
              </>
            }
            subtitle="Private Form W-7 preparation options with clear scope and one-time pricing."
          />
        </Reveal>

        {packages.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            Packages are temporarily unavailable. Please try again shortly.
          </p>
        ) : (
          <Reveal
            stagger
            className="mx-auto grid w-full max-w-[1040px] grid-cols-1 items-stretch gap-[clamp(1.5rem,2.5vw,2.5rem)] pt-4 lg:grid-cols-2"
          >
            {packages.map((pkg) => (
              <PricingCard
                key={pkg.slug}
                pkg={pkg}
                href={`/checkout?package=${pkg.slug}`}
              />
            ))}
          </Reveal>
        )}

        <p className="text-center text-[12.5px] sm:text-[13px] text-text-muted">
          ITINFiling.com is a private preparation service. The IRS determines
          eligibility, processing time, and issuance.
          {source === "fallback"
            ? " Showing standard published pricing while live catalog reconnects."
            : null}
        </p>
      </div>
    </SectionContainer>
  );
}
