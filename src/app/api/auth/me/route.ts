import { json, routeError } from "@/server/http";
import { getCurrentUser, publicUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return json({ user: user ? publicUser(user) : null });
  } catch (error) {
    return routeError(error);
  }
}
