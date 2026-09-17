import { describe, expect, it } from "vitest";
import { errorJson, json } from "./http";

describe("no-store API responses", () => {
  it("json() marks responses no-store (uncacheable)", () => {
    const res = json({ ok: true });
    const cacheControl = res.headers.get("Cache-Control") ?? "";
    expect(cacheControl).toContain("no-store");
    expect(cacheControl).toContain("no-cache");
  });

  it("errorJson() is also no-store and keeps its status", () => {
    const res = errorJson("nope", 401);
    expect(res.status).toBe(401);
    expect(res.headers.get("Cache-Control") ?? "").toContain("no-store");
  });
});
