"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import {
  applicationOptions,
  type ItinApplicationValues,
} from "@/features/itin/schema";
import { formatFileSize } from "@/features/itin/documents";

interface ApplicationReviewStepProps {
  values: ItinApplicationValues;
  onEdit: (step: "option" | "personal" | "address" | "order" | "documents") => void;
  declarationError?: string;
  registerDeclaration: UseFormRegisterReturn<"declarationAccepted">;
}

function ReviewSection({
  title,
  step,
  onEdit,
  rows,
}: {
  title: string;
  step: "option" | "personal" | "address" | "order" | "documents";
  onEdit: ApplicationReviewStepProps["onEdit"];
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-xl border border-border bg-bg-light p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-text-dark">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="text-xs font-bold text-blue hover:underline">Edit</button>
      </div>
      <dl className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 text-sm">
            <dt className="text-text-muted">{label}</dt>
            <dd className="break-words text-right font-semibold text-text-dark">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ApplicationReviewStep({
  values,
  onEdit,
  declarationError,
  registerDeclaration,
}: ApplicationReviewStepProps) {
  const optionLabel = applicationOptions.find(
    (option) => option.value === values.applicationOption,
  )?.label ?? "";
  const documentRows: Array<[string, string]> = [
    ["Passport Scan", values.passport.map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", ")],
    [
      "Scanned Signature on White Paper",
      values.scannedSignature.map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", "),
    ],
  ];

  if (values.applicationOption === "has-company") {
    documentRows.push(
      ["Company Documents", values.companyDocuments.map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", ")],
      ["EIN Document", values.einDocument.map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", ")],
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-extrabold text-text-dark">Review and declaration</h2>
        <p className="mt-1.5 text-sm leading-6 text-text-mid">Check the active application fields, then confirm the declaration to submit.</p>
      </div>
      <ReviewSection title="Application option" step="option" onEdit={onEdit} rows={[["Selected option", optionLabel]]} />

      {values.applicationOption === "hopetex" ? (
        <ReviewSection title="HopeTex order" step="order" onEdit={onEdit} rows={[
          ["Order number", values.hopetexOrderNumber],
        ]} />
      ) : (
        <>
          <ReviewSection title="Personal details" step="personal" onEdit={onEdit} rows={[
            ["Name", `${values.firstName} ${values.lastName}`],
            ["Birth name", values.sameAsBirthName === "yes" ? "Same as current name" : `${values.birthFirstName} ${values.birthLastName}`],
            ["Phone", values.phone],
            ["Email", values.email],
          ]} />
          <ReviewSection title="Ownership and address" step="address" onEdit={onEdit} rows={[
            ["OWNERSHIP %", `${values.ownershipPercentage}%`],
            ["Street Address", values.streetAddress],
            ["City / region", `${values.city}, ${values.stateProvince} ${values.postalCode}`],
            ["Country", values.country],
          ]} />
        </>
      )}

      <ReviewSection title="Documents" step="documents" onEdit={onEdit} rows={documentRows} />
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
        <input type="checkbox" className="mt-1 size-4 accent-blue" {...registerDeclaration} />
        <span className="text-sm leading-6 text-text-dark">
          I declare that the information provided is accurate and complete to the best of my knowledge.
        </span>
      </label>
      {declarationError && <p role="alert" className="text-xs text-error">{declarationError}</p>}
    </div>
  );
}
