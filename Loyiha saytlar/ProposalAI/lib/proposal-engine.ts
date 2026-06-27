import OpenAI from "openai";
import { proposalContentSchema, type ProposalContent, type ProposalInput } from "@/lib/validators";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateProposalContent(input: ProposalInput): Promise<ProposalContent> {
  if (!client) {
    return buildFallbackContent(input);
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const prompt = [
    "You are ProposalAI, a premium proposal writer.",
    "Return valid JSON only. No markdown fences. No prose outside JSON.",
    "Use the exact schema: coverPage, executiveSummary, scopeOfWork, deliverables, timeline, pricing, termsAndConditions, signature.",
    "Make the tone polished, credible, and concise.",
    "Tailor language for freelancers, agencies, software companies, designers, marketers, and consultants.",
    "",
    `Client Name: ${input.clientName}`,
    `Company Name: ${input.companyName}`,
    `Proposal Title: ${input.title || ""}`,
    `Project Description: ${input.projectDescription}`,
    `Budget: ${input.budget}`,
    `Timeline: ${input.timeline}`,
    `Services Offered: ${input.servicesOffered}`,
    `Industry: ${input.industry}`,
    `Tone: ${input.tone}`
  ].join("\n");

  const response = await client.responses.create({
    model,
    input: prompt
  });

  const parsed = safeParseJson(response.output_text);
  return proposalContentSchema.parse(parsed);
}

export function buildFallbackContent(input: ProposalInput): ProposalContent {
  const services = splitServices(input.servicesOffered);
  const title = input.title?.trim() || `${input.clientName} Proposal`;

  return {
    coverPage: {
      title,
      clientName: input.clientName,
      companyName: input.companyName,
      projectDescription: input.projectDescription
    },
    executiveSummary: `This proposal outlines a ${input.tone.toLowerCase()} delivery plan for ${input.clientName}, focusing on clear scope, measurable outcomes, and a premium client experience.`,
    scopeOfWork: services.length ? services : ["Discovery", "Strategy", "Execution"],
    deliverables: [
      "Cover page",
      "Executive summary",
      "Scope of work",
      "Deliverables",
      "Timeline",
      "Pricing",
      "Terms and conditions",
      "Signature section"
    ],
    timeline: [
      {
        title: "Week 1",
        body: "Discovery, alignment, and proposal refinement."
      },
      {
        title: "Week 2-3",
        body: "Core delivery and weekly review checkpoints."
      },
      {
        title: "Final review",
        body: "Approval, export, and signed handoff."
      }
    ],
    pricing: [
      {
        title: "Estimated investment",
        body: input.budget
      },
      {
        title: "Payment structure",
        body: "50% upfront, 50% on final delivery"
      }
    ],
    termsAndConditions: [
      "Three revision rounds are included.",
      "Out-of-scope work is billed separately.",
      "Proposal is valid for 14 days.",
      "Final files are delivered after the initial payment."
    ],
    signature: {
      companyRepresentative: input.companyName,
      clientRepresentative: input.clientName
    }
  };
}

function splitServices(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeParseJson(text: string | undefined | null) {
  if (!text) {
    return buildFallbackContent({
      clientName: "Client",
      companyName: "Company",
      projectDescription: "Project",
      budget: "$0",
      timeline: "TBD",
      servicesOffered: "",
      industry: "General",
      tone: "Premium"
    });
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    return buildFallbackContent({
      clientName: "Client",
      companyName: "Company",
      projectDescription: "Project",
      budget: "$0",
      timeline: "TBD",
      servicesOffered: "",
      industry: "General",
      tone: "Premium"
    });
  }
}
