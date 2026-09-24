import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { DashboardTitle, EmptyRow, Panel } from "@/components/dashboard/DashboardPrimitives";
import { SearchBar, readQuery } from "@/components/dashboard/SearchBar";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const q = readQuery((await searchParams).q);
  const user = await getCurrentUser();
  const items = user
    ? await prisma.notification.findMany({
        where: { userId: user.id, ...(q ? { OR: [{ title: { contains: q } }, { body: { contains: q } }] } : {}) },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];
  return (
    <div className="space-y-8">
      <DashboardTitle title="Notifications" description="Important updates about your ITIN filing requests." />
      <Panel title="Updates">
        <SearchBar q={q} placeholder="Search notifications" clearHref="/dashboard/notifications" />
        {items.length ? (
          <div className="divide-y divide-border">
            {items.map((x) => (
              <div key={x.id} className="py-4">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{x.title}</p>
                  {!x.readAt ? <span className="size-2 rounded-full bg-blue" aria-label="Unread" /> : null}
                </div>
                {x.body ? <p className="mt-1 text-sm text-text-muted">{x.body}</p> : null}
                <p className="mt-2 text-xs text-text-muted">{x.createdAt.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyRow message={q ? "No notifications match your search." : "No notifications yet."} />
        )}
      </Panel>
    </div>
  );
}
