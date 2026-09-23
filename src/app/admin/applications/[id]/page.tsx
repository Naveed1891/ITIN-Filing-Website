import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { PageHeading, Panel, StatusBadge, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(actor.role)) redirect("/admin");

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: true,
      order: { include: { package: true } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!application) notFound();

  let formData: Record<string, unknown> = {};
  try {
    formData = JSON.parse(application.applicationJson || "{}");
  } catch { /* invalid JSON */ }

  return (
    <>
      <PageHeading
        eyebrow={<Link href="/admin/applications" className="dash-back-link">&larr; All applications</Link>}
        title={`Application for ${application.order.reference}`}
        description={`${application.user.fullName} · ${application.order.package.name}`}
        action={<StatusBadge status={application.status} />}
      />

      <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="dash-stat"><span className="dash-stat__label">Status</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}><StatusBadge status={application.status} /></span></div>
        <div className="dash-stat"><span className="dash-stat__label">Declaration</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}>{application.declarationAccepted ? "Accepted" : "Pending"}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Documents</span><span className="dash-stat__value">{application.documents.length}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Submitted</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}>{application.submittedAt ? formatDate(application.submittedAt) : "Not yet"}</span></div>
      </div>

      <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <Panel title="Applicant">
          <dl className="dash-dl">
            <div><dt>Name</dt><dd><Link href={`/admin/customers/${application.user.id}`} className="dash-link">{application.user.fullName}</Link></dd></div>
            <div><dt>Email</dt><dd>{application.user.email}</dd></div>
            <div><dt>WhatsApp</dt><dd>{application.user.whatsapp}</dd></div>
            <div><dt>Country</dt><dd>{application.user.country}</dd></div>
          </dl>
        </Panel>

        <Panel title="Order">
          <dl className="dash-dl">
            <div><dt>Reference</dt><dd><Link href={`/admin/orders/${application.order.id}`} className="dash-link">{application.order.reference}</Link></dd></div>
            <div><dt>Package</dt><dd>{application.order.package.name}</dd></div>
            <div><dt>Order status</dt><dd><StatusBadge status={application.order.status} /></dd></div>
            <div><dt>Created</dt><dd>{formatDate(application.order.createdAt)}</dd></div>
          </dl>
        </Panel>
      </div>

      {Object.keys(formData).length > 0 && (
        <Panel title="Application data">
          <dl className="dash-dl">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <dt>{key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</dt>
                <dd>{typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      )}

      <Panel title="Documents">
        {application.documents.length > 0 ? (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>File name</th><th>Type</th><th>Size</th><th>Status</th><th>Review note</th><th>Uploaded</th></tr></thead>
              <tbody>
                {application.documents.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.fileName}</strong></td>
                    <td>{d.kind}</td>
                    <td>{(d.size / 1024).toFixed(1)} KB</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td>{d.reviewNote ?? "—"}</td>
                    <td>{formatDate(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dash-empty__text">No documents uploaded yet.</p>
        )}
      </Panel>
    </>
  );
}
