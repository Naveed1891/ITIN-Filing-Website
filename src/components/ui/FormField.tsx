"use client";

import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Optional trailing control rendered inside the input (e.g. a show/hide toggle). */
  endAdornment?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({
  label,
  error,
  hint,
  id,
  className,
  endAdornment,
  ...props
}, ref) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-[7px]">
      <label
        htmlFor={fieldId}
        className="text-[12.5px] font-semibold text-text-mid uppercase tracking-[0.08em]"
      >
        {label}
        {props.required ? (
          <span aria-hidden="true" className="ml-1 text-error">*</span>
        ) : null}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            "h-12 w-full px-[14px] rounded-btn border bg-white text-[14px] text-text-dark",
            "placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition",
            endAdornment && "pr-12",
            error
              ? "border-error focus:ring-error/30 focus:border-error"
              : "border-border-mid",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          {...props}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-[11.5px] text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${fieldId}-error`}
          className="text-[12px] text-error flex items-center gap-1.5"
          role="alert"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});
