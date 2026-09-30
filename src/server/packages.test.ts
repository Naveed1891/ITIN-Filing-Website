import { describe, expect, it } from "vitest";
import {
  findPublishedPackage,
  packageDefinitions,
  serializePackageDefinition,
} from "./packages";

describe("trusted package data", () => {
  it("contains the required checkout package slugs", () => {
    expect(packageDefinitions.map((pkg) => pkg.slug)).toEqual([
      "new-itin-application",
      "itin-renewal",
    ]);
  });

  it("returns only published package data by slug", () => {
    const pkg = findPublishedPackage("new-itin-application");

    expect(pkg?.name).toBe("New ITIN Application");
    expect(findPublishedPackage("not-a-real-package")).toBeNull();
  });

  it("serializes trusted server-side price data", () => {
    const pkg = findPublishedPackage("itin-renewal");
    expect(pkg).not.toBeNull();

    expect(serializePackageDefinition(pkg!)).toMatchObject({
      slug: "itin-renewal",
      price: 99,
      priceCents: 9900,
      currency: "USD",
    });
  });

  it("prices both public packages at exactly $99", () => {
    expect(packageDefinitions).toHaveLength(2);
    expect(packageDefinitions.every((pkg) => pkg.priceCents === 9900)).toBe(true);
    expect(packageDefinitions.every((pkg) => pkg.salePriceCents == null)).toBe(true);
  });
});
