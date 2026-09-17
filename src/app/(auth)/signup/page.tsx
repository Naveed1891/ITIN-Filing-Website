"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordField } from "@/components/ui/PasswordField";
import { PasswordRequirements } from "@/components/ui/PasswordRequirements";
import { apiFetch } from "@/lib/api-client";
import { safeReturnTo } from "@/lib/return-to";
import { isPasswordValid } from "@/lib/password";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo") ?? searchParams.get("next"));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);

    // Client-side checks mirror the server (src/lib/password) and move focus to
    // the first problem field. The server still re-validates every submit.
    const nextFieldErrors: Record<string, string> = {};
    if (!isPasswordValid(password, { email, name: fullName })) {
      nextFieldErrors.password = "Your password does not meet all the requirements below.";
    } else if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("");
      const firstInvalid = Object.keys(nextFieldErrors)[0];
      (formEl.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          whatsapp: form.get("whatsapp"),
          country: form.get("country"),
          password,
          confirmPassword,
          termsAccepted: form.get("termsAccepted") === "on",
        }),
      });
      // Signup creates the session cookie server-side, so the user is now
      // authenticated. Return them to the preserved, validated returnTo URL.
      router.push(returnTo);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Account creation failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="bg-white rounded-card border border-border p-8 md:p-6 w-full max-w-[420px] flex flex-col gap-6"
          style={{ boxShadow: "0 30px 80px -50px rgba(13,58,43,.4)" }}
        >
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="text-[24px] font-extrabold text-text-dark">
              Create your account
            </h1>
            <p className="text-[14px] text-text-muted">
              Track your application and manage your documents
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
            {error && (
              <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
                {error}
              </p>
            )}
            <FormField
              label="Full name"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FormField
              label="Email address"
              name="email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PhoneInput label="WhatsApp number" name="whatsapp" required />
            <CountrySelect label="Country" name="country" required />
            <div className="flex flex-col gap-2">
              <PasswordField
                label="Password"
                name="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                required
              />
              <PasswordRequirements password={password} email={email} name={fullName} />
            </div>
            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              placeholder="Repeat password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword ?? (confirmMismatch ? "Passwords do not match." : undefined)}
              required
            />
            <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-border bg-bg-light/60 p-4 text-[12.5px] leading-5 text-text-muted">
              <input name="termsAccepted" type="checkbox" className="mt-1 size-4 shrink-0 accent-[#205493]" required />
              <span>
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="underline hover:text-text-dark">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-text-dark">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
              {submitting && <LoaderCircle size={16} className="animate-spin" />}
              Create account
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center">
            <p className="text-[13.5px] text-text-muted">
              Already have an account?{" "}
              <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-blue font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
