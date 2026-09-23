"use client";

import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AlertTriangle, FileText, Trash2, Upload } from "lucide-react";
import {
  formatFileSize,
  requiredDocumentKinds,
  validateDocumentFile,
  type DocumentMetadata,
} from "@/features/itin/documents";
import type { ApplicationOption, ItinApplicationValues } from "@/features/itin/schema";
import type { DocumentKind } from "@/features/itin/types";

const documentLabels: Record<DocumentKind, string> = {
  passport: "Upload Passport Scan",
  companyDocuments: "Upload Company Documents",
  einDocument: "Upload EIN Document",
  scannedSignature: "Upload Scanned Signature on White Paper",
  previousItinForm: "Upload Previous ITIN Form",
};

const documentInstructions: Partial<Record<DocumentKind, string>> = {
  passport:
    "Upload a clear passport scan with all four corners visible, the top and bottom half visible, the photo in color and not blurry, and a passport valid for at least 6 months. Use a scanner if possible.",
  scannedSignature:
    "Please upload a clear scanned signature written on plain white paper. The signature should be dark, readable, and not cropped.",
};

function fieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("message" in error && typeof error.message === "string") return error.message;
  if ("root" in error) return fieldErrorMessage(error.root);
  if ("0" in error) return fieldErrorMessage(error[0]);
  return undefined;
}

function UploadCard({
  kind,
  files,
  previousMetadata,
  error,
  showRequiredError,
  onChange,
}: {
  kind: DocumentKind;
  files: File[];
  previousMetadata: DocumentMetadata[];
  error?: string;
  showRequiredError: boolean;
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectionError, setSelectionError] = useState("");
  const allowMultiple = kind === "companyDocuments";
  const instruction = documentInstructions[kind];
  const isOptional = kind === "previousItinForm";

  function chooseFiles(selected: File[]) {
    if (selected.length === 0) return;
    const invalid = selected
      .map((file) => ({ file, error: validateDocumentFile(file) }))
      .find((result) => result.error);
    if (invalid) {
      setSelectionError(`${invalid.file.name}: ${invalid.error}`);
      return;
    }
    setSelectionError("");
    onChange(allowMultiple ? selected : [selected[0]]);
  }

  const requiredMessage = kind === "companyDocuments"
    ? "At least one company document is required"
    : kind === "passport"
      ? "Passport scan is required"
      : kind === "scannedSignature"
        ? "Scanned signature on white paper is required"
        : "EIN document is required";

  return (
    <div className="min-w-0 rounded-xl border border-border p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-light text-blue">
          {files.length ? <FileText size={19} /> : <Upload size={19} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-dark">
                {documentLabels[kind]} {!isOptional && <span className="text-error">*</span>}
              </p>
              <p className="text-xs text-text-muted">
                {isOptional ? "Optional" : "Required"} · PDF, JPG, JPEG, or PNG · max 1 GB
                {allowMultiple ? " each · multiple files allowed" : ""}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple={allowMultiple}
              className="sr-only"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(event) => {
                chooseFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-btn border border-blue px-3 py-2 text-xs font-bold text-blue hover:bg-blue/[0.04]"
            >
              {files.length ? "Replace" : "Choose file"}
            </button>
          </div>

          {instruction ? (
            <p className="mt-2 text-xs leading-5 text-text-mid">{instruction}</p>
          ) : null}

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-bg-light p-3 text-xs">
                  <span className="min-w-0 truncate font-semibold text-text-dark">{file.name}</span>
                  <span className="shrink-0 text-text-muted">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => onChange(files.filter((candidate) => candidate !== file))}
                    className="flex shrink-0 items-center gap-1 font-semibold text-error hover:underline"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {files.length === 0 && previousMetadata.length > 0 && (
            <div className="mt-3 rounded-lg border border-warning-bg bg-warning-bg/55 p-3">
              <p className="text-xs font-bold text-text-dark">Reselect after refresh</p>
              {previousMetadata.map((file) => (
                <p key={`${file.name}-${file.size}`} className="mt-1 truncate text-xs text-text-mid">
                  Previously selected: {file.name} ({formatFileSize(file.size)})
                </p>
              ))}
            </div>
          )}

          {(selectionError || error || (showRequiredError && files.length === 0)) && (
            <p role="alert" className="mt-2 text-xs text-error">
              {selectionError || error || requiredMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ApplicationDocumentsStep({
  applicationOption,
  previousMetadata,
  showErrors,
  onFilesChanged,
  isRenewal = false,
}: {
  applicationOption: ApplicationOption;
  previousMetadata: DocumentMetadata[];
  showErrors: boolean;
  onFilesChanged: (kind: DocumentKind) => void;
  isRenewal?: boolean;
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ItinApplicationValues>();
  const passport = useWatch({ control, name: "passport" }) ?? [];
  const companyDocuments = useWatch({ control, name: "companyDocuments" }) ?? [];
  const einDocument = useWatch({ control, name: "einDocument" }) ?? [];
  const scannedSignature = useWatch({ control, name: "scannedSignature" }) ?? [];
  const previousItinForm = useWatch({ control, name: "previousItinForm" }) ?? [];
  const filesByKind: Record<DocumentKind, File[]> = {
    passport,
    companyDocuments,
    einDocument,
    scannedSignature,
    previousItinForm,
  };

  const kinds = requiredDocumentKinds(applicationOption);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-extrabold text-text-dark">Documents</h2>
        <p className="mt-1.5 text-sm leading-6 text-text-mid">Select every required file for your application option.</p>
      </div>
      <div className="flex gap-3 rounded-xl border border-warning-bg bg-warning-bg/55 p-4">
        <AlertTriangle size={19} className="mt-0.5 shrink-0 text-navy" />
        <div>
          <p className="text-sm font-bold text-text-dark">Files stay in this browser only</p>
          <p className="mt-1 text-xs leading-5 text-text-mid">Files are kept in browser memory and are not uploaded to a server. File names and sizes are saved with the draft; files must be reselected after refresh.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {kinds.map((kind) => (
          <UploadCard
            key={kind}
            kind={kind}
            files={filesByKind[kind]}
            previousMetadata={previousMetadata.filter((file) => file.kind === kind)}
            error={fieldErrorMessage(
              kind === "passport"
                ? errors.passport
                : kind === "companyDocuments" && "companyDocuments" in errors
                  ? errors.companyDocuments
                  : kind === "einDocument" && "einDocument" in errors
                    ? errors.einDocument
                    : kind === "scannedSignature"
                      ? errors.scannedSignature
                      : undefined
            )}
            showRequiredError={showErrors}
            onChange={(files) => {
              onFilesChanged(kind);
              setValue(kind, files, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        ))}

        {isRenewal && (
          <UploadCard
            kind="previousItinForm"
            files={filesByKind.previousItinForm}
            previousMetadata={previousMetadata.filter((file) => file.kind === "previousItinForm")}
            showRequiredError={false}
            onChange={(files) => {
              onFilesChanged("previousItinForm");
              setValue("previousItinForm", files, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
