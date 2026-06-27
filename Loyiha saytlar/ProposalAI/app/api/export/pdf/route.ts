import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { createProposalPdfBuffer } from "@/lib/export";
import { monthKey } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const proposalId = url.searchParams.get("proposalId");
  if (!proposalId) {
    return NextResponse.json({ error: "proposalId is required" }, { status: 400 });
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      ownerId: session.user.id
    }
  });

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const buffer = await createProposalPdfBuffer(proposal.content as any);

  await prisma.$transaction([
    prisma.proposalExport.create({
      data: {
        proposalId: proposal.id,
        fileType: "pdf",
        fileName: `${proposal.slug}.pdf`,
        fileUrl: `/api/export/pdf?proposalId=${proposal.id}`,
        status: "READY"
      }
    }),
    prisma.usageRecord.upsert({
      where: {
        userId_month: {
          userId: session.user.id,
          month: monthKey()
        }
      },
      update: {
        exportCount: {
          increment: 1
        }
      },
      create: {
        userId: session.user.id,
        month: monthKey(),
        exportCount: 1
      }
    }),
    prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "EXPORT",
        entityType: "Proposal",
        entityId: proposal.id,
        metadata: { fileType: "pdf" }
      }
    })
  ]);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${proposal.slug}.pdf"`
    }
  });
}
