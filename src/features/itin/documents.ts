import type { ApplicationOption, ValidItinApplication } from "./schema";
import type { DocumentKind } from "./types";

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;
export const MAX_FILE_SIZE_ERROR = "File size must be less than 1 GB.";

export interface DocumentMetadata {
  kind: DocumentKind;
  name: string;
  size: number;
  type: string;
}

export function validateDocumentFile(file: File): string | null {
  const extensionAllowed = /\.(pdf|jpe?g|png)$/i.test(file.name);
  const mimeAllowed = ACCEPTED_FILE_TYPES.includes(
    file.type as (typeof ACCEPTED_FILE_TYPES)[number],
  );
  if (!mimeAllowed || !extensionAllowed) {
    return "Choose a PDF, JPG, JPEG, or PNG file";
  }
  if (file.size > MAX_FILE_SIZE) return MAX_FILE_SIZE_ERROR;
  return null;
}

export function requiredDocumentKinds(
  applicationOption: ApplicationOption,
): DocumentKind[] {
  const signature: DocumentKind = "scannedSignature";
  if (applicationOption === "has-company") {
    return ["passport", "companyDocuments", "einDocument", signature];
  }
  return ["passport", signature];
}

export function documentMetadataFromValues(
  values: Partial<ValidItinApplication>,
): DocumentMetadata[] {
  const metadata: DocumentMetadata[] = [];
  const addFiles = (kind: DocumentKind, files?: File[]) => {
    files?.forEach(({ name, size, type }) => metadata.push({
      kind,
      name,
      size,
      type,
    }));
  };
  addFiles("passport", values.passport);
  addFiles("scannedSignature", values.scannedSignature);
  if ("companyDocuments" in values) {
    addFiles("companyDocuments", values.companyDocuments);
    addFiles("einDocument", values.einDocument);
  }
  return metadata;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Maps website document kinds to integration API kinds without changing service-dashboard. */
export function mapDocumentsForIntegration<
  T extends { kind: DocumentKind; fileName: string },
>(documents: T[]): Array<Omit<T, "kind"> & { kind: Exclude<DocumentKind, "scannedSignature"> }> {
  return documents.map((document) => {
    if (document.kind !== "scannedSignature") {
      return document as Omit<T, "kind"> & { kind: Exclude<DocumentKind, "scannedSignature"> };
    }
    return {
      ...document,
      kind: "companyDocuments",
      fileName: document.fileName.toLowerCase().includes("signature")
        ? document.fileName
        : `scanned-signature-${document.fileName}`,
    };
  });
}
