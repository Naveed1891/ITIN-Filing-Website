import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { PageHeading, Panel, EmptyState } from "@/components/dashboard/DashboardPrimitives";
import { SupportForm } from "@/components/dashboard/SupportForm";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await getCurrentUser();
  const messages = user
    ? await prisma.message.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <>
      <PageHeading
        title="Support"
        description="Send a message to our team or view previous conversations."
      />

      <Panel title="Send a message">
        <SupportForm />
      </Panel>

      <Panel title="Previous messages">
        {messages.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "1rem 0",
                  borderBottom: "1px solid #E3E8EE",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1B2B3A" }}>
                    {msg.subject ?? "Support message"}
                  </p>
                  <span
                    className={`dash-badge dash-badge--${msg.direction === "INBOUND" ? "info" : "ok"}`}
                    style={{ flexShrink: 0 }}
                  >
                    {msg.direction === "INBOUND" ? "You" : "Team"}
                  </span>
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "14px", color: "#5A6B7B", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {msg.body}
                </p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "12px", color: "#9AA7B4" }}>
                  {msg.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {msg.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No messages yet"
            description="Send your first message above and our team will respond shortly."
          />
        )}
      </Panel>
    </>
  );
}
