import type { ProposalContent } from "@/lib/validators";
import { cn } from "@/lib/utils";

export function ProposalPreview({ content, className }: { content: ProposalContent; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-500">Cover Page</p>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{content.coverPage.title}</h3>
        <p className="mt-4 text-slate-300">{content.coverPage.projectDescription}</p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h4 className="font-display text-xl font-bold">Executive Summary</h4>
        <p className="mt-3 leading-7 text-slate-300">{content.executiveSummary}</p>
      </section>

      <Section title="Scope of Work" items={content.scopeOfWork} />
      <Section title="Deliverables" items={content.deliverables} />

      <section className="grid gap-4 md:grid-cols-2">
        <Section title="Timeline" items={content.timeline.map((item) => `${item.title}: ${item.body ?? ""}`)} />
        <Section title="Pricing" items={content.pricing.map((item) => `${item.title}: ${item.body ?? ""}`)} />
      </section>

      <Section title="Terms and Conditions" items={content.termsAndConditions} />

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-mint-500/10 p-6">
        <h4 className="font-display text-xl font-bold">Signature Section</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Company</p>
            <p className="mt-2 font-semibold">{content.signature.companyRepresentative}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Client</p>
            <p className="mt-2 font-semibold">{content.signature.clientRepresentative}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h4 className="font-display text-xl font-bold">{title}</h4>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-ink-950/40 px-4 py-3 text-sm text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
