export function loginRedirectForPackage(packageSlug: string) {
  return authRedirectForPackage("login", packageSlug);
}

export function signupRedirectForPackage(packageSlug: string) {
  return authRedirectForPackage("signup", packageSlug);
}

export function checkoutReturnTo(packageSlug: string) {
  return `/checkout?package=${encodeURIComponent(packageSlug)}`;
}

function authRedirectForPackage(route: "login" | "signup", packageSlug: string) {
  return `/${route}?returnTo=${encodeURIComponent(checkoutReturnTo(packageSlug))}`;
}
