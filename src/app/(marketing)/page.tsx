import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PackagesSection } from "@/components/home/PackagesSection";
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
  title: "ITINReady | Get ITIN Ready - Apply for an ITIN Online or Renew",
  description:
    "Get ITIN ready with ITINReady: clear Form W-7 guidance, document checklists and private preparation support for new ITIN applications and ITIN renewals.",
  path: "/",
});

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <PackagesSection />
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
