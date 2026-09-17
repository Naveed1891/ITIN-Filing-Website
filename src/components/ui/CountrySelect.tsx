"use client";

import { useState } from "react";
import { COUNTRIES, flagEmoji } from "@/lib/countries";

interface CountrySelectProps {
  name?: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  onCountryChange?: (name: string) => void;
}

/** Accessible country dropdown. Submits the country name (matches the API). */
export function CountrySelect({
  name = "country",
  label = "Country",
  required,
  defaultValue = "",
  onCountryChange,
}: CountrySelectProps) {
  const [value, setValue] = useState(defaultValue);
  const fieldId = "country";

  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={fieldId} className="text-[12.5px] font-semibold text-text-mid uppercase tracking-[0.08em]">
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-error">*</span> : null}
      </label>
      <select
        id={fieldId}
        name={name}
        required={required}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onCountryChange?.(e.target.value);
        }}
        className="h-12 w-full rounded-btn border border-border-mid bg-white px-[12px] text-[14px] text-text-dark focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
      >
        <option value="" disabled>
          Select your country
        </option>
        {COUNTRIES.map((c) => (
          <option key={`${c.iso2}-${c.name}`} value={c.name}>
            {flagEmoji(c.iso2)} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
