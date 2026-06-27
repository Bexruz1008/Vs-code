import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "SEO-ready articles on proposal writing, agency workflows, and Stripe subscription design."
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="section-kicker">Blog</p>
        <h1 className="section-title mt-2">SEO-ready content for proposals, pricing, and growth.</h1>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="surface p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Article</p>
            <h2 className="mt-3 font-display text-2xl font-bold">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-500">
              Open article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
