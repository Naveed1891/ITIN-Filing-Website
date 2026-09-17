import { NextResponse } from "next/server";
import { ZodError } from "zod";

// API responses carry auth/order/checkout/user data, so they must never be
// cached by the browser, Next.js, or any intermediary proxy.
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: NO_STORE_HEADERS });
}

export function errorJson(message: string, status = 400) {
  return json({ error: message }, status);
}

export async function parseJson<T>(request: Request, schema: { parse(value: unknown): T }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues[0]?.message ?? "Invalid request.");
    }
    throw error;
  }
}

export function routeError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") return errorJson("Please sign in to continue.", 401);
    if (error.message === "FORBIDDEN") return errorJson("You do not have access to this resource.", 403);
    if (error.message === "NOT_FOUND") return errorJson("The requested resource was not found.", 404);
    if (error.message === "INVALID_JSON") return errorJson("Invalid JSON request body.", 400);
    return errorJson(error.message, 400);
  }
  return errorJson("Something went wrong.", 500);
}
