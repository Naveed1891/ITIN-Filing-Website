import type { ApplicationStatus, OrderStatus } from "./types";

export interface ApplicationCta {
  label: string;
  href: string;
  variant: "primary" | "outline";
  /** Whether the application is still editable from this CTA. */
  editable: boolean;
}

// Customer still needs to make edits (even if previously submitted).
const NEEDS_CHANGES_APP: ApplicationStatus[] = ["NEEDS_CHANGES"];
const NEEDS_CHANGES_ORDER: OrderStatus[] = ["MORE_INFO_REQUIRED"];

// Submitted / locked — no further editing allowed.
const SUBMITTED_APP: ApplicationStatus[] = ["SUBMITTED", "ACCEPTED"];
const SUBMITTED_ORDER: OrderStatus[] = ["SUBMITTED", "UNDER_REVIEW", "PROCESSING", "COMPLETED"];

/**
 * Status-driven CTA for the order detail page. Never let a submitted/completed
 * application show "Continue Application"; only NEEDS_CHANGES / MORE_INFO_REQUIRED
 * re-open editing.
 */
export function resolveApplicationCta(order: {
  id: string;
  status: OrderStatus;
  applicationStatus: ApplicationStatus;
}): ApplicationCta {
  const { id, status, applicationStatus } = order;

  if (NEEDS_CHANGES_APP.includes(applicationStatus) || NEEDS_CHANGES_ORDER.includes(status)) {
    return { label: "Update Application", href: `/application/${id}`, variant: "primary", editable: true };
  }

  if (SUBMITTED_APP.includes(applicationStatus) || SUBMITTED_ORDER.includes(status)) {
    return { label: "Go Home", href: "/", variant: "primary", editable: false };
  }

  return { label: "Continue Application", href: `/application/${id}`, variant: "primary", editable: true };
}

export function applicationStatusMessage(order: {
  status: OrderStatus;
  applicationStatus: ApplicationStatus;
}): string {
  const { status, applicationStatus } = order;
  if (status === "COMPLETED" || applicationStatus === "ACCEPTED") {
    return "Your ITIN service is complete. There is nothing more to do here.";
  }
  if (applicationStatus === "NEEDS_CHANGES" || status === "MORE_INFO_REQUIRED") {
    return "We need a few updates before we can proceed. Please review and resubmit your application.";
  }
  if (SUBMITTED_APP.includes(applicationStatus) || SUBMITTED_ORDER.includes(status)) {
    return "Your application has been submitted. Our team will review it and follow up with next steps.";
  }
  return "Track your paid ITIN service and continue your application.";
}
