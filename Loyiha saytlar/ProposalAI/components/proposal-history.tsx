"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ProposalView } from "@/lib/proposal-types";

export function ProposalHistory({ proposals }: { proposals: ProposalView[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return proposals;
    }

    return proposals.filter((proposal) => {
      const haystack = [
        proposal.title,
        proposal.clientName,
        proposal.companyName,
        proposal.projectDescription,
        proposal.industry,
        proposal.status
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [proposals, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Proposal history</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Search and edit existing proposals</h3>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search proposals"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 md:w-80"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length ? filtered.map((proposal) => (
          <article key={proposal.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                    {proposal.status}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                    v{proposal.version}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                    {proposal.industry}
                  </span>
                </div>
                <h4 className="font-display text-xl font-bold">{proposal.title}</h4>
                <p className="max-w-3xl text-sm leading-7 text-slate-300">{proposal.projectDescription}</p>
                <p className="text-sm text-slate-400">
                  {proposal.clientName} - {proposal.companyName} - updated {formatDate(proposal.updatedAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/proposals/${proposal.id}`} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                  Edit
                </Link>
                <a href={`/api/export/pdf?proposalId=${proposal.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold">
                  PDF
                </a>
                <a href={`/api/export/docx?proposalId=${proposal.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold">
                  DOCX
                </a>
              </div>
            </div>
          </article>
        )) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-sm text-slate-400">
            No proposals match your search.
          </div>
        )}
      </div>
    </div>
  );
}
