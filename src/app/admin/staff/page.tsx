import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardTitle } from "@/components/dashboard/DashboardPrimitives";
import { StaffManager } from "./StaffManager";
export const dynamic="force-dynamic";
export default async function StaffPage(){const user=await getCurrentUser();if(user?.role!=="SUPER_ADMIN")redirect("/admin");return <div className="space-y-8"><DashboardTitle title="Staff" description="Create staff accounts and control the administration modules each person can use."/><StaffManager/></div>}
