"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { ProposalContent, ProposalInput } from "@/lib/validators";
import { ProposalPreview } from "@/components/proposal-preview";
import type { ProposalView } from "@/lib/proposal-types";

type BuilderState = ProposalInput & {
  title?: string;
};

export function ProposalBuilder({ initialProposal }: { initialProposal?: ProposalView | null }) {
  const initial: BuilderState = useMemo(
    () => ({
      title: initialProposal?.title ?? "",
      clientName: initialProposal?.clientName ?? "",
      companyName: initialProposal?.companyName ?? "",
      projectDescription: initialProposal?.projectDescription ?? "",
      budget: initialProposal?.budget ?? "",
      timeline: initialProposal?.timeline ?? "",
      servicesOffered: initialProposal?.servicesOffered ?? "",
      industry: initialProposal?.industry ?? "Software",
      tone: initialProposal?.tone ?? "Premium"
    }),
    [initialProposal]
  );

  const [form, setForm] = useState<BuilderState>(initial);
  const [proposal, setProposal] = useState<ProposalView | null>(initialProposal ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialProposal?.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isEditing ? `/api/proposals/${initialProposal?.id}` : "/api/proposals";
      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save proposal.");
      }

      setProposal(payload.proposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save proposal.");
    } finally {
      setLoading(false);
    }
  }

  const previewContent = proposal?.content ?? buildPreview(form);
  const proposalTitle = proposal?.title || form.title || `${form.clientName || "Client"} Proposal`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Proposal generator</p>
          <h2 className="mt-2 font-display text-3xl font-bold">{isEditing ? "Edit proposal" : "Create proposal"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Generate a polished client proposal, then review and export it from the same record.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Client Name">
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="input" />
          </Field>
          <Field label="Company Name">
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="input" />
          </Field>
          <Field label="Budget">
            <input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input" />
          </Field>
          <Field label="Timeline">
            <input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="input" />
          </Field>
          <Field label="Industry">
            <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input">
              <option>Freelance</option>
              <option>Agency</option>
              <option>Software</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Consulting</option>
            </select>
          </Field>
          <Field label="Tone">
            <select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="input">
              <option>Premium</option>
              <option>Direct</option>
              <option>Warm</option>
              <option>Executive</option>
            </select>
          </Field>
          <Field label="Proposal Title" className="md:col-span-2">
            <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </Field>
          <Field label="Project Description" className="md:col-span-2">
            <textarea
              value={form.projectDescription}
              onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
              rows={5}
              className="input"
            />
          </Field>
          <Field label="Services Offered" className="md:col-span-2">
            <textarea
              value={form.servicesOffered}
              onChange={(e) => setForm({ ...form, servicesOffered: e.target.value })}
              rows={4}
              className="input"
            />
          </Field>
        </div>

        {error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        <div className="flex flex-wrap gap-3">
          <button disabled={loading} className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
            {loading ? "Saving..." : isEditing ? "Update proposal" : "Generate proposal"}
          </button>
          <a href={proposal ? `/api/export/pdf?proposalId=${proposal.id}` : "#"} className="rounded-full border border-white/10 px-5 py-3 font-semibold">
            PDF
          </a>
          <a href={proposal ? `/api/export/docx?proposalId=${proposal.id}` : "#"} className="rounded-full border border-white/10 px-5 py-3 font-semibold">
            DOCX
          </a>
        </div>
      </form>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Live preview</p>
          <h3 className="mt-2 font-display text-2xl font-bold">{proposalTitle}</h3>
        </div>
        <ProposalPreview content={previewContent} />
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function buildPreview(form: ProposalInput): ProposalContent {
  return {
    coverPage: {
      title: form.title?.trim() || `${form.clientName || "Client"} Proposal`,
      clientName: form.clientName || "Client",
      companyName: form.companyName || "Company",
      projectDescription: form.projectDescription || "Project description"
    },
    executiveSummary: `A ${form.tone.toLowerCase()} proposal for ${form.clientName || "your client"} focused on measurable outcomes.`,
    scopeOfWork: split(form.servicesOffered),
    deliverables: ["Cover page", "Executive summary", "Scope of work", "Deliverables", "Timeline", "Pricing", "Terms", "Signature"],
    timeline: [{ title: "Planning", body: form.timeline || "Timeline to be confirmed" }],
    pricing: [{ title: "Budget", body: form.budget || "$0" }],
    termsAndConditions: ["Three revision rounds are included.", "Out-of-scope work is billed separately."],
    signature: {
      companyRepresentative: form.companyName || "Company",
      clientRepresentative: form.clientName || "Client"
    }
  };
}

function split(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
