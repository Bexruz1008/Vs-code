import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((entry) => entry.slug === params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((entry) => entry.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="surface p-8">
        <p className="section-kicker">Blog</p>
        <h1 className="section-title mt-2">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">{post.excerpt}</p>
        <div className="mt-8 space-y-5 text-sm leading-8 text-slate-300">
          <p>
            This article page is scaffolded for MDX or CMS content. In production, hook it up to the{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5">BlogPost</code> model in Prisma or a headless CMS, and
            generate metadata plus schema markup per article.
          </p>
          <p>
            The next step is to replace this placeholder copy with publishable editorial content and search-friendly
            landing pages for freelancers, agencies, software teams, designers, marketers, and consultants.
          </p>
        </div>
      </article>
    </div>
  );
}
