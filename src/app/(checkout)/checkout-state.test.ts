import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const checkoutPage = read("./checkout/page.tsx");
const meRoute = read("../api/auth/me/route.ts");
const ordersRoute = read("../api/orders/route.ts");
const logoutRoute = read("../api/auth/logout/route.ts");

describe("checkout state is derived from URL + session only", () => {
  it("computes the step from selectedPackage + authenticated user, not storage", () => {
    expect(checkoutPage).toContain("const selectedIndex = !selectedPackage ? 0 : user ? 2 : 1;");
    expect(checkoutPage).not.toContain("localStorage");
    expect(checkoutPage).not.toContain("sessionStorage");
  });

  it("only shows Payment review when a user is authenticated", () => {
    // Review renders solely on (selectedPackage && user); logged-out users get
    // the Sign in / Create account summary instead.
    expect(checkoutPage).toContain("selectedPackage && user ? (");
    expect(checkoutPage).toContain("customer={user}");
  });

  it("takes customer details from the session (/api/auth/me), not old orders", () => {
    expect(checkoutPage).toContain('apiFetch<{ user: AuthUser | null }>("/api/auth/me")');
    expect(checkoutPage).not.toContain("currentOrder");
    expect(checkoutPage).not.toContain("lastOrder");
  });

  it("marks user-specific API routes as dynamic and logout clears the session", () => {
    expect(meRoute).toContain('export const dynamic = "force-dynamic";');
    expect(ordersRoute).toContain('export const dynamic = "force-dynamic";');
    expect(logoutRoute).toContain("clearSession()");
  });
});
