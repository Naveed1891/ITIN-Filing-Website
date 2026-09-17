"use client";

import { useMemo, useState } from "react";
import { COUNTRIES, flagEmoji } from "@/lib/countries";

interface PhoneInputProps {
  name?: string;
  label?: string;
  required?: boolean;
  /** ISO-2 code to preselect the dial code, e.g. "US" or "PK". */
  defaultIso2?: string;
}

/**
 * International phone input: a country-code dropdown plus a national-number
 * field whose digit limit is enforced per country. Submits the composed E.164
 * value (e.g. +923001234567) via a hidden input named `name`.
 */
export function PhoneInput({
  name = "whatsapp",
  label = "WhatsApp number",
  required,
  defaultIso2 = "US",
}: PhoneInputProps) {
  const [iso2, setIso2] = useState(defaultIso2);
  const [digits, setDigits] = useState("");

  const country = useMemo(
    () => COUNTRIES.find((c) => c.iso2 === iso2) ?? COUNTRIES.find((c) => c.iso2 === "US")!,
    [iso2],
  );

  const composed = digits ? `+${country.dial}${digits}` : "";
  const tooShort = digits.length > 0 && digits.length < country.min;
  const lengthLabel = country.min === country.max ? `${country.min} digits` : `${country.min}–${country.max} digits`;
  const fieldId = "whatsapp-national";

  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={fieldId} className="text-[12.5px] font-semibold text-text-mid uppercase tracking-[0.08em]">
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-error">*</span> : null}
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Country calling code"
          value={iso2}
          onChange={(e) => {
            setIso2(e.target.value);
            const next = COUNTRIES.find((c) => c.iso2 === e.target.value);
            if (next) setDigits((d) => d.slice(0, next.max));
          }}
          className="h-12 w-[110px] shrink-0 rounded-btn border border-border-mid bg-white px-2 text-[14px] text-text-dark focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
        >
          {COUNTRIES.map((c) => (
            <option key={`${c.iso2}-${c.name}`} value={c.iso2}>
              {flagEmoji(c.iso2)} +{c.dial}
            </option>
          ))}
        </select>
        <input
          id={fieldId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          value={digits}
          maxLength={country.max}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, country.max))}
          placeholder={"0".repeat(country.max)}
          aria-invalid={tooShort}
          className={`h-12 flex-1 rounded-btn border bg-white px-[14px] text-[14px] text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition ${
            tooShort ? "border-error" : "border-border-mid"
          }`}
        />
      </div>
      <input type="hidden" name={name} value={composed} />
      {tooShort ? (
        <p className="text-[12px] text-error flex items-center gap-1.5" role="alert">
          <span aria-hidden="true">⚠</span>
          Enter {lengthLabel} after +{country.dial} for {country.name}.
        </p>
      ) : (
        <p className="text-[11.5px] text-text-muted">
          {country.name}: {lengthLabel} after +{country.dial}.
        </p>
      )}
    </div>
  );
}
