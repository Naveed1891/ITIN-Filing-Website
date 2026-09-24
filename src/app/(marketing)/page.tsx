import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PackagesSection } from "@/components/home/PackagesSection";
import { CaaExplainerSection } from "@/components/home/CaaExplainerSection";
import { WhatIsItin } from "@/components/home/WhatIsItin";
import { WhoNeedsItin } from "@/components/home/WhoNeedsItin";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ExpertReview } from "@/components/home/ExpertReview";
import { Timeline } from "@/components/home/Timeline";
import { FaqSection } from "@/components/home/FaqSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Apply for an ITIN Online | Form W-7 Help | ITINReady",
  description:
    "Apply for an ITIN online with Form W-7 preparation, document review and ITIN renewal support for non-US residents, spouses, dependents and taxpayers.",
  path: "/",
  keywords: [
    "apply for an ITIN online",
    "ITIN application",
    "Form W-7",
    "ITIN number application",
    "ITIN renewal",
    "ITIN requirements",
    "ITIN documents",
    "ITIN for non-US residents",
    "ITIN processing time",
    "Certified Acceptance Agent",
  ],
});

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <PackagesSection />
      <CaaExplainerSection />
      <WhatIsItin />
      <WhoNeedsItin />
      <WhyChooseUs />
      <ExpertReview />
      <Timeline />
      <FaqSection />
      <ResourcesSection />
      <FinalCta />
    </>
  );
}
