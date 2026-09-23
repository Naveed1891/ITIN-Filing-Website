"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { PasswordField } from "@/components/ui/PasswordField";
import { apiFetch } from "@/lib/api-client";
import { safeReturnTo } from "@/lib/return-to";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo") ?? searchParams.get("next"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (otpEmail) {
        await apiFetch("/api/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ email: otpEmail, code: form.get("code") }),
        });
        router.push(returnTo);
        router.refresh();
        return;
      }
      const result = await apiFetch<{ otpRequired?: boolean }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (result.otpRequired) {
        setOtpEmail(String(form.get("email")));
        setSubmitting(false);
        return;
      }
      router.push(returnTo);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="relative isolate flex min-h-screen flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(90% 60% at 50% -10%, rgba(17,46,81,0.08), transparent 60%), #F4F6F8",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(17,46,81,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(60% 60% at 50% 35%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(60% 60% at 50% 35%, black 30%, transparent 100%)",
        }}
      />

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="animate-step-in w-full max-w-[440px]">
          <div className="rounded-[22px] bg-gradient-to-b from-gold/60 via-gold/20 to-transparent p-px shadow-[0_36px_90px_-48px_rgba(11,33,56,0.55)]">
            <div className="flex flex-col gap-6 rounded-[21px] bg-white p-8 sm:p-9">
              <div className="flex flex-col gap-1.5 text-center">
                <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-text-dark">
                  Welcome{" "}
                  <em className="font-serif font-bold italic text-blue">
                    back
                  </em>
                </h1>
                <p className="text-[14px] text-text-muted">
                  {otpEmail ? `Enter the code sent to ${otpEmail}` : "Sign in to track your application"}
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={submit}>
                {otpEmail ? <FormField
                  label="Six-digit verification code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  required
                /> : <><FormField
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                </>}
                <div className="flex justify-end">
                  <Link
                    href="/contact"
                    className="text-[12.5px] font-medium text-blue hover:underline"
                  >
                    Need sign-in help?
                  </Link>
                </div>
                {error && <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                  {submitting && <LoaderCircle size={16} className="animate-spin" />}
                  {otpEmail ? "Verify and sign in" : "Sign in"}
                </Button>
              </form>

              <div className="border-t border-border pt-5 text-center">
                <p className="text-[13.5px] text-text-muted">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
                    className="font-semibold text-blue hover:underline"
                  >
                    Create account
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
