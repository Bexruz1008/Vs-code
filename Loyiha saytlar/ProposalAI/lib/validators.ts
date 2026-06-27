import { z } from "zod";

export const proposalInputSchema = z.object({
  title: z.string().optional(),
  clientName: z.string().min(2),
  companyName: z.string().min(2),
  projectDescription: z.string().min(20),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  servicesOffered: z.string().min(5),
  industry: z.string().min(2),
  tone: z.string().min(2)
});

export const proposalSectionSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional()
});

export const proposalContentSchema = z.object({
  coverPage: z.object({
    title: z.string(),
    clientName: z.string(),
    companyName: z.string(),
    projectDescription: z.string()
  }),
  executiveSummary: z.string(),
  scopeOfWork: z.array(z.string()),
  deliverables: z.array(z.string()),
  timeline: z.array(proposalSectionSchema),
  pricing: z.array(proposalSectionSchema),
  termsAndConditions: z.array(z.string()),
  signature: z.object({
    companyRepresentative: z.string(),
    clientRepresentative: z.string()
  })
});

export const authRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export type ProposalInput = z.infer<typeof proposalInputSchema>;
export type ProposalContent = z.infer<typeof proposalContentSchema>;
export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
