import { json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST() {
  return json({ error: "Card payments are temporarily unavailable. Please use bank transfer." }, 410);
}
