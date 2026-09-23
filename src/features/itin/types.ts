export type CheckoutIntentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "APPLICATION_IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "MORE_INFO_REQUIRED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";
export type ApplicationStatus =
  | "NOT_STARTED"
  | "DRAFT"
  | "SUBMITTED"
  | "NEEDS_CHANGES"
  | "ACCEPTED";

export interface ItinPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceCents: number;
  currency: string;
  features: string[];
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
}

export interface ItinOrder {
  id: string;
  reference: string;
  packageId: string;
  packageSlug: string;
  packageName: string;
  amount: number;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  applicationStatus: ApplicationStatus;
  user?: AuthUser;
  createdAt: string;
}

export interface SubmitApplicationInput {
  orderId: string;
  application: Record<string, unknown>;
  documents: Array<{
    kind: DocumentKind;
    fileName: string;
    size: number;
    mimeType: string;
  }>;
}

export type DocumentKind =
  | "passport"
  | "companyDocuments"
  | "einDocument"
  | "scannedSignature"
  | "previousItinForm";
