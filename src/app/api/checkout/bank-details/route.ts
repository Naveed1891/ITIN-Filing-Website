import { requireUser } from "@/server/auth";
import { getOperationalSettings } from "@/server/operational-settings";
import { json, routeError } from "@/server/http";
export const dynamic="force-dynamic";
export async function GET(){try{await requireUser();const {bank}=await getOperationalSettings();return json({bank});}catch(error){return routeError(error)}}
