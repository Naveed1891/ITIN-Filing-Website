import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const signupRoute = read("../api/auth/signup/route.ts");
const loginRoute = read("../api/auth/login/route.ts");
const signupPage = read("./signup/page.tsx");
const loginPage = read("./login/page.tsx");

describe("signup auto-login flow", () => {
  it("creates a server session on signup, just like login", () => {
    // Signup must establish the session cookie so the user is authenticated
    // immediately and never has to log in again after account creation.
    expect(signupRoute).toContain("createSession(user.id)");
    expect(loginRoute).toContain("createSession(user.id)");
    expect(signupRoute).toContain("201");
  });

  it("redirects to the preserved returnTo after signup", () => {
    expect(signupPage).toContain("router.push(returnTo)");
    expect(signupPage).toContain("router.refresh()");
  });

  it("validates returnTo through safeReturnTo on both auth pages", () => {
    expect(signupPage).toContain("safeReturnTo(");
    expect(loginPage).toContain("safeReturnTo(");
  });

  it("gives inline feedback when passwords do not match", () => {
    expect(signupPage).toContain("Passwords do not match.");
    expect(signupPage).toContain("fieldErrors.confirmPassword");
  });
});
