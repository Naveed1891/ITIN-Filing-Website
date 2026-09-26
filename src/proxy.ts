import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "itinready.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;

function requestHostname(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.hostname;

  return host.split(":")[0].toLowerCase();
}

export function proxy(request: NextRequest) {
  if (requestHostname(request) !== WWW_HOST) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.hostname = CANONICAL_HOST;
  destination.port = "";

  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: "/:path*",
};
