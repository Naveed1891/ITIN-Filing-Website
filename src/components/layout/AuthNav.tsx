"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";
import { websiteLoginHref } from "@/lib/return-to";
import type { AuthUser } from "@/features/itin/types";

// `undefined` = still resolving (render a neutral skeleton, never flash the
// wrong logged-in/out buttons). `null` = confirmed logged out. Object = logged in.
type AuthState = AuthUser | null | undefined;

interface AuthNavProps {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

function AuthNavSkeleton({ variant }: { variant: "desktop" | "mobile" }) {
  return variant === "desktop" ? (
    <span aria-hidden className="h-9 w-[150px] animate-pulse rounded-btn bg-white/10" />
  ) : (
    <>
      <span aria-hidden className="h-11 animate-pulse rounded-btn bg-white/10" />
      <span aria-hidden className="h-11 animate-pulse rounded-btn bg-white/10" />
    </>
  );
}

function AuthNavContent({ variant, onNavigate }: AuthNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loginHref = websiteLoginHref(pathname, searchParams.toString() ? `?${searchParams.toString()}` : "");
  const [user, setUser] = useState<AuthState>(undefined);
  const [loggingOut, setLoggingOut] = useState(false);

  // Re-check the session on every route change so the header reflects login,
  // signup auto-login, and logout immediately — no manual refresh needed.
  useEffect(() => {
    let active = true;
    apiFetch<{ user: AuthUser | null }>("/api/auth/me")
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Clear the UI regardless; the cookie is cleared server-side on success.
    }
    setUser(null);
    setLoggingOut(false);
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  const isDesktop = variant === "desktop";

  // Loading skeleton — matches the CTA footprint to avoid layout shift.
  if (user === undefined) {
    return isDesktop ? (
      <span aria-hidden className="h-9 w-[150px] animate-pulse rounded-btn bg-white/10" />
    ) : (
      <>
        <span aria-hidden className="h-11 animate-pulse rounded-btn bg-white/10" />
        <span aria-hidden className="h-11 animate-pulse rounded-btn bg-white/10" />
      </>
    );
  }

  if (isDesktop) {
    return user ? (
      <>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white/75 transition-colors hover:text-white disabled:opacity-60 xl:text-[14px]"
        >
          {loggingOut && <LoaderCircle size={14} className="animate-spin" />}
          Log out
        </button>
        <Link
          href={customerDashboardUrl("/dashboard")}
          className="text-[13px] font-bold text-white/75 transition-colors hover:text-white xl:text-[14px]"
        >
          Dashboard
        </Link>
        <Link
          href={customerDashboardUrl("/dashboard/orders")}
          className="whitespace-nowrap rounded-btn bg-white px-[16px] py-[9px] text-[13px] font-bold text-navy transition-all hover:bg-gold hover:text-navy-deep xl:px-[18px] xl:py-[10px] xl:text-[14px]"
        >
          My Orders
        </Link>
      </>
    ) : (
      <>
        <Link
          href={loginHref}
          className="text-[13px] font-bold text-white/75 transition-colors hover:text-white xl:text-[14px]"
        >
          Login
        </Link>
        <Link
          href="/packages"
          className="whitespace-nowrap rounded-btn bg-white px-[16px] py-[9px] text-[13px] font-bold text-navy transition-all hover:bg-gold hover:text-navy-deep xl:px-[18px] xl:py-[10px] xl:text-[14px]"
        >
          Get Started
        </Link>
      </>
    );
  }

  // Mobile
  return user ? (
    <>
      <Link
        href={customerDashboardUrl("/dashboard")}
        onClick={onNavigate}
        className="block rounded-btn border border-white/20 px-5 py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-white/10"
      >
        Dashboard
      </Link>
      <Link
        href={customerDashboardUrl("/dashboard/orders")}
        onClick={onNavigate}
        className="block rounded-btn bg-white px-5 py-3 text-center text-[14px] font-bold text-navy transition-colors hover:bg-bg-light"
      >
        My Orders
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center justify-center gap-1.5 rounded-btn border border-white/20 px-5 py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        {loggingOut && <LoaderCircle size={16} className="animate-spin" />}
        Log out
      </button>
    </>
  ) : (
    <>
      <Link
        href={loginHref}
        onClick={onNavigate}
        className="block rounded-btn border border-white/20 px-5 py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-white/10"
      >
        Login
      </Link>
      <Link
        href="/packages"
        onClick={onNavigate}
        className="block rounded-btn bg-white px-5 py-3 text-center text-[14px] font-bold text-navy transition-colors hover:bg-bg-light"
      >
        Get Started
      </Link>
    </>
  );
}

export function AuthNav(props: AuthNavProps) {
  return (
    <Suspense fallback={<AuthNavSkeleton variant={props.variant} />}>
      <AuthNavContent {...props} />
    </Suspense>
  );
}
