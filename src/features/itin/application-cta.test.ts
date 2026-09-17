import { describe, expect, it } from "vitest";
import { applicationStatusMessage, resolveApplicationCta } from "./application-cta";
import type { ApplicationStatus, OrderStatus } from "./types";

const order = (status: OrderStatus, applicationStatus: ApplicationStatus) => ({
  id: "order_1",
  status,
  applicationStatus,
});

describe("resolveApplicationCta", () => {
  it("shows Continue Application for draft / in-progress", () => {
    expect(resolveApplicationCta(order("PAID", "DRAFT")).label).toBe("Continue Application");
    expect(resolveApplicationCta(order("APPLICATION_IN_PROGRESS", "DRAFT")).label).toBe("Continue Application");
    expect(resolveApplicationCta(order("PAID", "NOT_STARTED")).href).toBe("/application/order_1");
  });

  it("shows Go Home for submitted / completed / locked states", () => {
    for (const s of ["SUBMITTED", "UNDER_REVIEW", "PROCESSING", "COMPLETED"] as OrderStatus[]) {
      const cta = resolveApplicationCta(order(s, "SUBMITTED"));
      expect(cta.label).toBe("Go Home");
      expect(cta.href).toBe("/");
      expect(cta.editable).toBe(false);
    }
    expect(resolveApplicationCta(order("PAID", "ACCEPTED")).label).toBe("Go Home");
    expect(resolveApplicationCta(order("SUBMITTED", "SUBMITTED")).label).not.toBe("Continue Application");
  });

  it("shows Update Application for needs-changes states", () => {
    expect(resolveApplicationCta(order("PAID", "NEEDS_CHANGES")).label).toBe("Update Application");
    expect(resolveApplicationCta(order("MORE_INFO_REQUIRED", "SUBMITTED")).label).toBe("Update Application");
    expect(resolveApplicationCta(order("MORE_INFO_REQUIRED", "SUBMITTED")).editable).toBe(true);
  });

  it("uses non-continue copy for submitted and completed orders", () => {
    expect(applicationStatusMessage(order("COMPLETED", "ACCEPTED")).toLowerCase()).toContain("complete");
    expect(applicationStatusMessage(order("SUBMITTED", "SUBMITTED")).toLowerCase()).toContain("submitted");
    expect(applicationStatusMessage(order("SUBMITTED", "SUBMITTED"))).not.toContain("continue");
  });
});
