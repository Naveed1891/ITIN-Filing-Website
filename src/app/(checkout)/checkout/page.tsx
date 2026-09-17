"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, LoaderCircle, LockKeyhole, SearchX } from "lucide-react";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { apiFetch } from "@/lib/api-client";
import {
  loginRedirectForPackage,
  signupRedirectForPackage,
} from "@/lib/checkout-redirect";
import type { AuthUser, ItinPackage } from "@/features/itin/types";

const steps = ["Selected form", "Sign in / Create account", "Payment review"];

function SelectedPackageSummary({
  selectedPackage,
  user,
}: {
  selectedPackage: ItinPackage;
  user: AuthUser | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-blue">Step 1 of 3</p>
        <h1 className="text-2xl font-extrabold text-text-dark">Selected ITIN form</h1>
        <p className="mt-2 text-sm text-text-mid">Review the package you selected before continuing.</p>
      </div>

      <section className="rounded-[16px] border border-border bg-white p-5 shadow-[0_24px_60px_-46px_rgba(11,33,56,0.55)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-text-dark">{selectedPackage.name}</h2>
            <p className="mt-2 text-sm leading-6 text-text-mid">{selectedPackage.description}</p>
          </div>
          <p className="shrink-0 text-3xl font-extrabold text-navy">
            ${selectedPackage.price} <span className="text-sm font-bold text-text-muted">{selectedPackage.currency}</span>
          </p>
        </div>
        <div className="my-5 h-px bg-border" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {selectedPackage.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-text-dark">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
                <Check size={12} strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {!user ? (
        <div className="rounded-[14px] border border-blue/20 bg-blue/[0.035] p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-blue ring-1 ring-blue/15">
              <LockKeyhole size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-text-dark">Sign in to continue</h2>
              <p className="mt-1 text-sm leading-6 text-text-mid">Your selected form will be preserved while you sign in or create your account.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={loginRedirectForPackage(selectedPackage.slug)}
              className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full sm:w-auto")}
            >
              Sign in
            </Link>
            <Link
              href={signupRedirectForPackage(selectedPackage.slug)}
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full sm:w-auto")}
            >
              Create account
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CheckoutFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageSlug = searchParams.get("package")?.trim() ?? "";
  const [selectedPackage, setSelectedPackage] = useState<ItinPackage | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(Boolean(packageSlug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    // When no package slug is present, `loading` is already initialized to
    // false (see useState above), so there is nothing to load or reset here.
    if (!packageSlug) return;

    let active = true;
    async function loadSelectedPackage() {
      setLoading(true);
      setError("");
      setUnavailable(false);
      try {
        const [{ package: loadedPackage }, { user: currentUser }] = await Promise.all([
          apiFetch<{ package: ItinPackage }>(`/api/forms/${encodeURIComponent(packageSlug)}`),
          apiFetch<{ user: AuthUser | null }>("/api/auth/me"),
        ]);
        if (!active) return;
        setSelectedPackage(loadedPackage);
        setUser(currentUser);
      } catch (cause) {
        console.error("Selected checkout package could not be loaded.", cause);
        if (!active) return;
        const message = cause instanceof Error ? cause.message.toLowerCase() : "";
        setUnavailable(message.includes("not found") || message.includes("not available"));
        setError("Selected package could not be loaded. Please go back and choose your package again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSelectedPackage();
    return () => {
      active = false;
    };
  }, [packageSlug]);

  async function startCheckout() {
    if (!selectedPackage) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await apiFetch<{ url: string | null }>("/api/checkout/create-session", {
        method: "POST",
        body: JSON.stringify({ packageSlug: selectedPackage.slug }),
      });
      if (!result.url) throw new Error("Stripe did not return a Checkout URL.");
      window.location.assign(result.url);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Payment could not be started. Please try again or contact support.",
      );
      setSubmitting(false);
    }
  }

  const selectedIndex = !selectedPackage ? 0 : user ? 2 : 1;

  return (
    <div className="min-h-screen bg-bg-light">
      <main className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 md:py-12">
        <nav aria-label="Checkout progress" className="mx-auto mb-8 flex max-w-[650px] items-start">
          {steps.map((label, index) => (
            <div key={label} className="flex min-w-0 flex-1 items-start last:flex-none">
              <div className="flex min-w-0 flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300 motion-reduce:transition-none",
                    index < selectedIndex && "border-navy bg-navy text-gold",
                    index === selectedIndex &&
                      "border-gold bg-white text-navy shadow-[0_0_0_4px_rgba(242,201,105,0.2)]",
                    index > selectedIndex && "border-border bg-bg-light text-text-muted",
                  )}
                  aria-current={index === selectedIndex ? "step" : undefined}
                >
                  {index < selectedIndex ? <Check size={14} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "max-w-24 text-center text-[11px] font-semibold transition-colors duration-300 sm:max-w-none sm:text-xs motion-reduce:transition-none",
                    index === selectedIndex ? "text-text-dark" : "text-text-mid",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "mt-4 h-px min-w-4 flex-1 transition-colors duration-500 sm:mx-3 motion-reduce:transition-none",
                    index < selectedIndex ? "bg-gold" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </nav>

        <div
          key={loading ? "loading" : selectedIndex}
          className={cn(
            "animate-step-in mx-auto",
            selectedPackage && user
              ? "max-w-[1240px]"
              : "max-w-[760px] rounded-card border border-border bg-white p-5 shadow-card sm:p-8",
          )}
        >
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-text-mid" role="status">
              <LoaderCircle className="animate-spin text-blue" />
              Loading selected package...
            </div>
          ) : !packageSlug ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <SearchX className="text-text-muted" size={34} />
              <h1 className="text-xl font-extrabold text-text-dark">Please select a package first</h1>
              <p className="text-sm text-text-mid">Choose an ITIN form package before starting checkout.</p>
              <Link href="/packages" className={cn(buttonVariants({ size: "md" }))}>Back to packages</Link>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <SearchX className="text-text-muted" size={34} />
              <h1 className="text-xl font-extrabold text-text-dark">
                {unavailable ? "Selected package is unavailable" : "Package could not be loaded"}
              </h1>
              <p className="max-w-md text-sm leading-6 text-text-mid">{error}</p>
              <Link href="/packages" className={cn(buttonVariants({ size: "md" }))}>Back to packages</Link>
            </div>
          ) : selectedPackage && user ? (
            <CheckoutReview
              customer={user}
              selectedPackage={selectedPackage}
              termsAccepted={termsAccepted}
              submitting={submitting}
              error={error}
              onTermsChange={setTermsAccepted}
              onBack={() => router.push("/packages")}
              onContinue={startCheckout}
            />
          ) : selectedPackage ? (
            <SelectedPackageSummary selectedPackage={selectedPackage} user={user} />
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <h1 className="text-xl font-extrabold text-text-dark">Package could not be loaded</h1>
              <Link href="/packages" className={cn(buttonVariants({ size: "md" }))}>Back to packages</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutFlow />
    </Suspense>
  );
}
