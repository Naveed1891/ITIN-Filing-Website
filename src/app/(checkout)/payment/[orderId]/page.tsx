"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { apiFetch } from "@/lib/api-client";
import type { AuthUser, ItinOrder, ItinPackage } from "@/features/itin/types";

export default function PaymentPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<ItinOrder | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ItinPackage | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [{ order: loadedOrder }, { user: currentUser }] = await Promise.all([
          apiFetch<{ order: ItinOrder }>(`/api/orders/${params.orderId}`),
          apiFetch<{ user: AuthUser | null }>("/api/auth/me"),
        ]);
        if (!currentUser) {
          router.replace(`/login?returnTo=${encodeURIComponent(`/payment/${params.orderId}`)}`);
          return;
        }
        if (loadedOrder.applicationStatus !== "SUBMITTED") {
          router.replace(`/application/${params.orderId}`);
          return;
        }
        if (loadedOrder.status !== "PENDING_PAYMENT") {
          router.replace(`/dashboard/orders/${encodeURIComponent(loadedOrder.reference)}`);
          return;
        }
        const { package: pkg } = await apiFetch<{ package: ItinPackage }>(
          `/api/forms/${encodeURIComponent(loadedOrder.packageSlug)}`,
        );
        if (!active) return;
        setOrder(loadedOrder);
        setSelectedPackage(pkg);
        setUser(currentUser);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Payment could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [params.orderId, router]);

  async function submitPaymentProof(proof: File) {
    if (!order) return;
    setSubmitting(true);
    setError("");
    try {
      if (proof.size > 5 * 1024 * 1024) throw new Error("Payment proof must be 5 MB or smaller.");
      const bytes = new Uint8Array(await proof.arrayBuffer());
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      await apiFetch("/api/checkout/bank-transfer", {
        method: "POST",
        body: JSON.stringify({
          orderId: order.id,
          fileName: proof.name,
          mimeType: proof.type,
          fileBase64: btoa(binary),
        }),
      });
      router.push(`/dashboard/orders/${encodeURIComponent(order.reference)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment proof could not be submitted.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="flex min-h-[70vh] items-center justify-center gap-3 text-sm text-text-mid"><LoaderCircle className="animate-spin text-blue" /> Loading payment…</main>;
  }

  if (!order || !selectedPackage || !user) {
    return <main className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-5 text-center text-sm text-error">{error || "Payment is unavailable."}</main>;
  }

  return (
    <main className="min-h-screen bg-bg-light px-4 py-8 sm:px-6 md:py-12">
      <CheckoutReview
        customer={user}
        selectedPackage={selectedPackage}
        termsAccepted={termsAccepted}
        submitting={submitting}
        error={error}
        onTermsChange={setTermsAccepted}
        onBack={() => router.push(`/application/${order.id}`)}
        onContinue={submitPaymentProof}
      />
    </main>
  );
}
