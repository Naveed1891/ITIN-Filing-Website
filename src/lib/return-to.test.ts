import { describe, expect, it } from "vitest";
import { DEFAULT_RETURN_TO, safeReturnTo, websiteLoginHref } from "./return-to";

describe("safeReturnTo", () => {
  it("keeps internal absolute paths, incl. the selected checkout package", () => {
    expect(safeReturnTo("/checkout?package=new-itin-application")).toBe(
      "/checkout?package=new-itin-application",
    );
    expect(safeReturnTo("/checkout?package=itin-renewal")).toBe(
      "/checkout?package=itin-renewal",
    );
    expect(safeReturnTo("/packages")).toBe("/packages");
  });

  it("falls back to home when returnTo is missing", () => {
    expect(safeReturnTo(null)).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo(undefined)).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("")).toBe(DEFAULT_RETURN_TO);
    expect(DEFAULT_RETURN_TO).toBe("/");
  });

  it("rejects external and open-redirect targets", () => {
    expect(safeReturnTo("https://evil.com")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("http://evil.com/checkout")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("//evil.com")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("/\\evil.com")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("evil.com")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("javascript:alert(1)")).toBe(DEFAULT_RETURN_TO);
  });

  it("rejects auth pages as redirect targets to avoid login loops", () => {
    expect(safeReturnTo("/login")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("/signup")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("/login?returnTo=/orders")).toBe(DEFAULT_RETURN_TO);
  });

  it("rejects legacy /orders paths that redirect to the external customer dashboard", () => {
    expect(safeReturnTo("/orders")).toBe(DEFAULT_RETURN_TO);
    expect(safeReturnTo("/orders/abc123")).toBe(DEFAULT_RETURN_TO);
  });

  it("honors a custom fallback", () => {
    expect(safeReturnTo("https://evil.com", "/checkout")).toBe("/checkout");
    expect(safeReturnTo("", "")).toBe("");
  });
});

describe("websiteLoginHref", () => {
  it("returns plain /login from the home page", () => {
    expect(websiteLoginHref("/")).toBe("/login");
  });

  it("preserves the current website page as returnTo", () => {
    expect(websiteLoginHref("/packages")).toBe("/login?returnTo=%2Fpackages");
    expect(websiteLoginHref("/checkout", "?package=standard")).toBe(
      "/login?returnTo=%2Fcheckout%3Fpackage%3Dstandard",
    );
  });
});
