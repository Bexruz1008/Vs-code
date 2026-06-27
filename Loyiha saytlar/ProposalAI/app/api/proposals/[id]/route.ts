import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { proposalInputSchema } from "@/lib/validators";
import { generateProposalContent } from "@/lib/proposal-engine";
import { getCurrentSession } from "@/lib/session";
import { normalizeProposal } from "@/lib/proposal-types";
import { slugify } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: params.id,
      ownerId: session.user.id
    }
  });

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ proposal: normalizeProposal(proposal) });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = proposalInputSchema.parse(await request.json());
    const existing = await prisma.proposal.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const content = await generateProposalContent(input);
    const nextVersion = existing.version + 1;
    const title = input.title?.trim() || content.coverPage.title;

    const proposal = await prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id: existing.id },
        data: {
          title,
          slug: existing.slug || `${slugify(title)}-${Date.now().toString(36)}`,
          clientName: input.clientName,
          companyName: input.companyName,
          projectDescription: input.projectDescription,
          budget: input.budget,
          timeline: input.timeline,
          servicesOffered: input.servicesOffered,
          industry: input.industry,
          tone: input.tone,
          summary: content.executiveSummary,
          content,
          version: nextVersion,
          status: "DRAFT"
        }
      });

      await tx.proposalVersion.create({
        data: {
          proposalId: updated.id,
          version: nextVersion,
          snapshot: content
        }
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE",
          entityType: "Proposal",
          entityId: updated.id,
          metadata: {
            version: nextVersion
          }
        }
      });

      return updated;
    });

    return NextResponse.json({ proposal: normalizeProposal(proposal) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update proposal."
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: params.id,
      ownerId: session.user.id
    }
  });

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  await prisma.proposal.delete({ where: { id: proposal.id } });
  return NextResponse.json({ ok: true });
}
