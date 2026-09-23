import { getCurrentUser } from "@/server/auth";
import { PageHeading, Panel } from "@/components/dashboard/DashboardPrimitives";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function DashboardProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <>
      <PageHeading
        title="Profile"
        description="Update your personal details. Email changes require verification."
      />
      <Panel title="Personal details">
        <ProfileEditor
          initialName={user.fullName}
          initialEmail={user.email}
          initialWhatsapp={user.whatsapp}
          initialCountry={user.country}
        />
      </Panel>
    </>
  );
}
