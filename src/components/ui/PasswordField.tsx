"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Password input with an accessible show/hide toggle. Reuses FormField so labels,
 * hints, error text, aria-invalid and aria-describedby stay consistent.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, hint, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <FormField
        ref={ref}
        label={label}
        error={error}
        hint={hint}
        type={visible ? "text" : "password"}
        {...props}
        endAdornment={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="flex size-9 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/30"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
    );
  },
);
