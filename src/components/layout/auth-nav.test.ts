import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const authNav = read("./AuthNav.tsx");
const header = read("./Header.tsx");
const mobileNav = read("./MobileNav.tsx");

describe("auth-aware header navigation", () => {
  it("resolves the session from /api/auth/me and re-checks on route change", () => {
    expect(authNav).toContain('apiFetch<{ user: AuthUser | null }>("/api/auth/me")');
    expect(authNav).toContain("usePathname()");
    expect(authNav).toContain("}, [pathname]);");
  });

  it("passes returnTo for the current page when opening login from the website", () => {
    expect(authNav).toContain("websiteLoginHref");
    expect(authNav).toContain("useSearchParams");
    expect(authNav).toContain("<Suspense");
  });

  it("shows Login + Get Started only when logged out", () => {
    expect(authNav).toContain("Login");
    expect(authNav).toContain("Get Started");
  });

  it("shows authenticated actions (Dashboard + My Orders + Log out) when logged in", () => {
    expect(authNav).toContain("Dashboard");
    expect(authNav).toContain("My Orders");
    expect(authNav).toContain("Log out");
    expect(authNav).toContain('customerDashboardUrl("/dashboard")');
    expect(authNav).toContain('customerDashboardUrl("/dashboard/orders")');
  });

  it("logs out via the API then refreshes auth-sensitive UI", () => {
    expect(authNav).toContain('apiFetch("/api/auth/logout", { method: "POST" })');
    expect(authNav).toContain("router.refresh()");
  });

  it("avoids flashing the wrong state while the session is resolving", () => {
    expect(authNav).toContain("user === undefined");
    expect(authNav).toContain("animate-pulse");
  });

  it("Header and MobileNav delegate their CTAs to AuthNav (no hard-coded Login)", () => {
    expect(header).toContain('<AuthNav variant="desktop" />');
    expect(mobileNav).toContain('variant="mobile"');
    expect(header).not.toContain('href="/login"');
    expect(mobileNav).not.toContain('href="/login"');
  });
});
