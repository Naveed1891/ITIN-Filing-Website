"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

interface DocStatus {
  name: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
}

const initialDocs: DocStatus[] = [
  { name: "Passport (bio-data page)", required: true, uploaded: false },
  { name: "Supporting ID document", required: false, uploaded: false },
  { name: "U.S. tax return or proof of tax requirement", required: true, uploaded: false },
];

export function DocumentUpload() {
  const [docs, setDocs] = useState<DocStatus[]>(initialDocs);

  function simulateUpload(index: number) {
    setDocs((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, uploaded: true, fileName: "document.pdf" }
          : d
      )
    );
  }

  const allRequired = docs.filter((d) => d.required).every((d) => d.uploaded);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[20px] font-extrabold text-text-dark">
          Upload documents
        </h2>
        <p className="text-[14px] text-text-mid">
          Upload clear, full-colour scans or photos of your documents. Files
          must be JPG, PNG, or PDF under 10 MB.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {docs.map((doc, i) => (
          <div
            key={doc.name}
            className="border rounded-[12px] p-5 flex items-center justify-between gap-4 transition-colors"
            style={{
              borderColor: doc.uploaded ? "#205493" : doc.required ? "#E3E8EE" : "#E3E8EE",
              background: doc.uploaded ? "rgba(32,84,147,.04)" : "#fff",
            }}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {doc.uploaded ? (
                <CheckCircle size={20} className="text-blue flex-shrink-0 mt-0.5" />
              ) : doc.required ? (
                <AlertCircle size={20} className="text-text-muted flex-shrink-0 mt-0.5" />
              ) : (
                <Upload size={20} className="text-text-muted flex-shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[14px] font-semibold text-text-dark">
                  {doc.name}
                </span>
                {doc.uploaded ? (
                  <span className="text-[12px] text-blue font-medium truncate">
                    {doc.fileName} — uploaded
                  </span>
                ) : (
                  <span className="text-[12px] text-text-muted">
                    {doc.required ? "Required" : "Optional"}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => simulateUpload(i)}
              className="flex-shrink-0 px-4 py-2 rounded-btn border text-[13px] font-semibold transition-colors"
              style={{
                borderColor: doc.uploaded ? "#E3E8EE" : "#205493",
                color: doc.uploaded ? "#9AA7B4" : "#205493",
                background: "transparent",
              }}
            >
              {doc.uploaded ? "Replace" : "Upload"}
            </button>
          </div>
        ))}
      </div>

      {/* Optional drag zone */}
      <div className="border-2 border-dashed border-border rounded-[12px] p-8 flex flex-col items-center gap-3 text-center">
        <Upload size={24} className="text-text-muted" />
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-text-dark">
            Drag additional files here
          </span>
          <span className="text-[12.5px] text-text-muted">
            or click to browse — JPG, PNG, PDF up to 10 MB
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="text" size="sm" className="text-text-muted">
          ← Back
        </Button>
        <Link href={customerDashboardUrl("/dashboard/orders")} aria-disabled={!allRequired}>
          <Button
            variant="primary"
            size="md"
            disabled={!allRequired}
            title={!allRequired ? "Upload all required documents to continue" : undefined}
          >
            Continue to review →
          </Button>
        </Link>
      </div>

      {!allRequired && (
        <p className="text-[12.5px] text-text-muted text-center">
          Please upload all required documents to continue.
        </p>
      )}
    </div>
  );
}
