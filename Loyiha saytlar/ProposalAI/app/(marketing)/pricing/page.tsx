import type { Metadata } from "next";
import Link from "next/link";
import { plans } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare the Free, Pro, and Agency plans for ProposalAI."
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="section-kicker">Pricing</p>
        <h1 className="section-title mt-2">Choose the plan that matches your proposal volume.</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`surface p-6 ${index === 1 ? "border-brand-500/40 bg-brand-500/10" : ""}`}
          >
            <p className="text-sm font-semibold text-brand-500">{plan.name}</p>
            <h2 className="mt-3 font-display text-4xl font-bold">{plan.price}</h2>
            <p className="mt-3 text-sm text-slate-300">{plan.summary}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {plan.highlights.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <Link href="/sign-up" className="btn-primary mt-8 w-full">
              {index === 0 ? "Try Free" : "Get started"}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
