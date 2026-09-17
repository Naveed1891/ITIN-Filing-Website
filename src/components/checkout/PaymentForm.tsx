"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { ShieldCheck } from "lucide-react";

interface PaymentFormProps {
  amount: number;
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentForm({ amount, onBack, onSuccess }: PaymentFormProps) {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [errors, setErrors] = useState<typeof card>({ number: "", expiry: "", cvc: "", name: "" });
  const [loading, setLoading] = useState(false);

  function field(key: keyof typeof card, value: string) {
    setCard((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate() {
    const e: typeof card = { number: "", expiry: "", cvc: "", name: "" };
    if (card.number.replace(/\s/g, "").length < 16)
      e.number = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "Use MM/YY format";
    if (card.cvc.length < 3) e.cvc = "Enter a valid CVC";
    if (!card.name.trim()) e.name = "Cardholder name is required";
    setErrors(e);
    return !Object.values(e).some(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onSuccess();
  }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <h2 className="text-[20px] font-extrabold text-text-dark">Payment</h2>

      <div className="bg-bg-light border border-border rounded-[10px] p-4 flex items-center gap-3">
        <ShieldCheck size={18} className="text-blue flex-shrink-0" />
        <span className="text-[13px] text-text-mid font-medium">
          Review the amount and payment details carefully before continuing.
        </span>
      </div>

      <FormField
        label="Cardholder name"
        value={card.name}
        onChange={(e) => field("name", e.target.value)}
        error={errors.name}
        autoComplete="cc-name"
        placeholder="As it appears on your card"
      />

      <FormField
        label="Card number"
        value={card.number}
        onChange={(e) => field("number", formatCardNumber(e.target.value))}
        error={errors.number}
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="1234 5678 9012 3456"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Expiry"
          value={card.expiry}
          onChange={(e) => field("expiry", formatExpiry(e.target.value))}
          error={errors.expiry}
          autoComplete="cc-exp"
          placeholder="MM/YY"
        />
        <FormField
          label="CVC"
          value={card.cvc}
          onChange={(e) => field("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
          error={errors.cvc}
          autoComplete="cc-csc"
          placeholder="•••"
          inputMode="numeric"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? "Processing…" : `Pay $${amount} securely`}
        </Button>
        <Button
          type="button"
          variant="text"
          size="md"
          onClick={onBack}
          className="text-text-muted hover:text-text-dark text-[13px]"
        >
          ← Back
        </Button>
      </div>

      <p className="text-center text-[11.5px] text-text-muted">
        By completing payment you agree to our{" "}
        <Link href="/terms-and-conditions" className="underline hover:text-text-dark">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/refund-policy" className="underline hover:text-text-dark">
          Refund Policy
        </Link>
        .
      </p>
    </form>
  );
}
