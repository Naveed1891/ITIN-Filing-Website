"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CountryCombobox } from "@/components/ui/CountryCombobox";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface ContactFormProps {
  onNext: (data: ContactFormData) => void;
}

export function ContactForm({ onNext }: ContactFormProps) {
  const [data, setData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  function validate(): boolean {
    const newErrors: Partial<ContactFormData> = {};
    if (!data.firstName.trim()) newErrors.firstName = "First name is required";
    if (!data.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Please enter a valid email address";
    if (!data.country) newErrors.country = "Please select your country";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(data);
  }

  function field(key: keyof ContactFormData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <h2 className="text-[20px] font-extrabold text-text-dark">
        Your information
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <FormField
          label="First name"
          value={data.firstName}
          onChange={(e) => field("firstName", e.target.value)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <FormField
          label="Last name"
          value={data.lastName}
          onChange={(e) => field("lastName", e.target.value)}
          error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      <FormField
        label="Email address"
        type="email"
        value={data.email}
        onChange={(e) => field("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <FormField
        label="Phone number"
        type="tel"
        value={data.phone}
        onChange={(e) => field("phone", e.target.value)}
        autoComplete="tel"
        hint="Optional, for urgent communication only"
      />

      <div className="flex flex-col gap-[7px]">
        <label
          htmlFor="country"
          className="text-[12.5px] font-semibold text-text-mid uppercase tracking-[0.08em]"
        >
          Country of residence
        </label>
        <CountryCombobox id="country" value={data.country} onChange={(country) => field("country", country)} invalid={Boolean(errors.country)} autoComplete="country-name" />
        {errors.country && (
          <p className="text-[12px] text-error flex items-center gap-1.5" role="alert">
            <span aria-hidden>⚠</span> {errors.country}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Continue to payment
      </Button>

      <p className="text-center text-[12px] text-text-muted">
        Your information is encrypted and never shared with third parties.
      </p>
    </form>
  );
}
