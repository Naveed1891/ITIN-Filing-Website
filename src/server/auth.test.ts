import { describe, expect, it } from "vitest";
import { hashPassword, normalizeEmail, verifyPassword } from "./auth";

describe("auth security helpers", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("  USER@Example.COM ")).toBe("user@example.com");
  });

  it("hashes and verifies passwords without storing the raw password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).not.toContain("correct horse battery staple");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });
});
