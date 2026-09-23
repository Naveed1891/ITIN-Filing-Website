"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { COUNTRIES, flagEmoji } from "@/lib/countries";
import {
  applicationOptions,
  type ApplicationOption,
  type ItinApplicationValues,
} from "@/features/itin/schema";

const labelClass =
  "text-[12.5px] font-semibold text-text-mid uppercase tracking-[0.08em]";
const inputClass =
  "h-12 w-full rounded-btn border border-border-mid bg-white px-3.5 text-sm text-text-dark transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/30";

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-text-dark">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-text-mid">{description}</p>
    </div>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-error" role="alert">{message}</p>;
}

function formError(errors: object, field: string): string | undefined {
  if (!(field in errors)) return undefined;
  const error = (errors as Record<string, unknown>)[field];
  if (!error || typeof error !== "object" || !("message" in error)) return undefined;
  return typeof error.message === "string" ? error.message : undefined;
}

export function ApplicationOptionStep({
  onOptionChange,
}: {
  onOptionChange: (option: ApplicationOption) => void;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ItinApplicationValues>();
  const selected = useWatch({ control, name: "applicationOption" });
  const applicationOptionError = formError(errors, "applicationOption");

  return (
    <div className="flex flex-col gap-6">
      <StepHeading title="Application option" description="Choose the option that matches your situation. Your form updates immediately." />
      <div>
        <label htmlFor="applicationOption" className={labelClass}>
          Application option <span className="text-error">*</span>
        </label>
        <select
          id="applicationOption"
          value={selected ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value) onOptionChange(value as ApplicationOption);
          }}
          className={`${inputClass} mt-1.5`}
          aria-invalid={Boolean(applicationOptionError)}
          aria-describedby={applicationOptionError ? "application-option-error" : undefined}
        >
          <option value="">Select an option…</option>
          {applicationOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <p id="application-option-error">
          <InlineError message={applicationOptionError} />
        </p>
      </div>
    </div>
  );
}

export function PersonalDetailsStep({ isRenewal = false }: { isRenewal?: boolean }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ItinApplicationValues>();
  const sameAsBirthName = useWatch({ control, name: "sameAsBirthName" });

  return (
    <div className="flex flex-col gap-6">
      <StepHeading title="Personal details" description="Enter the details exactly as they appear on your passport." />
      {isRenewal && (
        <FormField label="ITIN Number *" placeholder="9XX-XX-XXXX" error={formError(errors, "itinNumber")} {...register("itinNumber")} />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First Name *" autoComplete="given-name" error={formError(errors, "firstName")} {...register("firstName")} />
        <FormField label="Last Name (Surname) *" autoComplete="family-name" error={formError(errors, "lastName")} {...register("lastName")} />
      </div>
      <fieldset>
        <legend className={labelClass}>
          Is the above Name/Surname the same as your birth Name/Surname? <span className="text-error">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {(["yes", "no"] as const).map((value) => (
            <label key={value} className="flex min-w-28 cursor-pointer items-center gap-2 rounded-btn border border-border px-4 py-3 text-sm font-semibold text-text-dark has-[:checked]:border-blue has-[:checked]:bg-blue/[0.04]">
              <input type="radio" value={value} className="accent-blue" {...register("sameAsBirthName")} />
              {value === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
        <InlineError message={formError(errors, "sameAsBirthName")} />
      </fieldset>
      {sameAsBirthName === "no" && (
        <div className="grid gap-4 rounded-xl border border-border bg-bg-light p-4 sm:grid-cols-2">
          <FormField label="Birth First Name *" error={formError(errors, "birthFirstName")} {...register("birthFirstName")} />
          <FormField label="Birth Last Name / Surname *" error={formError(errors, "birthLastName")} {...register("birthLastName")} />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone Number (with country code) *" type="tel" placeholder="+1 5551234567" autoComplete="tel" error={formError(errors, "phone")} {...register("phone")} />
        <FormField label="Email *" type="email" autoComplete="email" error={formError(errors, "email")} {...register("email")} />
      </div>
    </div>
  );
}

export function AddressStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ItinApplicationValues>();

  return (
    <div className="flex flex-col gap-6">
      <StepHeading title="Ownership and address" description="Provide your ownership percentage and current address." />
      <FormField label="OWNERSHIP % *" type="number" min="0.01" max="100" step="0.01" error={formError(errors, "ownershipPercentage")} {...register("ownershipPercentage")} />
      <FormField label="Street Address *" autoComplete="street-address" error={formError(errors, "streetAddress")} {...register("streetAddress")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="City *" autoComplete="address-level2" error={formError(errors, "city")} {...register("city")} />
        <FormField label="State / Province / Region *" autoComplete="address-level1" error={formError(errors, "stateProvince")} {...register("stateProvince")} />
        <FormField label="ZIP / Postal Code *" autoComplete="postal-code" error={formError(errors, "postalCode")} {...register("postalCode")} />
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="country" className={labelClass}>Country <span className="text-error">*</span></label>
          <select
            id="country"
            autoComplete="country-name"
            className={inputClass}
            aria-invalid={!!formError(errors, "country")}
            {...register("country")}
          >
            <option value="">Select your country…</option>
            {COUNTRIES.map((c) => (
              <option key={`${c.iso2}-${c.name}`} value={c.name}>{flagEmoji(c.iso2)} {c.name}</option>
            ))}
          </select>
          <InlineError message={formError(errors, "country")} />
        </div>
      </div>
    </div>
  );
}
