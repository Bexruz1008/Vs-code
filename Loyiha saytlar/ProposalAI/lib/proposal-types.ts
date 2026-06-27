import { proposalContentSchema, type ProposalContent } from "@/lib/validators";

export type ProposalView = {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  companyName: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  servicesOffered: string;
  industry: string;
  tone: string;
  summary: string | null;
  status: string;
  version: number;
  content: ProposalContent;
  createdAt: string;
  updatedAt: string;
};

export function normalizeProposal(row: {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  companyName: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  servicesOffered: string;
  industry: string;
  tone: string;
  summary: string | null;
  status: string;
  version: number;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}): ProposalView {
  return {
    ...row,
    content: proposalContentSchema.parse(row.content),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}
