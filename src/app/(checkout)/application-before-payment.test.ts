import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("application before payment flow", () => {
  const startRoute = read("../api/checkout/start-application/route.ts");
  const applicationPage = read("../(portal)/application/[orderId]/page.tsx");
  const submitRoute = read("../api/applications/[orderId]/submit/route.ts");
  const paymentPage = read("./payment/[orderId]/page.tsx");
  const bankTransferRoute = read("../api/checkout/bank-transfer/route.ts");
  const adminStatusRoute = read("../api/admin/orders/[id]/status/route.ts");

  it("creates an application-in-progress order before collecting payment", () => {
    expect(startRoute).toContain('status: "APPLICATION_IN_PROGRESS"');
    expect(startRoute).toContain('status: "NOT_STARTED"');
    expect(startRoute).toContain('applicationJson: "{}"');
  });

  it("sends a completed application to its order-specific payment page", () => {
    expect(applicationPage).toContain("window.location.assign(`/payment/${params.orderId}`)");
    expect(paymentPage).toContain('applicationStatus !== "SUBMITTED"');
    expect(paymentPage).toContain('"/api/checkout/bank-transfer"');
  });

  it("keeps unpaid submissions pending and attaches proof to the existing order", () => {
    expect(submitRoute).toContain('order.checkoutIntent.status === "PAID" ? "SUBMITTED" : "PENDING_PAYMENT"');
    expect(bankTransferRoute).toContain("orderId: z.string()");
    expect(bankTransferRoute).toContain("Submit the application before payment.");
    expect(bankTransferRoute).toContain("checkoutIntentId: order.checkoutIntentId");
    expect(bankTransferRoute).not.toContain("tx.order.create");
  });

  it("blocks processing statuses until payment is confirmed", () => {
    expect(adminStatusRoute).toContain('order.checkoutIntent.status !== "PAID"');
    expect(adminStatusRoute).toContain("Payment must be confirmed before this order can be processed.");
  });
});
