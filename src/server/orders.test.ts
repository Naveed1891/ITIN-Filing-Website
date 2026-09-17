import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const tx = {
  checkoutIntent: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  order: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("./db", () => ({
  prisma: {
    $transaction: vi.fn((callback) => callback(tx)),
  },
}));

describe("paid Stripe session order creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates one paid order and application draft from a paid checkout session", async () => {
    const { createPaidOrderFromCheckoutSession } = await import("./orders");
    tx.checkoutIntent.findUnique.mockResolvedValue({
      id: "intent_1",
      userId: "user_1",
      packageId: "pkg_1",
      amountCents: 22500,
      currency: "USD",
      order: null,
      package: { id: "pkg_1" },
    });
    tx.checkoutIntent.update.mockResolvedValue({
      id: "intent_1",
      userId: "user_1",
      packageId: "pkg_1",
      amountCents: 22500,
      currency: "USD",
    });
    tx.order.findUnique.mockResolvedValue(null);
    tx.order.create.mockResolvedValue({ id: "order_1" });

    const order = await createPaidOrderFromCheckoutSession({
      id: "cs_test_1",
      payment_status: "paid",
      metadata: {
        userId: "user_1",
        packageSlug: "new-itin-application",
        checkoutIntentId: "intent_1",
      },
    } as unknown as Stripe.Checkout.Session);

    expect(order).toEqual({ id: "order_1" });
    expect(tx.order.create).toHaveBeenCalledOnce();
    expect(tx.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        checkoutIntentId: "intent_1",
        status: "PAID",
        amountCents: 22500,
        application: { create: { userId: "user_1", status: "DRAFT", applicationJson: "{}" } },
      }),
    });
  });

  it("does not create a duplicate order when the checkout intent already has one", async () => {
    const { createPaidOrderFromCheckoutSession } = await import("./orders");
    tx.checkoutIntent.findUnique.mockResolvedValue({
      id: "intent_1",
      userId: "user_1",
      order: { id: "order_existing" },
      package: { id: "pkg_1" },
    });

    const order = await createPaidOrderFromCheckoutSession({
      id: "cs_test_1",
      payment_status: "paid",
      metadata: {
        userId: "user_1",
        checkoutIntentId: "intent_1",
      },
    } as unknown as Stripe.Checkout.Session);

    expect(order).toEqual({ id: "order_existing" });
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it("ignores unpaid checkout sessions", async () => {
    const { createPaidOrderFromCheckoutSession } = await import("./orders");

    await expect(createPaidOrderFromCheckoutSession({
      id: "cs_test_1",
      payment_status: "unpaid",
      metadata: {},
    } as unknown as Stripe.Checkout.Session)).resolves.toBeNull();
  });
});
