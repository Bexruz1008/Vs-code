import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canAccessAdmin } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export default async function AdminPage() {
  const session = await requireSession();

  if (!canAccessAdmin(session.user.role)) {
    notFound();
  }

  const [users, subscriptions, proposals, exports, auditLogs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.subscription.findMany({ orderBy: { updatedAt: "desc" }, take: 8 }),
    prisma.proposal.count(),
    prisma.proposalExport.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <p className="section-kicker">Admin</p>
        <h1 className="section-title mt-2">Operations and analytics</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Manage users, subscriptions, usage, and audit logs from one secure workspace.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Users", value: users.length },
          { label: "Subscriptions", value: subscriptions.length },
          { label: "Proposals", value: proposals },
          { label: "Exports", value: exports }
        ].map((item) => (
          <article key={item.label} className="surface p-5">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-bold">Users</h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-ink-950/40 px-4 py-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{user.name || user.email}</strong>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{user.role}</span>
                </div>
                <p className="mt-2 text-slate-400">{user.email}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface p-6">
          <h2 className="font-display text-2xl font-bold">Audit log</h2>
          <div className="mt-4 space-y-3">
            {auditLogs.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-ink-950/40 px-4 py-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{entry.action}</strong>
                  <span className="text-xs text-slate-400">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="mt-2 text-slate-400">
                  {entry.entityType} {entry.entityId ? `- ${entry.entityId}` : ""}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
