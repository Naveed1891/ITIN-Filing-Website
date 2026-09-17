/**
 * Safe redirect-target handling for auth flows (login / signup / setup-account).
 *
 * `returnTo` comes from the URL query string, so it is untrusted. We only ever
 * follow internal, absolute paths. Anything that could send the user to another
 * origin — absolute URLs, protocol-relative `//host`, or backslash smuggling —
 * is rejected in favour of a safe internal fallback. This prevents open-redirect
 * attacks while preserving the selected-package checkout URL, e.g.
 * `/checkout?package=new-itin-application`.
 */
export const DEFAULT_RETURN_TO = "/";

function isCustomerDashboardRedirectPath(path: string): boolean {
  return path === "/orders" || path.startsWith("/orders/");
}

export function safeReturnTo(
  value: string | null | undefined,
  fallback: string = DEFAULT_RETURN_TO,
): string {
  if (typeof value !== "string") return fallback;

  const candidate = value.trim();

  // Must be a root-relative path.
  if (!candidate.startsWith("/")) return fallback;
  // Reject protocol-relative ("//evil.com") and backslash tricks ("/\evil.com").
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return fallback;
  // Reject any backslash, which some browsers normalise to "/".
  if (candidate.includes("\\")) return fallback;
  // Reject control characters that could be used to smuggle a new target.
  if (/[\x00-\x1f\x7f]/.test(candidate)) return fallback;

  // Never bounce back to auth pages after sign-in.
  if (
    candidate === "/login" ||
    candidate === "/signup" ||
    candidate.startsWith("/login?") ||
    candidate.startsWith("/signup?")
  ) {
    return fallback;
  }

  // Legacy /orders routes redirect out to the external customer dashboard.
  const pathOnly = candidate.split("?")[0] ?? candidate;
  if (isCustomerDashboardRedirectPath(pathOnly)) {
    return fallback;
  }

  return candidate;
}

/** Login link that returns users to the current website page after sign-in. */
export function websiteLoginHref(pathname: string, search = ""): string {
  if (pathname === "/login" || pathname === "/signup") {
    return "/login";
  }
  const returnTo = safeReturnTo(`${pathname}${search}`);
  if (returnTo === DEFAULT_RETURN_TO) {
    return "/login";
  }
  return `/login?returnTo=${encodeURIComponent(returnTo)}`;
}
