"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { passwordRequirements, passwordStrength } from "@/lib/password";

interface PasswordRequirementsProps {
  password: string;
  email?: string;
  name?: string;
  showStrength?: boolean;
}

const STRENGTH_STYLES = {
  Weak: "text-error",
  Good: "text-blue",
  Strong: "text-navy",
} as const;

/** Live password requirement checklist + strength meter for signup/setup forms. */
export function PasswordRequirements({
  password,
  email,
  name,
  showStrength = true,
}: PasswordRequirementsProps) {
  const requirements = passwordRequirements(password, { email, name });
  const strength = passwordStrength(password);
  const touched = password.length > 0;

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-border bg-bg-light/60 p-3" aria-live="polite">
      {showStrength && touched ? (
        <p className="text-[12px] text-text-muted">
          Strength: <span className={cn("font-bold", STRENGTH_STYLES[strength])}>{strength}</span>
        </p>
      ) : null}
      <ul className="grid gap-1.5">
        {requirements.map((requirement) => (
          <li key={requirement.id} className="flex items-center gap-2 text-[12px]">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full",
                requirement.met ? "bg-blue/10 text-blue" : "bg-border text-text-muted",
              )}
            >
              {requirement.met ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
              )}
            </span>
            <span className={requirement.met ? "text-text-dark" : "text-text-muted"}>
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
