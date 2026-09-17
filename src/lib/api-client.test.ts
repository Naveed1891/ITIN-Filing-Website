import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api-client";

describe("apiFetch caching", () => {
  afterEach(() => vi.restoreAllMocks());

  it("sends cache: no-store so auth/order/checkout data is never reused", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ user: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/api/auth/me");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.cache).toBe("no-store");
  });
});
