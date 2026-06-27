import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { proposalInputSchema } from "@/lib/validators";
import { generateProposalContent } from "@/lib/proposal-engine";
import { getCurrentSession } from "@/lib/session";
import { monthKey, slugify } from "@/lib/utils";
import { monthlyProposalLimits } from "@/lib/permissions";
import { normalizeProposal } from "@/lib/proposal-types";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proposals = await prisma.proposal.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({
    proposals: proposals.map(normalizeProposal)
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = proposalInputSchema.parse(await request.json());
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" }
    });
    const plan = subscription?.plan ?? "FREE";
    const usage = await prisma.usageRecord.findUnique({
      where: {
        userId_month: {
          userId: session.user.id,
          month: monthKey()
        }
      }
    });

    const limit = monthlyProposalLimits[plan];
    if (Number.isFinite(limit) && (usage?.proposalCount ?? 0) >= limit) {
      return NextResponse.json(
        { error: "Monthly limit reached. Upgrade to Pro or Agency." },
        { status: 402 }
      );
    }

    const content = await generateProposalContent(input);
    const title = input.title?.trim() || content.coverPage.title;
    const organization = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true }
    });

    const proposal = await prisma.$transaction(async (tx) => {
      const created = await tx.proposal.create({
        data: {
          title,
          slug: `${slugify(title)}-${Date.now().toString(36)}`,
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
          status: "DRAFT",
          ownerId: session.user.id,
          organizationId: organization?.organizationId ?? null
        }
      });

      await tx.proposalVersion.create({
        data: {
          proposalId: created.id,
          version: 1,
          snapshot: content
        }
      });

      await tx.usageRecord.upsert({
        where: {
          userId_month: {
            userId: session.user.id,
            month: monthKey()
          }
        },
        update: {
          proposalCount: {
            increment: 1
          }
        },
        create: {
          userId: session.user.id,
          month: monthKey(),
          proposalCount: 1
        }
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE",
          entityType: "Proposal",
          entityId: created.id,
          metadata: {
            title
          }
        }
      });

      return created;
    });

    return NextResponse.json({ proposal: normalizeProposal(proposal) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create proposal."
      },
      { status: 400 }
    );
  }
}
