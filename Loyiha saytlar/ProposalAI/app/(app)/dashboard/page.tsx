import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { monthKey } from "@/lib/utils";
import { normalizeProposal } from "@/lib/proposal-types";
import { ProposalHistory } from "@/components/proposal-history";

export default async function DashboardPage() {
  const session = await requireSession();
  const proposals = await prisma.proposal.findMany({
    where: {
      ownerId: session.user.id
    },
    orderBy: {
      updatedAt: "desc"
    },
    take: 20
  });

  const usage = await prisma.usageRecord.findUnique({
    where: {
      userId_month: {
        userId: session.user.id,
        month: monthKey()
      }
    }
  });

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const normalized = proposals.map(normalizeProposal);
  const uniqueClients = new Set(normalized.map((proposal) => proposal.clientName.toLowerCase())).size;

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Dashboard</p>
            <h1 className="section-title mt-2">Your proposal workspace</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Track proposal history, search drafts, and edit existing records. Everything here is connected to the
              same Prisma workspace and billing cycle.
            </p>
          </div>
          <Link href="/proposals/new" className="btn-primary">
            New proposal
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total proposals", value: normalized.length },
          { label: "Unique clients", value: uniqueClients },
          { label: "Monthly usage", value: usage?.proposalCount ?? 0 },
          { label: "Plan", value: subscription?.plan ?? "FREE" }
        ].map((item) => (
          <article key={item.label} className="surface p-5">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="surface p-6">
        <ProposalHistory proposals={normalized} />
      </section>
    </div>
  );
}
