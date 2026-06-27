# ProposalAI

Production-ready full-stack scaffold for an AI proposal SaaS.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth
- OpenAI Responses API
- Stripe

## What is included

- Marketing site
- Blog and pricing pages
- Email/password and Google authentication
- Proposal generator
- Proposal history and editing
- PDF and DOCX exports
- Billing and Stripe webhook routes
- Admin dashboard
- Prisma data model and usage tracking

## Setup

1. Copy `.env.example` to `.env.local`
2. Set `DATABASE_URL`
3. Set `NEXTAUTH_SECRET`
4. Add Google OAuth keys if needed
5. Add OpenAI and Stripe keys
6. Run:

```bash
npm install
npm run db:push
npm run dev
```

## Notes

- The OpenAI integration uses the Responses API and falls back to a deterministic template when `OPENAI_API_KEY` is missing.
- Stripe checkout and portal routes return helpful responses when keys are not configured yet.
- The app is wired for a single workspace per user, with room to expand into multiple organizations.
