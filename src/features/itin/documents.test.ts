import { describe, expect, it } from "vitest";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_ERROR,
  mapDocumentsForIntegration,
  requiredDocumentKinds,
  validateDocumentFile,
} from "./documents";

describe("ITIN document requirements", () => {
  it("requires company, EIN, and signature documents for a US company applicant", () => {
    expect(requiredDocumentKinds("has-company")).toEqual([
      "passport",
      "companyDocuments",
      "einDocument",
      "scannedSignature",
    ]);
  });

  it("requires passport and signature for no-company applicants", () => {
    expect(requiredDocumentKinds("no-company")).toEqual(["passport", "scannedSignature"]);
  });

  it("rejects unsupported and oversized files", () => {
    expect(validateDocumentFile(new File(["content"], "passport.txt", { type: "text/plain" }))).toContain("PDF");
    expect(
      validateDocumentFile(new File([new Uint8Array(MAX_FILE_SIZE + 1)], "passport.pdf", { type: "application/pdf" })),
    ).toBe(MAX_FILE_SIZE_ERROR);
  });

  it("accepts supported image and PDF files up to 1 GB", () => {
    expect(validateDocumentFile(new File(["content"], "passport.jpeg", { type: "image/jpeg" }))).toBeNull();
    expect(validateDocumentFile(new File(["content"], "passport.pdf", { type: "application/pdf" }))).toBeNull();
    expect(
      validateDocumentFile(new File([new Uint8Array(MAX_FILE_SIZE)], "passport.pdf", { type: "application/pdf" })),
    ).toBeNull();
  });

  it("maps scanned signature uploads for integration without changing service-dashboard API kinds", () => {
    expect(
      mapDocumentsForIntegration([
        { kind: "passport", fileName: "passport.pdf" },
        { kind: "scannedSignature", fileName: "signature.png" },
      ]),
    ).toEqual([
      { kind: "passport", fileName: "passport.pdf" },
      { kind: "companyDocuments", fileName: "signature.png" },
    ]);
  });
});
