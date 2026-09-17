import { redirect } from "next/navigation";
import { safeReturnTo } from "@/lib/return-to";

export default async function SetupAccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw =
    typeof params.returnTo === "string"
      ? params.returnTo
      : typeof params.next === "string"
        ? params.next
        : "";
  // Only preserve a safe internal returnTo; drop anything external.
  const returnTo = raw ? safeReturnTo(raw, "") : "";
  redirect(returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup");
}
