import { clearSession } from "@/server/auth";
import { json, routeError } from "@/server/http";


// User/auth/order/checkout data — never statically cached.
export const dynamic = "force-dynamic";
export async function POST() {
  try {
    await clearSession();
    return json({ ok: true });
  } catch (error) {
    return routeError(error);
  }
}
