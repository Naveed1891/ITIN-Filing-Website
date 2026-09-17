import { z } from "zod";
import { validateDocumentFile } from "./documents";

export const applicationOptions = [
  {
    value: "has-company",
    label: "I have US Company & EIN",
  },
  {
    value: "no-company",
    label: "I don't have US Company & EIN, I will not Start one for now",
  },
  {
    value: "hopetex",
    label: "My Company is Registered from HopeTex",
  },
] as const;

export type ApplicationOption = (typeof applicationOptions)[number]["value"];

export const applicationOptionSchema = z.enum([
  "has-company",
  "no-company",
  "hopetex",
], {
  error: "Application option is required",
});

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Enter a phone number with country code");

const documentFileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "Select a file",
).superRefine((file, ctx) => {
  const error = validateDocumentFile(file);
  if (error) ctx.addIssue({ code: "custom", message: error });
});

const passportSchema = z
  .array(documentFileSchema)
  .length(1, "Passport scan is required");

const companyDocumentsSchema = z
  .array(documentFileSchema)
  .min(1, "At least one company document is required");

const einDocumentSchema = z
  .array(documentFileSchema)
  .length(1, "EIN document is required");

const scannedSignatureSchema = z
  .array(documentFileSchema)
  .length(1, "Scanned signature on white paper is required");

const birthNameSchema = z
  .object({
    sameAsBirthName: z.enum(["yes", "no"], {
      error: "Choose Yes or No",
    }),
    birthFirstName: z.string().trim(),
    birthLastName: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.sameAsBirthName !== "no") return;
    if (!data.birthFirstName) {
      ctx.addIssue({
        code: "custom",
        path: ["birthFirstName"],
        message: "Birth First Name is required",
      });
    }
    if (!data.birthLastName) {
      ctx.addIssue({
        code: "custom",
        path: ["birthLastName"],
        message: "Birth Last Name / Surname is required",
      });
    }
  });

const personalFields = {
  firstName: requiredText("First Name"),
  lastName: requiredText("Last Name (Surname)"),
  phone: phoneSchema,
  email: z.email("Enter a valid email address"),
};

const addressFields = {
  ownershipPercentage: requiredText("OWNERSHIP %").superRefine((value, ctx) => {
    const percentage = Number(value);
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a percentage from 0.01 to 100",
      });
    }
  }),
  streetAddress: requiredText("Street Address"),
  city: requiredText("City"),
  stateProvince: requiredText("State / Province"),
  postalCode: requiredText("ZIP / Postal Code"),
  country: requiredText("Country"),
};

const declarationField = z
  .boolean()
  .refine((value) => value, "Accept the declaration before submitting");

const hasCompanySchema = z
  .object({
    applicationOption: z.literal("has-company"),
    ...personalFields,
    ...addressFields,
    passport: passportSchema,
    companyDocuments: companyDocumentsSchema,
    einDocument: einDocumentSchema,
    scannedSignature: scannedSignatureSchema,
    declarationAccepted: declarationField,
  })
  .and(birthNameSchema);

const noCompanySchema = z
  .object({
    applicationOption: z.literal("no-company"),
    ...personalFields,
    ...addressFields,
    passport: passportSchema,
    scannedSignature: scannedSignatureSchema,
    declarationAccepted: declarationField,
  })
  .and(birthNameSchema);

const hopetexSchema = z.object({
  applicationOption: z.literal("hopetex"),
  hopetexOrderNumber: requiredText("Order number"),
  passport: passportSchema,
  scannedSignature: scannedSignatureSchema,
  declarationAccepted: declarationField,
});

// Intersections cannot be used directly by discriminatedUnion, so the shared
// birth-name refinement is applied to the complete union below.
const hasCompanyObject = z.object({
  applicationOption: z.literal("has-company"),
  ...personalFields,
  sameAsBirthName: z.enum(["yes", "no"], { error: "Choose Yes or No" }),
  birthFirstName: z.string().trim(),
  birthLastName: z.string().trim(),
  ...addressFields,
  passport: passportSchema,
  companyDocuments: companyDocumentsSchema,
  einDocument: einDocumentSchema,
  scannedSignature: scannedSignatureSchema,
  declarationAccepted: declarationField,
}).strict();

const noCompanyObject = z.object({
  applicationOption: z.literal("no-company"),
  ...personalFields,
  sameAsBirthName: z.enum(["yes", "no"], { error: "Choose Yes or No" }),
  birthFirstName: z.string().trim(),
  birthLastName: z.string().trim(),
  ...addressFields,
  passport: passportSchema,
  scannedSignature: scannedSignatureSchema,
  declarationAccepted: declarationField,
}).strict();

const hopetexObject = hopetexSchema.strict();

export const itinApplicationSchema = z
  .discriminatedUnion("applicationOption", [
    hasCompanyObject,
    noCompanyObject,
    hopetexObject,
  ])
  .superRefine((data, ctx) => {
    if (data.applicationOption === "hopetex" || data.sameAsBirthName !== "no") {
      return;
    }
    if (!data.birthFirstName) {
      ctx.addIssue({
        code: "custom",
        path: ["birthFirstName"],
        message: "Birth First Name is required",
      });
    }
    if (!data.birthLastName) {
      ctx.addIssue({
        code: "custom",
        path: ["birthLastName"],
        message: "Birth Last Name / Surname is required",
      });
    }
  });

export type ItinApplicationValues = z.input<typeof itinApplicationSchema>;
export type ValidItinApplication = z.output<typeof itinApplicationSchema>;

export const checkoutSchema = z.object({
  firstName: requiredText("First name"),
  lastName: requiredText("Last name"),
  email: z.email("Enter a valid email address"),
  phone: phoneSchema,
  country: requiredText("Country"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export interface ApplicationDraftValues {
  applicationOption?: ApplicationOption | "";
  firstName?: string;
  lastName?: string;
  sameAsBirthName?: "" | "yes" | "no";
  birthFirstName?: string;
  birthLastName?: string;
  phone?: string;
  email?: string;
  ownershipPercentage?: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  hopetexOrderNumber?: string;
  declarationAccepted?: boolean;
}

export const defaultApplicationValues = {
  passport: [] as File[],
  scannedSignature: [] as File[],
  declarationAccepted: false,
};

const personalDefaults = {
  firstName: "",
  lastName: "",
  sameAsBirthName: "" as "yes",
  birthFirstName: "",
  birthLastName: "",
  phone: "",
  email: "",
  ownershipPercentage: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  passport: [] as File[],
  scannedSignature: [] as File[],
  declarationAccepted: false,
};

export function valuesForOption(
  option: ApplicationOption,
  current: Partial<ApplicationDraftValues & {
    passport: File[];
    companyDocuments: File[];
    einDocument: File[];
    scannedSignature: File[];
  }> = {},
): ItinApplicationValues {
  if (option === "hopetex") {
    return {
      applicationOption: option,
      hopetexOrderNumber: current.hopetexOrderNumber ?? "",
      passport: current.passport ?? [],
      scannedSignature: current.scannedSignature ?? [],
      declarationAccepted: false,
    };
  }

  const shared = {
    ...personalDefaults,
    firstName: current.firstName ?? "",
    lastName: current.lastName ?? "",
    sameAsBirthName: current.sameAsBirthName === "no" ? "no" as const : current.sameAsBirthName === "yes" ? "yes" as const : personalDefaults.sameAsBirthName,
    birthFirstName: current.birthFirstName ?? "",
    birthLastName: current.birthLastName ?? "",
    phone: current.phone ?? "",
    email: current.email ?? "",
    ownershipPercentage: current.ownershipPercentage ?? "",
    streetAddress: current.streetAddress ?? "",
    city: current.city ?? "",
    stateProvince: current.stateProvince ?? "",
    postalCode: current.postalCode ?? "",
    country: current.country ?? "",
    passport: current.passport ?? [],
    scannedSignature: current.scannedSignature ?? [],
  };

  return option === "has-company"
    ? {
        ...shared,
        applicationOption: option,
        companyDocuments: current.companyDocuments ?? [],
        einDocument: current.einDocument ?? [],
      }
    : {
        ...shared,
        applicationOption: option,
      };
}

export function createDraftValues(
  values: Partial<ItinApplicationValues>,
): ApplicationDraftValues {
  const option = values.applicationOption;
  if (option === "hopetex") {
    return {
      applicationOption: option,
      hopetexOrderNumber: "hopetexOrderNumber" in values ? values.hopetexOrderNumber : "",
      declarationAccepted: false,
    };
  }
  if (option !== "has-company" && option !== "no-company") {
    return { applicationOption: "" };
  }
  return {
    applicationOption: option,
    firstName: "firstName" in values ? values.firstName : "",
    lastName: "lastName" in values ? values.lastName : "",
    sameAsBirthName: "sameAsBirthName" in values ? values.sameAsBirthName : "",
    birthFirstName: "birthFirstName" in values ? values.birthFirstName : "",
    birthLastName: "birthLastName" in values ? values.birthLastName : "",
    phone: "phone" in values ? values.phone : "",
    email: "email" in values ? values.email : "",
    ownershipPercentage: "ownershipPercentage" in values ? values.ownershipPercentage : "",
    streetAddress: "streetAddress" in values ? values.streetAddress : "",
    city: "city" in values ? values.city : "",
    stateProvince: "stateProvince" in values ? values.stateProvince : "",
    postalCode: "postalCode" in values ? values.postalCode : "",
    country: "country" in values ? values.country : "",
    declarationAccepted: false,
  };
}

export function createSubmissionPayload(values: ValidItinApplication) {
  const documentMetadata = {
    passport: values.passport.map(({ name, size, type }) => ({ name, size, type })),
    scannedSignature: values.scannedSignature.map(({ name, size, type }) => ({ name, size, type })),
    ...("companyDocuments" in values
      ? {
          companyDocuments: values.companyDocuments.map(({ name, size, type }) => ({ name, size, type })),
          einDocument: values.einDocument.map(({ name, size, type }) => ({ name, size, type })),
        }
      : {}),
  };

  const activeTextValues = Object.fromEntries(
    Object.entries(values).filter(([key]) => ![
      "passport",
      "scannedSignature",
      "companyDocuments",
      "einDocument",
      "declarationAccepted",
    ].includes(key)),
  );

  return {
    application: activeTextValues,
    declarationAccepted: values.declarationAccepted,
    documents: documentMetadata,
  };
}

// Retained as named schemas for focused tests and step-level validation.
export const applicationVariantSchemas = {
  hasCompany: hasCompanySchema,
  noCompany: noCompanySchema,
  hopetex: hopetexSchema,
};
