import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("canonical host proxy", () => {
  it("redirects www URLs to the same path and query on the apex domain", () => {
    const request = new NextRequest("https://www.itinready.com/blog/apply?source=search");
    const response = proxy(request);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://itinready.com/blog/apply?source=search",
    );
  });

  it("uses the forwarded host supplied by the production proxy", () => {
    const request = new NextRequest("http://localhost:3000/requirements", {
      headers: { "x-forwarded-host": "www.itinready.com" },
    });
    const response = proxy(request);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://itinready.com/requirements");
  });

  it("does not redirect the canonical host", () => {
    const request = new NextRequest("https://itinready.com/");
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
