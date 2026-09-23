import { z } from "zod";
import { firstPasswordError } from "@/lib/password";

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z.email("Enter a valid email address."),
  whatsapp: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, "Enter a WhatsApp number with country code."),
  country: z.string().trim().min(1, "Country is required."),
  password: z.string().min(1, "Create a password."),
  confirmPassword: z.string().min(1, "Confirm your password."),
  termsAccepted: z.boolean().refine(Boolean, "You must accept the terms."),
}).superRefine((value, ctx) => {
  // Shared password policy — identical to the client checklist (src/lib/password).
  const passwordError = firstPasswordError(value.password, {
    email: value.email,
    name: value.fullName,
  });
  if (passwordError) {
    ctx.addIssue({ code: "custom", path: ["password"], message: passwordError });
  }
  if (value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const loginOtpSchema = z.object({
  email: z.email("Enter a valid email address."),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit verification code."),
});

export const createCheckoutSessionSchema = z.object({
  packageSlug: z.string().trim().min(1, "Package is required."),
});

export const checkoutStatusSchema = z.object({
  session_id: z.string().trim().min(1, "Stripe session id is required."),
});

export const applicationPatchSchema = z.object({
  application: z.record(z.string(), z.unknown()).default({}),
});

export const documentMetadataSchema = z.object({
  kind: z.enum(["passport", "companyDocuments", "einDocument", "scannedSignature", "previousItinForm"]),
  fileName: z.string().trim().min(1),
  size: z.number().int().nonnegative(),
  mimeType: z.string().trim().min(1),
  fileBase64: z.string().trim().min(1).optional(),
});

export const applicationSubmitSchema = z.object({
  application: z.record(z.string(), z.unknown()),
  declarationAccepted: z.boolean().refine(Boolean, "Accept the declaration before submitting."),
  documents: z.array(documentMetadataSchema),
});

export const documentUploadSchema = z.object({
  orderId: z.string().trim().min(1),
  documents: z.array(documentMetadataSchema).min(1),
});
