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
      price: 99.9,
      priceCents: 9990,
      currency: "USD",
    });
  });
});
