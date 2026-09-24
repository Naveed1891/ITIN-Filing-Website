import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { DashboardTitle, EmptyRow, Panel, StatusPill } from "@/components/dashboard/DashboardPrimitives";
import { SearchBar, readQuery } from "@/components/dashboard/SearchBar";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const q = readQuery((await searchParams).q);
  const user = await getCurrentUser();
  const items = user
    ? await prisma.applicationDocument.findMany({
        where: {
          application: { userId: user.id },
          ...(q ? { OR: [{ fileName: { contains: q } }, { kind: { contains: q } }, { application: { order: { reference: { contains: q } } } }] } : {}),
        },
        include: { application: { include: { order: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];
  return (
    <div className="space-y-8">
      <DashboardTitle title="Documents" description="Your uploaded ITIN evidence and review status." />
      <Panel title="Document library">
        <SearchBar q={q} placeholder="Search by order ID, file name or type" clearHref="/dashboard/documents" />
        {items.length ? (
          <div className="divide-y divide-border">
            {items.map((x) => (
              <div key={x.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold">{x.fileName}</p>
                  <p className="text-xs text-text-muted">{x.kind} · {x.application.order.reference}</p>
                </div>
                <StatusPill value={x.status} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyRow message={q ? "No documents match your search." : "No documents uploaded yet."} />
        )}
      </Panel>
    </div>
  );
}
