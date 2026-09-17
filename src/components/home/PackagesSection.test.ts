import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { packageDefinitions } from "@/server/packages";

const pricingCard = readFileSync(
  new URL("../packages/PricingCard.tsx", import.meta.url),
  "utf8",
);
const packagesSection = readFileSync(
  new URL("./PackagesSection.tsx", import.meta.url),
  "utf8",
);

// Homepage href PackagesSection builds for each package card CTA.
const homepageHref = (slug: string) => `/checkout?package=${slug}`;

describe("homepage package CTA navigation", () => {
  it("renders each package CTA as a real Link, not a nested Button", () => {
    // The CTA must be an actual anchor. A <Link><Button/></Link> produces an
    // invalid <a><button> nesting that the browser splits apart, breaking
    // navigation (the bug this guards against).
    expect(pricingCard).toContain("<Link");
    expect(pricingCard).toContain("href={href}");
    expect(pricingCard).not.toContain("<Button");
    expect(pricingCard).toContain("buttonVariants(");
  });

  it("links homepage cards to the slug-based checkout URL", () => {
    expect(packagesSection).toContain("href={`/checkout?package=${pkg.slug}`}");
  });

  it("loads packages from the marketing catalog helper", () => {
    expect(packagesSection).toContain("getMarketingPackages");
  });

  it("points the New ITIN Application CTA at its checkout URL", () => {
    const pkg = packageDefinitions.find((p) => p.name === "New ITIN Application");
    expect(pkg?.slug).toBe("new-itin-application");
    expect(homepageHref(pkg!.slug)).toBe("/checkout?package=new-itin-application");
  });

  it("points the ITIN Renewal CTA at its checkout URL", () => {
    const pkg = packageDefinitions.find((p) => p.name === "ITIN Renewal");
    expect(pkg?.slug).toBe("itin-renewal");
    expect(homepageHref(pkg!.slug)).toBe("/checkout?package=itin-renewal");
  });
});
