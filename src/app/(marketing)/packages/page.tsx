import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion";
import {
  PricingCard,
} from "@/components/packages/PricingCard";
import { createMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { getMarketingPackages } from "@/server/marketing-catalog";

export const metadata: Metadata = createMetadata({
  title: "ITIN Application and Renewal Packages",
  description:
    "Compare private preparation packages for a new ITIN application or ITIN renewal, including Form W-7 guidance and document review.",
  path: "/packages",
});

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const { packages, source } = await getMarketingPackages();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "ITIN application document-preparation service",
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          serviceType: "ITIN application document preparation",
          url: `${SITE_URL}/packages`,
        }}
      />
      <section
        className="relative isolate overflow-hidden py-16 px-5 md:px-10"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51",
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
              "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
          }}
        />
        <div className="max-w-[1180px] mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title={
                <>
                  Choose your ITIN{" "}
                  <em className="font-serif font-bold italic text-gold">
                    package
                  </em>
                </>
              }
              subtitle="Private Form W-7 preparation options with clear scope and one-time pricing."
              light
              as="h1"
            />
          </Reveal>
        </div>
      </section>

      <SectionContainer className="bg-bg-light">
        {packages.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
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
                href={`/packages/${pkg.slug}`}
              />
            ))}
          </Reveal>
        )}
        {source === "fallback" ? (
          <p className="mt-6 text-center text-xs text-text-muted">
            Showing standard published pricing while live catalog reconnects.
          </p>
        ) : null}
      </SectionContainer>
    </>
  );
}
