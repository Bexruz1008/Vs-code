export const navigation = [
  { label: "Features", href: "/#features" },
  { label: "Generator", href: "/proposals/new" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Dashboard", href: "/dashboard" }
];

export const features = [
  {
    title: "AI proposal engine",
    description: "Generate a structured proposal with cover page, summary, scope, pricing, and approval section."
  },
  {
    title: "Quota enforcement",
    description: "Free plan caps monthly generation while Pro and Agency unlock unlimited usage."
  },
  {
    title: "Exports",
    description: "Download polished PDFs and DOCX files from the same proposal record."
  },
  {
    title: "Team access",
    description: "Agency workspaces support shared members, roles, and admin analytics."
  },
  {
    title: "SEO content",
    description: "Landing pages, blog posts, schema markup, and fast server-rendered routes."
  },
  {
    title: "Stripe billing",
    description: "Checkout, customer portal, and webhook-driven subscription sync."
  }
];

export const plans = [
  {
    name: "Free",
    price: "$0",
    summary: "3 proposals per month",
    highlights: ["Proposal history", "Basic exports", "Email + Google auth"]
  },
  {
    name: "Pro",
    price: "$29",
    summary: "Unlimited proposals",
    highlights: ["Unlimited generation", "Priority AI", "Full exports"]
  },
  {
    name: "Agency",
    price: "$79",
    summary: "Team access",
    highlights: ["Team seats", "Admin controls", "Analytics"]
  }
];

export const blogPosts = [
  {
    slug: "proposal-pricing-guide",
    title: "How to price a proposal without underselling yourself",
    excerpt: "Use scope, deliverables, and risk framing to justify premium pricing."
  },
  {
    slug: "agency-workflow",
    title: "Agency workflow for faster client approvals",
    excerpt: "Version history, saved templates, and export-ready approvals reduce revision time."
  },
  {
    slug: "stripe-usage-limits",
    title: "Designing subscription limits that feel fair",
    excerpt: "Build useful quotas into the product without blocking the user too early."
  }
];

export const roadmap = [
  {
    title: "Foundation",
    description: "Next.js, TypeScript, Tailwind, Prisma, auth, and shared design tokens."
  },
  {
    title: "AI + storage",
    description: "OpenAI generation, proposal persistence, versioning, and file exports."
  },
  {
    title: "Billing",
    description: "Stripe checkout, portal, webhook sync, and monthly usage enforcement."
  },
  {
    title: "Growth",
    description: "Blog, landing pages, analytics, admin tools, and SEO optimization."
  }
];
