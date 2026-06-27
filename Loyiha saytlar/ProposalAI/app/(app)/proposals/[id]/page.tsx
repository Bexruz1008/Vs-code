import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { normalizeProposal } from "@/lib/proposal-types";
import { ProposalBuilder } from "@/components/proposal-builder";

export default async function EditProposalPage({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: params.id,
      ownerId: session.user.id
    }
  });

  if (!proposal) {
    notFound();
  }

  return <ProposalBuilder initialProposal={normalizeProposal(proposal)} />;
}
