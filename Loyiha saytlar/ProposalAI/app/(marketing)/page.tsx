import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, features, plans, roadmap } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Proposal Generator",
  description: "Generate premium client proposals with AI, billing, exports, dashboard search, and admin tools."
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
        <div className="space-y-6">
          <span className="section-kicker">Proposal generation for premium service businesses</span>
          <h1 className="section-title max-w-3xl">
            Generate polished client proposals with AI, billing, and exports in one workspace.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            ProposalAI helps freelancers, agencies, software companies, designers, marketers, and consultants move from
            brief to branded proposal faster. It includes authentication, dashboards, subscriptions, admin controls,
            and SEO-ready content pages.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/proposals/new" className="btn-primary">
              Start building
            </Link>
            <Link href="/pricing" className="btn-secondary">
              View pricing
            </Link>
          </div>
        </div>

        <div className="surface p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Product snapshot</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Everything a proposal SaaS needs</h2>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Live stack
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Email + Google auth",
              "OpenAI proposal generation",
              "PDF and DOCX export",
              "Dashboard history and search",
              "Stripe subscriptions",
              "Admin analytics"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-ink-950/40 px-4 py-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-10">
        <div className="mb-6">
          <p className="section-kicker">Features</p>
          <h2 className="section-title mt-2">Built for the full proposal workflow.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="surface p-6">
              <h3 className="font-display text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="surface p-6">
          <p className="section-kicker">Workflow</p>
          <h2 className="section-title mt-2">From brief to signed proposal.</h2>
          <div className="mt-6 space-y-4">
            {[
              "Capture client, budget, timeline, and services.",
              "Generate a structured proposal with AI.",
              "Edit, version, and export in PDF or DOCX.",
              "Track usage limits and paid subscriptions."
            ].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-ink-950/40 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-500/15 font-display font-bold text-brand-500">
                  {index + 1}
                </div>
                <p className="pt-2 text-sm leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface p-6">
          <p className="section-kicker">Pricing</p>
          <h2 className="section-title mt-2">Plans mapped to usage.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="rounded-3xl border border-white/10 bg-ink-950/40 p-5">
                <p className="text-sm font-semibold text-brand-500">{plan.name}</p>
                <p className="mt-2 font-display text-3xl font-bold">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  {plan.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="py-10">
        <div className="mb-6">
          <p className="section-kicker">SEO content</p>
          <h2 className="section-title mt-2">Blog and landing pages included.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Blog</p>
              <h3 className="mt-3 font-display text-xl font-bold">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-500">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-6">
          <p className="section-kicker">Implementation plan</p>
          <h2 className="section-title mt-2">Production-ready architecture.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((item, index) => (
            <article key={item.title} className="surface p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Phase {index + 1}</p>
              <h3 className="mt-3 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
