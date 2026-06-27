import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { normalizeProposal } from "@/lib/proposal-types";
import { ProposalHistory } from "@/components/proposal-history";

export default async function ProposalsPage() {
  const session = await requireSession();
  const proposals = await prisma.proposal.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  const normalized = proposals.map(normalizeProposal);

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Proposals</p>
            <h1 className="section-title mt-2">Proposal history</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Search, duplicate, edit, and export your proposals from one central library.
            </p>
          </div>
          <Link href="/proposals/new" className="btn-primary">
            New proposal
          </Link>
        </div>
      </section>

      <section className="surface p-6">
        <ProposalHistory proposals={normalized} />
      </section>
    </div>
  );
}
