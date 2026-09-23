"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { PasswordField } from "@/components/ui/PasswordField";
import { PasswordRequirements } from "@/components/ui/PasswordRequirements";
import { OtpInput } from "@/components/ui/OtpInput";
import { apiFetch } from "@/lib/api-client";

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const emailValue = String(form.get("email"));
    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: emailValue }),
      });
      setEmail(emailValue);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const codeValue = String(form.get("code"));
    if (!/^\d{6}$/.test(codeValue)) {
      setError("Enter a valid six-digit code.");
      setSubmitting(false);
      return;
    }
    setCode(codeValue);
    setStep("password");
    setSubmitting(false);
  }

  async function handlePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
          password: form.get("password"),
          confirmPassword: form.get("confirmPassword"),
        }),
      });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      if ((err instanceof Error) && err.message.includes("verification code")) {
        setStep("code");
        setCode("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const titles: Record<Step, { heading: string; sub: string }> = {
    email: { heading: "Reset password", sub: "Enter your email to receive a verification code" },
    code: { heading: "Check your email", sub: `Enter the 6-digit code sent to ${email}` },
    password: { heading: "Set new password", sub: "Create a strong password for your account" },
  };

  const onSubmit = step === "email" ? handleEmail : step === "code" ? handleCode : handlePassword;

  return (
    <div
      className="relative isolate flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "radial-gradient(90% 60% at 50% -10%, rgba(17,46,81,0.08), transparent 60%), #F4F6F8",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(17,46,81,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(60% 60% at 50% 35%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 35%, black 30%, transparent 100%)",
        }}
      />

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="animate-step-in w-full max-w-[440px]">
          <div className="rounded-[22px] bg-gradient-to-b from-gold/60 via-gold/20 to-transparent p-px shadow-[0_36px_90px_-48px_rgba(11,33,56,0.55)]">
            <div className="flex flex-col gap-6 rounded-[21px] bg-white p-8 sm:p-9">
              <div className="flex flex-col gap-1.5 text-center">
                <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-text-dark">
                  {titles[step].heading}
                </h1>
                <p className="text-[14px] text-text-muted">{titles[step].sub}</p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                {step === "email" && (
                  <FormField
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                )}

                {step === "code" && <OtpInput name="code" disabled={submitting} />}

                {step === "password" && (
                  <>
                    <PasswordField
                      label="New password"
                      name="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordRequirements password={password} email={email} />
                    <PasswordField
                      label="Confirm password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </>
                )}

                {error && (
                  <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                  {submitting && <LoaderCircle size={16} className="animate-spin" />}
                  {step === "email" && "Send code"}
                  {step === "code" && "Verify code"}
                  {step === "password" && "Reset password"}
                </Button>

                {step === "code" && (
                  <button
                    type="button"
                    className="text-[13px] text-blue hover:underline"
                    disabled={submitting}
                    onClick={async () => {
                      setError("");
                      try {
                        await apiFetch("/api/auth/forgot-password", {
                          method: "POST",
                          body: JSON.stringify({ email }),
                        });
                        setError("");
                      } catch {
                        setError("Could not resend the code. Try again.");
                      }
                    }}
                  >
                    Resend code
                  </button>
                )}
              </form>

              <div className="border-t border-border pt-5 text-center">
                <p className="text-[13.5px] text-text-muted">
                  Remember your password?{" "}
                  <Link href="/login" className="font-semibold text-blue hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[12px] text-text-muted">
            Private preparation service · Your data stays confidential
          </p>
        </div>
      </div>
    </div>
  );
}
