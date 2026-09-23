import { describe, expect, it } from "vitest";
import {
  applicationOptions,
  createSubmissionPayload,
  itinApplicationSchema,
  valuesForOption,
} from "./schema";

const file = (name: string, type = "application/pdf") =>
  new File(["content"], name, { type });

const signature = file("signature.png", "image/png");

const personalApplication = {
  firstName: "Amina",
  lastName: "Khan",
  sameAsBirthName: "yes" as const,
  birthFirstName: "",
  birthLastName: "",
  phone: "+923001234567",
  email: "amina@example.com",
  ownershipPercentage: "50",
  streetAddress: "12 Main Road",
  city: "Lahore",
  stateProvince: "Punjab",
  postalCode: "54000",
  country: "Pakistan",
  declarationAccepted: true,
};

describe("ITIN application discriminated validation", () => {
  it("uses stable option values with the exact required labels and order", () => {
    expect(applicationOptions).toEqual([
      { value: "has-company", label: "I have US Company & EIN" },
      { value: "no-company", label: "I don't have US Company & EIN, I will not Start one for now" },
    ]);
  });

  it("does not accept option 1 without passport, company documents, EIN document, and signature", () => {
    const result = itinApplicationSchema.safeParse({
      applicationOption: "has-company",
      ...personalApplication,
      passport: [],
      companyDocuments: [],
      einDocument: [],
      scannedSignature: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(expect.arrayContaining([
        "passport",
        "companyDocuments",
        "einDocument",
        "scannedSignature",
      ]));
    }
  });

  it("requires passport and signature for option 2", () => {
    const missingPassport = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [],
      scannedSignature: [signature],
    });
    expect(missingPassport.success).toBe(false);

    const missingSignature = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [file("passport.pdf")],
      scannedSignature: [],
    });
    expect(missingSignature.success).toBe(false);

    const complete = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [file("passport.pdf")],
      scannedSignature: [signature],
    });
    expect(complete.success).toBe(true);
  });

  it("does not require company or EIN documents for option 2", () => {
    const result = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [file("passport.pdf")],
      scannedSignature: [signature],
    });
    expect(result.success).toBe(true);
  });

  it("requires birth-name fields only when the answer is No", () => {
    const sameName = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [file("passport.pdf")],
      scannedSignature: [signature],
    });
    expect(sameName.success).toBe(true);

    const differentName = itinApplicationSchema.safeParse({
      applicationOption: "no-company",
      ...personalApplication,
      sameAsBirthName: "no",
      birthFirstName: "",
      birthLastName: "",
      passport: [file("passport.pdf")],
      scannedSignature: [signature],
    });
    expect(differentName.success).toBe(false);
    if (!differentName.success) {
      const paths = differentName.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(expect.arrayContaining([
        "birthFirstName",
        "birthLastName",
      ]));
    }
  });

  it("clears company document fields when switching from has-company to no-company", () => {
    const optionOne = valuesForOption("has-company", {
      ...personalApplication,
      passport: [file("passport.pdf")],
      companyDocuments: [file("company.pdf")],
      einDocument: [file("ein.pdf")],
      scannedSignature: [signature],
    });
    const optionTwo = valuesForOption("no-company", optionOne);
    expect("companyDocuments" in optionTwo).toBe(false);
    expect("einDocument" in optionTwo).toBe(false);
    expect(optionTwo.passport).toHaveLength(1);
    expect(optionTwo.scannedSignature).toHaveLength(1);
  });

  it("creates review and submission data from active fields only", () => {
    const parsed = itinApplicationSchema.parse({
      applicationOption: "no-company",
      ...personalApplication,
      passport: [file("passport.pdf")],
      scannedSignature: [signature],
    });
    const payload = createSubmissionPayload(parsed);
    expect(payload.application).not.toHaveProperty("companyDocuments");
    expect(payload.documents).toHaveProperty("passport");
    expect(payload.documents).toHaveProperty("scannedSignature");
    expect(payload.documents).not.toHaveProperty("companyDocuments");
  });
});
