"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";
import { Check, ChevronLeft, ChevronRight, LoaderCircle, LockKeyhole, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AddressStep,
  ApplicationOptionStep,
  HopeTexOrderStep,
  PersonalDetailsStep,
} from "@/components/application/ApplicationSteps";
import { ApplicationDocumentsStep } from "@/components/application/ApplicationDocumentsStep";
import { ApplicationReviewStep } from "@/components/application/ApplicationReviewStep";
import {
  createDraftValues,
  createSubmissionPayload,
  defaultApplicationValues,
  itinApplicationSchema,
  valuesForOption,
  type ApplicationOption,
  type ItinApplicationValues,
} from "@/features/itin/schema";
import {
  requiredDocumentKinds,
  validateDocumentFile,
  type DocumentMetadata,
} from "@/features/itin/documents";
import type { AuthUser, DocumentKind, ItinOrder } from "@/features/itin/types";
import { apiFetch } from "@/lib/api-client";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";
import { cn } from "@/lib/cn";

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

type StepId = "option" | "personal" | "address" | "order" | "documents" | "review";

const stepLabels: Record<StepId, string> = {
  option: "Application option",
  personal: "Personal details",
  address: "Ownership and address",
  order: "HopeTex order",
  documents: "Documents",
  review: "Review and declaration",
};

function stepsForOption(option?: ApplicationOption): StepId[] {
  if (option === "hopetex") return ["option", "order", "documents", "review"];
  if (option === "has-company" || option === "no-company") {
    return ["option", "personal", "address", "documents", "review"];
  }
  return ["option"];
}

function personalComplete(values: Partial<ItinApplicationValues>) {
  if (!("firstName" in values)) return false;
  const phoneValid = /^\+[1-9]\d{7,14}$/.test(values.phone?.trim() ?? "");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email ?? "");
  const birthNameComplete = values.sameAsBirthName === "yes"
    || (
      values.sameAsBirthName === "no"
      && Boolean(values.birthFirstName?.trim())
      && Boolean(values.birthLastName?.trim())
    );
  return Boolean(
    values.firstName?.trim()
    && values.lastName?.trim()
    && birthNameComplete
    && phoneValid
    && emailValid,
  );
}

function addressComplete(values: Partial<ItinApplicationValues>) {
  if (!("ownershipPercentage" in values)) return false;
  const ownership = Number(values.ownershipPercentage);
  return Boolean(
    Number.isFinite(ownership)
    && ownership > 0
    && ownership <= 100
    && values.streetAddress?.trim()
    && values.city?.trim()
    && values.stateProvince?.trim()
    && values.postalCode?.trim()
    && values.country?.trim(),
  );
}

function documentsComplete(
  option: ApplicationOption,
  values: Partial<ItinApplicationValues>,
) {
  return requiredDocumentKinds(option).every((kind) => {
    const files = kind === "passport"
      ? values.passport
      : kind === "scannedSignature"
        ? values.scannedSignature
        : kind === "companyDocuments" && "companyDocuments" in values
          ? values.companyDocuments
          : kind === "einDocument" && "einDocument" in values
            ? values.einDocument
            : undefined;
    if (!Array.isArray(files) || files.length === 0) return false;
    if (kind !== "companyDocuments" && files.length !== 1) return false;
    return files.every((file) => validateDocumentFile(file) === null);
  });
}

const fieldsByStep: Partial<Record<StepId, Array<FieldPath<ItinApplicationValues>>>> = {
  personal: [
    "firstName",
    "lastName",
    "sameAsBirthName",
    "birthFirstName",
    "birthLastName",
    "phone",
    "email",
  ],
  address: [
    "ownershipPercentage",
    "streetAddress",
    "city",
    "stateProvince",
    "postalCode",
    "country",
  ],
  order: ["hopetexOrderNumber"],
  documents: ["passport", "scannedSignature", "companyDocuments", "einDocument"],
};

export default function ApplicationPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<ItinOrder | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState<StepId>("option");
  const [previousMetadata, setPreviousMetadata] = useState<DocumentMetadata[]>([]);
  const [showDocumentErrors, setShowDocumentErrors] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const methods = useForm<ItinApplicationValues>({
    resolver: zodResolver(itinApplicationSchema),
    defaultValues: defaultApplicationValues,
    mode: "onChange",
  });
  const {
    getValues,
    reset,
    trigger,
    register,
    clearErrors,
    formState: { errors },
  } = methods;
  const watchedValues = useWatch({ control: methods.control }) as Partial<ItinApplicationValues>;
  const applicationOption = watchedValues.applicationOption;
  const activeSteps = useMemo(
    () => stepsForOption(applicationOption),
    [applicationOption],
  );
  const currentStepIndex = Math.max(0, activeSteps.indexOf(step));

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [{ order: loadedOrder }, { application }, { user: currentUser }] = await Promise.all([
          apiFetch<{ order: ItinOrder }>(`/api/orders/${params.orderId}`),
          apiFetch<{ application: { application: Partial<ItinApplicationValues>; documents: DocumentMetadata[] } }>(`/api/applications/${params.orderId}`),
          apiFetch<{ user: AuthUser | null }>("/api/auth/me"),
        ]);
        if (!active) return;
        setOrder(loadedOrder);
        setUser(currentUser);
        const option = application.application.applicationOption;
        if (option) {
          reset(valuesForOption(option, application.application));
          setPreviousMetadata(application.documents ?? []);
        }
      } catch (cause) {
        if (active) setLoadError(cause instanceof Error ? cause.message : "Application could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [params.orderId, reset]);

  function changeApplicationOption(option: ApplicationOption) {
    const current = getValues();
    const previousOption = current.applicationOption;
    const [firstName = "", ...lastNameParts] = user?.fullName.split(" ") ?? [];
    const initialCustomer = previousOption
      ? {}
      : {
          firstName,
          lastName: lastNameParts.join(" "),
          email: user?.email ?? "",
          phone: user?.whatsapp ?? "",
          country: user?.country ?? "",
        };
    const nextValues = valuesForOption(option, {
      ...initialCustomer,
      ...current,
    });
    reset(nextValues);
    clearErrors();
    setPreviousMetadata((metadata) =>
      metadata.filter((file) => requiredDocumentKinds(option).includes(file.kind))
    );
    setShowDocumentErrors(false);
    setStep("option");
  }

  async function saveCurrentDraft() {
    if (!applicationOption) return;
    await apiFetch(`/api/applications/${params.orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ application: createDraftValues(getValues()) }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function isStepComplete(stepId: StepId) {
    if (stepId === "option") return Boolean(applicationOption);
    if (stepId === "personal") return personalComplete(watchedValues);
    if (stepId === "address") return addressComplete(watchedValues);
    if (stepId === "order") {
      return "hopetexOrderNumber" in watchedValues
        && Boolean(watchedValues.hopetexOrderNumber?.trim());
    }
    if (stepId === "documents") {
      return Boolean(
        applicationOption
        && documentsComplete(applicationOption, watchedValues),
      );
    }
    return itinApplicationSchema.safeParse(watchedValues).success;
  }

  async function continueStep() {
    if (!isStepComplete(step)) {
      if (step === "documents") setShowDocumentErrors(true);
      await trigger(fieldsByStep[step], { shouldFocus: true });
      return;
    }
    const fields = fieldsByStep[step];
    if (fields && !(await trigger(fields, { shouldFocus: true }))) return;
    await saveCurrentDraft();
    const nextStep = activeSteps[currentStepIndex + 1];
    if (nextStep) setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitApplication() {
    const result = itinApplicationSchema.safeParse(getValues());
    if (!result.success) {
      await trigger();
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = createSubmissionPayload(result.data);
      const fileGroups: Array<{ kind: DocumentKind; files: File[] }> = [
        { kind: "passport", files: result.data.passport },
        { kind: "scannedSignature", files: result.data.scannedSignature },
      ];
      if ("companyDocuments" in result.data) {
        fileGroups.push(
          { kind: "companyDocuments", files: result.data.companyDocuments },
          { kind: "einDocument", files: result.data.einDocument },
        );
      }

      const documents = await Promise.all(
        fileGroups.flatMap(({ kind, files }) =>
          files.map(async (file) => ({
            kind,
            fileName: file.name,
            size: file.size,
            mimeType: file.type || "application/octet-stream",
            fileBase64: await fileToBase64(file),
          })),
        ),
      );

      await apiFetch(`/api/applications/${params.orderId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          application: payload.application,
          declarationAccepted: payload.declarationAccepted,
          documents,
        }),
      });
      setSubmitted(true);
    } catch (cause) {
      setSubmitError(
        cause instanceof Error
          ? cause.message
          : "Submission failed. Please try again.",
      );
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      window.location.assign("/");
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <main className="flex min-h-[70vh] items-center justify-center gap-3 text-sm text-text-mid" role="status">
          <LoaderCircle className="animate-spin text-blue" /> Restoring your application...
        </main>
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="min-h-screen bg-bg-light">
        <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
          <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-navy shadow-card"><LockKeyhole size={28} /></span>
          <h1 className="text-2xl font-extrabold text-text-dark">Application locked</h1>
          <p className="mt-3 text-sm leading-6 text-text-mid">{loadError || "Payment must be confirmed before the ITIN application can be accessed."}</p>
          <Link href="/checkout" className="mt-6"><Button size="md">Go to checkout</Button></Link>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-light">
        <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
          <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-blue shadow-card">
            <Check size={28} strokeWidth={2.5} />
          </span>
          <h1 className="text-2xl font-extrabold text-text-dark">Application submitted</h1>
          <p className="mt-3 text-sm leading-6 text-text-mid">
            Application submitted successfully. You can track your order from My Orders.
          </p>
          <p className="mt-2 text-xs text-text-muted">Returning to the homepage shortly…</p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link href="/">
              <Button size="md">Back to home</Button>
            </Link>
            <a href={customerDashboardUrl("/dashboard/orders")}>
              <Button size="md" variant="outline">
                View my orders
              </Button>
            </a>
          </div>
        </main>
      </div>
    );
  }

  const percentage = Math.round(
    ((currentStepIndex + 1) / activeSteps.length) * 100,
  );
  const canContinue = isStepComplete(step);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen overflow-x-clip bg-bg-light">
        <div className="border-b border-border bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto max-w-[820px]">
            <div className="flex items-center justify-between gap-3 text-xs font-bold">
              <span className="truncate text-navy">{currentStepIndex + 1}. {stepLabels[step]}</span>
              <span className="shrink-0 text-text-muted">{percentage}% complete</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>
        <main className="mx-auto flex w-full max-w-[1180px] items-start gap-8 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
          <aside className="sticky top-6 hidden w-[270px] shrink-0 lg:block">
            <div className="rounded-card border border-border bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-blue">ITIN application</p>
              <p className="mt-1 truncate text-sm font-semibold text-text-dark">{order.reference}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <p className="mt-2 text-xs text-text-muted">{percentage}% complete</p>
              <nav className="mt-5" aria-label="Application steps">
                <ol className="space-y-1">
                  {activeSteps.map((stepId, index) => (
                    <li key={stepId}>
                      <button
                        type="button"
                        onClick={() => index < currentStepIndex && setStep(stepId)}
                        disabled={index > currentStepIndex}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold",
                          index === currentStepIndex && "bg-navy/[0.06] text-navy",
                          index < currentStepIndex && "text-text-dark hover:bg-bg-light",
                          index > currentStepIndex && "cursor-not-allowed text-text-muted",
                        )}
                        aria-current={index === currentStepIndex ? "step" : undefined}
                      >
                        <span className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          index < currentStepIndex && "bg-blue text-white",
                          index === currentStepIndex && "bg-navy text-white",
                          index > currentStepIndex && "bg-border text-text-muted",
                        )}>
                          {index < currentStepIndex ? <Check size={12} /> : index + 1}
                        </span>
                        {stepLabels[stepId]}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <section className="min-w-0 flex-1 rounded-card border border-border bg-white p-5 shadow-card sm:p-7">
            {step === "option" && <ApplicationOptionStep onOptionChange={changeApplicationOption} />}
            {step === "personal" && <PersonalDetailsStep />}
            {step === "address" && <AddressStep />}
            {step === "order" && <HopeTexOrderStep />}
            {step === "documents" && applicationOption && (
              <ApplicationDocumentsStep
                applicationOption={applicationOption}
                previousMetadata={previousMetadata}
                showErrors={showDocumentErrors}
                onFilesChanged={(kind) => {
                  setPreviousMetadata((metadata) =>
                    metadata.filter((file) => file.kind !== kind)
                  );
                }}
              />
            )}
            {step === "review" && (
              <ApplicationReviewStep
                values={getValues()}
                onEdit={setStep}
                declarationError={errors.declarationAccepted?.message}
                registerDeclaration={register("declarationAccepted")}
              />
            )}
            {submitError && <p role="alert" className="mt-5 rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">{submitError}</p>}
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="text"
                size="sm"
                onClick={() => {
                  const previous = activeSteps[currentStepIndex - 1];
                  if (previous) setStep(previous);
                }}
                disabled={currentStepIndex === 0 || submitting}
              >
                <ChevronLeft size={15} /> Previous
              </Button>
              <button
                type="button"
                onClick={saveCurrentDraft}
                disabled={!applicationOption}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-text-mid hover:text-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={14} /> {saved ? "Draft saved" : "Save and continue later"}
              </button>
              <div className="sm:ml-auto">
                {step !== "review" ? (
                  <Button type="button" size="md" onClick={continueStep} disabled={!canContinue}>
                    Continue <ChevronRight size={15} />
                  </Button>
                ) : (
                  <Button type="button" size="md" onClick={submitApplication} disabled={!canContinue || submitting}>
                    {submitting && <LoaderCircle size={15} className="animate-spin" />}
                    {submitting ? "Submitting..." : "Submit application"}
                  </Button>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </FormProvider>
  );
}
